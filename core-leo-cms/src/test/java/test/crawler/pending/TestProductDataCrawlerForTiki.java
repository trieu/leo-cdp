package test.crawler.pending;

import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

import leotech.cdp.model.business.ProductItem;
import leotech.crawler.util.JsoupParserUtil;
import rfx.core.util.HttpClientUtil;
import rfx.core.util.StringUtil;

public class TestProductDataCrawlerForTiki {

	static final LoadingCache<String, ProductItem> cache = CacheBuilder.newBuilder().maximumSize(100000)
			.expireAfterWrite(2, TimeUnit.HOURS).build(new CacheLoader<String, ProductItem>() {
				public ProductItem load(String url) {
					ProductItem p = null;
					try {
						p = processWithRules(url);
					} catch (Exception e) {
						e.printStackTrace();
					}
					return p;
				}
			});

	static Map<String, ProductExtInfoParser> hostToParser = new HashMap<>();

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
		if( ! "website".equals(ogType) ) {
			//skip if not a product
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

		String productImage = JsoupParserUtil.getAttr(doc, "meta[property='og:image']", "content").replace("http:","https:");

		String salePrice = JsoupParserUtil.getAttr(doc, "div.summary meta[itemprop='price']", "content");

		String priceCurrency = JsoupParserUtil.getAttr(doc, "div.summary meta[itemprop='priceCurrency']", "content");

		String fullUrl = JsoupParserUtil.getAttr(doc, "div.summary meta[itemprop='url']", "content");

		String siteName = JsoupParserUtil.getAttr(doc, "meta[property='og:site_name']", "content");

		// tiki.vn không có info này
//		String itemCondition = JsoupParserUtil.getAttr(doc, "link[itemprop='itemCondition']", "href");

		String availability = JsoupParserUtil.getAttr(doc, "link[itemprop='availability']", "href");
		
		String brand = JsoupParserUtil.getAttr(doc, "div.brand meta[itemprop='name']", "content");
		
		List<String> categories = JsoupParserUtil.getTexts(doc, "a[class='Breadcrumb__Item-sc-1a3qw0s-1 hjpGLl']:gt(0):not(a[href='#'])");
		

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
//		p.setItemCondition(itemCondition);
		p.setAvailability(availability);
		p.setCategories(categories);
		p.setBrand(brand);

		return p;
	}

	protected static ProductItem processWithRules(String urlStr) throws Exception {
		// get HTML from URL
		String html = HttpClientUtil.executeGet(urlStr);
		
		return parseHtmlToProductItem(urlStr, html);
	}

	public static ProductItem process(String url) throws Exception {
		ProductItem p = cache.get(url);
		return p;
	}

	public static void main(String[] args) throws Exception {

		TestProductDataCrawlerForTiki.addProductExtInfoParser("tiki.vn", new ProductExtInfoParser() {
			@Override
			public void process() {
				String sku = JsoupParserUtil.getText(doc, "span[itemprop='sku']").replace("SKU:", "").trim();
				this.item.setSku(sku);

				String originalPrice = JsoupParserUtil.getText(doc, "p[class='original-price']").replace("Giá thị trường:", "").replace("₫", "")
						.replace(".", "").trim();
				this.item.setOriginalPrice(originalPrice);
				
			}
		});

		String url = "https://tiki.vn/man-hinh-dell-u2419h-24inch-fullhd-8ms-60hz-ips-hang-chinh-hang-p7986170.html?spid=7986171&src=home-deal-hot";
		ProductItem p = TestProductDataCrawlerForTiki.process(url);
		System.out.println(p);
	}

}
