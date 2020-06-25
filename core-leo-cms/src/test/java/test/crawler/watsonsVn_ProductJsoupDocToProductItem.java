package test.crawler;

import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import leotech.cdp.model.business.ProductItem;
import leotech.crawler.util.JsoupParserUtil;
import rfx.core.util.HttpClientUtil;
import rfx.core.util.StringUtil;

public class watsonsVn_ProductJsoupDocToProductItem implements ProductJsoupDocToProductItem {
	
	public static final watsonsVn_ProductJsoupDocToProductItem commonParser = new watsonsVn_ProductJsoupDocToProductItem();
	
	public boolean parse(Document srcDoc, ProductItem dstProductItem) throws Exception {		
		
		String ogType = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:type']", "content").toLowerCase();
		if (!"product".equals(ogType)) {
			// skip if not a product
			return false;
		}
		
		dstProductItem.setSiteDomain("watsons.vn");
		
		String brand = JsoupParserUtil.getText(srcDoc, "div.PDPImgInfo > a[href*='brand'] > [itemprop='brand']");
		dstProductItem.setBrand(brand);
		
		String siteName = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:site_name']", "content");
		dstProductItem.setSiteName(siteName);

		String title = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:title']", "content");
		if (StringUtil.isEmpty(title)) {
			title = JsoupParserUtil.getText(srcDoc, "title");
		}
		title = title.replaceAll("(?i)^.*" + brand + "\\s*,|\\|\\s*" + siteName + ".*$", "").trim();
		dstProductItem.setName(title);

		String description = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:description']", "content");
		dstProductItem.setDescription(description);

		String productImage = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:image']", "content").replace("http:","https:");
		dstProductItem.setImage(productImage);
		
		String originalPrice = JsoupParserUtil.getText(srcDoc, "div.productOriginalPrice > del").replace("\u20AB", "").replace(",", "").trim();
		dstProductItem.setOriginalPrice(originalPrice);
		
		String salePrice = JsoupParserUtil.getAttr(srcDoc, "div.productPrice ~ meta[itemprop='price']", "content");
		dstProductItem.setSalePrice(salePrice);
		
		String priceCurrency = JsoupParserUtil.getAttr(srcDoc, "div.productPrice ~ meta[itemprop='priceCurrency']", "content");
		dstProductItem.setPriceCurrency(priceCurrency);
		
		String fullUrl = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:url']", "content");
		dstProductItem.setFullUrl(fullUrl);		
		
		// itemCondition property does not exist
//		String itemCondition = JsoupParserUtil.getAttr(srcDoc, "link[itemprop='itemCondition']", "href");
//		dstProductItem.setItemCondition(itemCondition);
		
		String availability = JsoupParserUtil.getAttr(srcDoc, "#gtmItemProductStockLevelIndicator", "value");
		dstProductItem.setAvailability(availability);
		
		String sku = JsoupParserUtil.getAttr(srcDoc, "div.Product_code > [data-code]", "data-code");
		dstProductItem.setSku(sku);		
		
		List<String> categories = JsoupParserUtil.getTexts(srcDoc, "div[itemprop='breadcrumb'] a[href] > span[itemprop='name']");
		if (categories.size() > 1) {
			categories.remove(0); //Trang Chu
			dstProductItem.setCategories(categories);	
		}				
		
		// promotion is loaded with javascript, get promotion from a workaround in crawler code

		return true;
	}

	public static void main(String[] args) throws Exception {
		String url = "https://www.watsons.vn/x%E1%BB%8Bt-kho%C3%A1ng-evoluderm-c%E1%BA%A5p-%E1%BA%A9m-l%C3%A0m-d%E1%BB%8Bu-da-400ml/p/BP_203346";
		ProductItem p = new ProductItem("");
		if( commonParser.parse(Jsoup.connect(url).get(), p) && !p.isEmpty()) {
			System.out.println(p);
		}
	}

}
