package test.crawler;

import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import leotech.cdp.model.business.ProductItem;
import leotech.crawler.util.JsoupParserUtil;
import rfx.core.util.StringUtil;

public class eshopGuardianVnProductInfoDocParser implements ProductInfoDocParser {
	
	public boolean parse(Document srcDoc, ProductItem dstProductItem) throws Exception {		

		String ogType = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:type']", "content").toLowerCase();
		if (!"product".equals(ogType)) {
			// skip if not a product
			return false;
		}

		// start common parser for Open Graph
		String title = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:title']", "content");
		if (StringUtil.isEmpty(title)) {
			title = JsoupParserUtil.getText(srcDoc, "title");
		}

		String description = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:description']", "content");

		String productImage = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:image']", "content").replace("http:",
				"https:");

		String salePrice = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:price:amount']", "content");

		String priceCurrency = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:price:currency']", "content");

		String fullUrl = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:url']", "content");

		String siteName = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:site_name']", "content");

		String itemCondition = JsoupParserUtil.getAttr(srcDoc, "link[itemprop='itemCondition']", "href");

		String availability = JsoupParserUtil.getAttr(srcDoc, "link[itemprop='availability']", "href");
		
		String sku = JsoupParserUtil.getText(srcDoc, "span[id='pro_sku']").replace("SKU:", "").trim();
	
		
		String originalPrice = JsoupParserUtil.getText(srcDoc, "div[id='price-preview'] del").replace("₫", "").replace(",", "").trim();
	
		
		List<String> categories = JsoupParserUtil.getTexts(srcDoc, "ol[itemtype='http://schema.org/BreadcrumbList'] span[itemprop='name']");
		try {
			// remove redundant categories
			categories.remove(0); //Trang Chu
			categories.remove(categories.size() - 1); //Ten san pham da lay roi
		} catch(Exception e){}

		dstProductItem.setSku(sku);
		dstProductItem.setName(title);
		dstProductItem.setDescription(description);
		dstProductItem.setImage(productImage);
		dstProductItem.setSalePrice(salePrice);
		dstProductItem.setPriceCurrency(priceCurrency);
		dstProductItem.setFullUrl(fullUrl);
		dstProductItem.setSiteName(siteName);
		dstProductItem.setItemCondition(itemCondition);
		dstProductItem.setAvailability(availability);
		dstProductItem.setOriginalPrice(originalPrice);
		dstProductItem.setCategories(categories);

		return true;
	}

	public static void main(String[] args) throws Exception {
		ProductInfoDocParser test = new eshopGuardianVnProductInfoDocParser();
		String url = "https://eshop.guardian.vn/products/mat-na-toc-tsubaki-phuc-hoi-hu-ton-180g";
		ProductItem p = new ProductItem();
		p.setSiteDomain("eshop.guardian.vn");
		if( test.parse(Jsoup.connect(url).get(), p) && !p.isEmpty()) {
			System.out.println(p);
		}
	}

}
