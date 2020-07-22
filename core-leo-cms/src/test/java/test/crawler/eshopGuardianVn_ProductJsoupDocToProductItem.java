package test.crawler;

import java.io.FileWriter;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import leotech.cdp.model.business.ProductItem;
import leotech.crawler.util.JsoupParserUtil;
import rfx.core.util.HttpClientUtil;
import rfx.core.util.StringUtil;

public class eshopGuardianVn_ProductJsoupDocToProductItem implements ProductJsoupDocToProductItem {
	
	public static final eshopGuardianVn_ProductJsoupDocToProductItem commonParser = new eshopGuardianVn_ProductJsoupDocToProductItem();
	
	public boolean parse(Document srcDoc, ProductItem dstProductItem) throws Exception {		
		
		String ogType = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:type']", "content").toLowerCase();
		if (!"product".equals(ogType)) {
			// skip if not a product
			return false;
		}
		
		dstProductItem.setSiteDomain("eshop.guardian.vn");

		String title = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:title']", "content");
		if (StringUtil.isEmpty(title)) {
			title = JsoupParserUtil.getText(srcDoc, "title");
		}
		dstProductItem.setName(title);

		String description = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:description']", "content");
		dstProductItem.setDescription(description);

		String productImage = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:image']", "content").replace("http:","https:");
		dstProductItem.setImage(productImage);
		
		String salePrice = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:price:amount']", "content");
		dstProductItem.setSalePrice(salePrice);
		
		String priceCurrency = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:price:currency']", "content");
		dstProductItem.setPriceCurrency(priceCurrency);
		
		String fullUrl = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:url']", "content");
		dstProductItem.setFullUrl(fullUrl);
		
		String siteName = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:site_name']", "content");
		dstProductItem.setSiteName(siteName);
		
		String itemCondition = JsoupParserUtil.getAttr(srcDoc, "link[itemprop='itemCondition']", "href");
		dstProductItem.setItemCondition(itemCondition);
		
		String availability = JsoupParserUtil.getAttr(srcDoc, "link[itemprop='availability']", "href");
		dstProductItem.setAvailability(availability);
		
		String sku = JsoupParserUtil.getText(srcDoc, "span[id='pro_sku']").replace("SKU:", "").trim();
		dstProductItem.setSku(sku);
		
		
		String originalPrice = JsoupParserUtil.getText(srcDoc, "div[id='price-preview'] del").replace("\u20AB", "").replace(",", "").trim();
		dstProductItem.setOriginalPrice(originalPrice);
		
		if (dstProductItem.getCategories() == null || dstProductItem.getCategories().size() == 0) {
			List<String> categories = JsoupParserUtil.getTexts(srcDoc, "ol[itemtype='http://schema.org/BreadcrumbList'] span[itemprop='name']");
			try {
				categories.remove(0); //Trang Chu
				categories.remove(categories.size() - 1); //Product Title
				dstProductItem.setCategories(categories);	
			} catch (Exception __) {}
		}

		return true;
	}

	public static void main(String[] args) throws Exception {
		String url = "https://eshop.guardian.vn/products/dau-goi-botaneco-organic-argan-virgin-olive-oil-muot-ma-va-ong-a-290ml";
		ProductItem p = new ProductItem("");
		if( commonParser.parse(Jsoup.connect(url).get(), p) && !p.isEmpty()) {
			System.out.println(p);
		}
		
		FileWriter a = new FileWriter("C:\\Users\\Administrator\\Downloads\\test.html");
		a.write(Jsoup.connect("https://eshop.guardian.vn/").get().html());
		a.close();
	}

}
