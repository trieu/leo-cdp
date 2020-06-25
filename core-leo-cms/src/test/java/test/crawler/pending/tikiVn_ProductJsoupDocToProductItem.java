package test.crawler.pending;

import java.util.List;
import java.util.stream.Collectors;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import leotech.cdp.model.business.ProductItem;
import leotech.crawler.util.JsoupParserUtil;
import rfx.core.util.HttpClientUtil;
import rfx.core.util.StringUtil;
import test.crawler.ProductJsoupDocToProductItem;

public class tikiVn_ProductJsoupDocToProductItem implements ProductJsoupDocToProductItem{
	
	public boolean parse(Document srcDoc, ProductItem dstProductItem) throws Exception {		
		
		String ogType = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:type']", "content").toLowerCase();
		if( ! "website".equals(ogType) ) {
			//skip if not a product
			return false;
		}

		// start common parser for Open Graph
		String title = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:title']", "content");
		if (StringUtil.isEmpty(title)) {
			title = JsoupParserUtil.getText(srcDoc, "title");
		}

		String description = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:description']", "content");

		String productImage = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:image']", "content").replace("http:","https:");

		String salePrice = JsoupParserUtil.getAttr(srcDoc, "div.summary meta[itemprop='price']", "content");

		String priceCurrency = JsoupParserUtil.getAttr(srcDoc, "div.summary meta[itemprop='priceCurrency']", "content");

		String fullUrl = JsoupParserUtil.getAttr(srcDoc, "div.summary meta[itemprop='url']", "content");

		String siteName = JsoupParserUtil.getAttr(srcDoc, "meta[property='og:site_name']", "content");

		// No itemCondition property
//		String itemCondition = JsoupParserUtil.getAttr(doc, "link[itemprop='itemCondition']", "href");

		String availability = JsoupParserUtil.getAttr(srcDoc, "link[itemprop='availability']", "href");
		
		String brand = JsoupParserUtil.getAttr(srcDoc, "div.brand meta[itemprop='name']", "content");
		
		List<String> categories = JsoupParserUtil.getTexts(srcDoc, "a[class='Breadcrumb__Item-sc-1a3qw0s-1 hjpGLl']:gt(0):not(a[href='#'])");
		
		String sku = JsoupParserUtil.getText(srcDoc, "span[itemprop='sku']");

		String originalPrice = JsoupParserUtil.getText(srcDoc, "p[class='original-price']").replace("GiÃ¡ thá»‹ trÆ°á»�ng:", "").replace("â‚«", "")
				.replace(".", "").trim();
		
		String sellerName = JsoupParserUtil.getText(srcDoc, "a[class='seller-name']");
		
		List<String> promoCodes = JsoupParserUtil.getTexts(srcDoc, "div.coupon span[class='coupon-code']");
		dstProductItem.setPromoCodes(promoCodes);
		
		List<Double> promoPrices = JsoupParserUtil.getTexts(srcDoc, "div.coupon span[class='coupon-price']").stream()
														.map(priceStr -> Double.valueOf(priceStr.replace("â‚«", "").replace(".", "").trim()))
														.collect(Collectors.toList());
		dstProductItem.setPromoPrices(promoPrices);

		dstProductItem.setSku(sku);
		dstProductItem.setName(title);
		dstProductItem.setDescription(description);
		dstProductItem.setImage(productImage);
		dstProductItem.setSalePrice(salePrice);
		dstProductItem.setPriceCurrency(priceCurrency);
		dstProductItem.setFullUrl(fullUrl);
		dstProductItem.setSiteName(siteName);
//		dstProductItem.setItemCondition(itemCondition);
		dstProductItem.setAvailability(availability);
		dstProductItem.setOriginalPrice(originalPrice);
		dstProductItem.setCategories(categories);
		dstProductItem.setBrand(brand);
		dstProductItem.setSellerName(sellerName);

		return true;
	}

	public static void main(String[] args) throws Exception {
		ProductJsoupDocToProductItem test = new tikiVn_ProductJsoupDocToProductItem();
		String url = "https://tiki.vn/man-hinh-dell-u2419h-24inch-fullhd-8ms-60hz-ips-hang-chinh-hang-p7986170.html?spid=7986171&src=home-deal-hot";
		ProductItem p = new ProductItem("");
		p.setSiteDomain("tiki.vn");
		if( test.parse(Jsoup.connect(url).get(), p) && !p.isEmpty()) {
			System.out.println(p);
		}
	}

}
