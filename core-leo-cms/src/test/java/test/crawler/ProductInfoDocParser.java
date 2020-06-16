package test.crawler;

import org.jsoup.nodes.Document;

import leotech.cdp.model.business.ProductItem;

public interface ProductInfoDocParser {
	public boolean parse(Document srcDoc, ProductItem dstProductItem) throws Exception;
}
