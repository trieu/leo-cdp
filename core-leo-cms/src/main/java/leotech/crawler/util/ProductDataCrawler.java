package leotech.crawler.util;

import java.net.URL;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.TimeUnit;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

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
					return process(url);
				}
			});

	static ConcurrentMap<String, ProductExtInfoParser> hostToParser = new ConcurrentHashMap<>();

	public static void addProductExtInfoParser(String host, ProductExtInfoParser parser) {
		hostToParser.put(host, parser);
	}

	public static abstract class ProductExtInfoParser {
		protected ProductItem item;
		protected Document doc;

		public ProductExtInfoParser() {
		}

		public void init(ProductItem item, Document doc) {
			this.item = item;
			this.doc = doc;
		}

		public abstract void process();
	}

	public static ProductItem parseHtmlToProductItem(String urlStr, String html) throws Exception {
		URL url = new URL(urlStr);
		String host = url.getHost();

		Document doc = Jsoup.parse(html);

		String ogType = JsoupParserUtil.getAttr(doc, "meta[property='og:type']", "content").toLowerCase();
		if (!"product".equals(ogType)) {
			// skip if not a product
			return null;
		}

		// new product item
		ProductItem p = new ProductItem(urlStr);

		// start common parser for Open Graph
		String title = JsoupParserUtil.getAttr(doc, "meta[property='og:title']", "content");
		if (StringUtil.isEmpty(title)) {
			title = JsoupParserUtil.getText(doc, "title");
		}

		String description = JsoupParserUtil.getAttr(doc, "meta[property='og:description']", "content");

		String productImage = JsoupParserUtil.getAttr(doc, "meta[property='og:image']", "content").replace("http:",
				"https:");

		String salePrice = JsoupParserUtil.getAttr(doc, "meta[property='og:price:amount']", "content");

		String priceCurrency = JsoupParserUtil.getAttr(doc, "meta[property='og:price:currency']", "content");

		String fullUrl = JsoupParserUtil.getAttr(doc, "meta[property='og:url']", "content");

		String siteName = JsoupParserUtil.getAttr(doc, "meta[property='og:site_name']", "content");

		String itemCondition = JsoupParserUtil.getAttr(doc, "link[itemprop='itemCondition']", "href");

		String availability = JsoupParserUtil.getAttr(doc, "link[itemprop='availability']", "href");

		ProductExtInfoParser parser = hostToParser.get(host);
		if (parser != null) {
			parser.init(p, doc);
			parser.process();
		}

		p.setName(title);
		p.setDescription(description);
		p.setImage(productImage);
		p.setSalePrice(salePrice);
		p.setPriceCurrency(priceCurrency);
		p.setFullUrl(fullUrl);
		p.setSiteDomain(host);
		p.setSiteName(siteName);
		p.setItemCondition(itemCondition);
		p.setAvailability(availability);

		return p;
	}

	public static ProductItem process(String urlStr) {
		// get HTML from URL
		try {
			String html = HttpClientUtil.executeGet(urlStr);
			if(html.equals("404")) {
				return new ProductItem("");
			}
			return parseHtmlToProductItem(urlStr, html);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ProductItem("");
	}

	public static ProductItem processWithCache(String url) throws Exception {
		ProductItem p = cache.get(url);
		return p;
	}

	public static void main(String[] args) throws Exception {

		ProductDataCrawler.addProductExtInfoParser("eshop.guardian.vn", new ProductExtInfoParser() {
			@Override
			public void process() {
				String sku = JsoupParserUtil.getText(doc, "span[id='pro_sku']").replace("SKU:", "").trim();
				this.item.setSku(sku);

				String originalPrice = JsoupParserUtil.getText(doc, "div[id='price-preview'] del").replace("₫", "")
						.replace(",", "").trim();
				this.item.setOriginalPrice(originalPrice);
			}
		});

		String url = "https://eshop.guardian.vn/products/mat-na-toc-tsubaki-phuc-hoi-hu-ton-180g";
		ProductItem p = ProductDataCrawler.processWithCache(url);
		if(! p.isEmpty() ) {
			System.out.println(p);
		}
		
	}

}
