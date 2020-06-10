package leotech.crawler.util;

import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public class JsoupParserUtil {

	public static String getAttr(Document doc, String selector, String attrName) {
		String data = "";
		Element dataNode = doc.selectFirst(selector);
		if (dataNode != null) {
			data = dataNode.attr(attrName);
		}
		return data;
	}
	
	public static String getText(Document doc, String selector) {
		String data = "";
		Element dataNode = doc.selectFirst(selector);
		if (dataNode != null) {
			data = dataNode.text();
		}
		return data;
	}
}
