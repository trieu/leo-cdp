package leotech.crawler.util;

import java.net.URL;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.TimeUnit;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

import leotech.cdp.model.business.ProductItem;
import rfx.core.util.HttpClientUtil;
import rfx.core.util.StringUtil;

public class ProductDataCrawler {

	static final LoadingCache<String, ProductItem> cache = CacheBuilder.newBuilder().maximumSize(100000)
			.expireAfterWrite(2, TimeUnit.HOURS).build(new CacheLoader<String, ProductItem>() {
				public ProductItem load(String url) {
					return processProductUrl(url);
				}
			});

	static ConcurrentMap<String, ProductExtInfoParser> hostToParser = new ConcurrentHashMap<>();

	public static void addProductExtInfoParser(String host, ProductExtInfoParser parser) {
		hostToParser.put(host, parser);
	}

	public static abstract class ProductExtInfoParser {
		protected ProductItem item;
		protected Document doc;
		protected final boolean isSeleniumJsParser;

		public ProductExtInfoParser(boolean isSeleniumJsParser) {
			this.isSeleniumJsParser = isSeleniumJsParser;
		}

		public ProductExtInfoParser() {
			this.isSeleniumJsParser = false;
		}

		public void init(ProductItem item, Document doc) {
			this.item = item;
			this.doc = doc;
		}

		public abstract void process();
	}

	public static ProductItem parseHtmlToProductItem(String host, String urlStr, String html) throws Exception {
		return parseHtmlToProductItem(host, urlStr, html, null);
	}

	public static ProductItem parseHtmlToProductItem(String host, String urlStr, String html, ProductExtInfoParser parser) throws Exception {
		Document doc = Jsoup.parse(html);

		String ogType = JsoupParserUtil.getAttr(doc, "meta[property=\"og:type\"]", "content").toLowerCase();
		if(! ogType.equals("product") ) {
			return new ProductItem();
		}

		// start common parser for Open Graph
		String name = JsoupParserUtil.getAttr(doc, "meta[property='og:title']", "content");
		if (StringUtil.isEmpty(name)) {
			name = JsoupParserUtil.getText(doc, "title");
		}
		// new product item
		ProductItem p = new ProductItem(urlStr, name, host);

		String description = JsoupParserUtil.getAttr(doc, "meta[property='og:description']", "content");
		p.setDescription(description);

		String productImage = JsoupParserUtil.getAttr(doc, "meta[property='og:image']", "content").replace("http:","https:");
		p.setImage(productImage);

		String salePrice = JsoupParserUtil.getAttr(doc, "meta[property='og:price:amount']", "content");
		p.setSalePrice(salePrice);

		String priceCurrency = JsoupParserUtil.getAttr(doc, "meta[property='og:price:currency']", "content");
		p.setPriceCurrency(priceCurrency);

		String fullUrl = JsoupParserUtil.getAttr(doc, "meta[property='og:url']", "content");
		p.setFullUrl(fullUrl);

		String siteName = JsoupParserUtil.getAttr(doc, "meta[property='og:site_name']", "content");
		p.setSiteName(siteName);

		String itemCondition = JsoupParserUtil.getAttr(doc, "link[itemprop='itemCondition']", "href");
		p.setItemCondition(itemCondition);

		String availability = JsoupParserUtil.getAttr(doc, "link[itemprop='availability']", "href");
		p.setAvailability(availability);

		// call parser for ext info
		if (parser != null) {
			parser.init(p, doc);
			parser.process();
		}

		return p;
	}

	public static String getHtmlBySelenium(String urlStr) {
		ChromeOptions options = new ChromeOptions();
		options.addArguments("--headless", "--disable-gpu", "--window-size=1920,1200","--ignore-certificate-errors");

		ChromeDriver driver = new ChromeDriver(options);
		driver.get(urlStr);

		String html = driver.getPageSource();
		
		// TODO add run ext JS for get data
//		Object rs = driver.executeScript(" return jQuery('script[type=\"application/ld+json\"').text() ;");
//		// System.out.println(rs);
//		JsonObject ldJsonObj = new JsonParser().parse(rs.toString().trim().split("\n")[0]).getAsJsonObject();
//		System.out.println(ldJsonObj);
		
		return html;
	}

	public static ProductItem processProductUrl(String urlStr) {
		// get HTML from URL
		try {
			URL url = new URL(urlStr);
			String host = url.getHost();

			String html = "404";
			ProductExtInfoParser parser = hostToParser.get(host);
			if (parser != null) {
				if (parser.isSeleniumJsParser) {
					html = getHtmlBySelenium(urlStr); // for AJAX web page that
														// require JavaScript
														// executor
				} else {
					html = HttpClientUtil.executeGet(urlStr); // for normal web
																// page
				}
			} else {
				html = HttpClientUtil.executeGet(urlStr); // for normal web page
			}

			System.out.println("process html.length" + html.length());

			if (html.equals("404")) {
				return new ProductItem();
			}
			return parseHtmlToProductItem(host, urlStr, html, parser);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ProductItem();
	}

	public static ProductItem processWithCache(String url) throws Exception {
		ProductItem p = cache.get(url);
		return p;
	}

	public static void main(String[] args) throws Exception {

		System.setProperty("webdriver.chrome.driver", "/Users/mac/programs/webdriver/chromedriver");

		ProductDataCrawler.addProductExtInfoParser("eshop.guardian.vn", new ProductExtInfoParser() {
			@Override
			public void process() {
				String sku = JsoupParserUtil.getText(doc, "span[id='pro_sku']").replace("SKU:", "").trim();
				this.item.setSku(sku);

				double originalPrice = JsoupParserUtil.getDoubleNumber(doc, "div[id='price-preview'] del");
				this.item.setOriginalPrice(originalPrice);
			}
		});

		ProductDataCrawler.addProductExtInfoParser("www.fahasa.com", new ProductExtInfoParser(true) {
			@Override
			public void process() {
				double originalPrice = JsoupParserUtil.getDoubleNumber(doc,
						"div[id='catalog-product-details-price'] .old-price .price");
				System.out.println("originalPrice " + originalPrice);
				this.item.setOriginalPrice(originalPrice);

				double salePrice = JsoupParserUtil.getDoubleNumber(doc,
						"div[id='catalog-product-details-price'] .special-price .price");
				System.out.println("salePrice " + salePrice);
				this.item.setSalePrice(salePrice);
			}
		});

		// String url =
		// "https://eshop.guardian.vn/products/dau-goi-tresemme-keratin-smooth-vao-nep-suon-muot-650g";

		String url = "https://www.fahasa.com/chu-nghia-khac-ky-phong-cach-song-ban-linh-va-binh-than.html";
		ProductItem p = ProductDataCrawler.processProductUrl(url);
		if (!p.isEmpty()) {
			System.out.println(p);
		}

	}

}
