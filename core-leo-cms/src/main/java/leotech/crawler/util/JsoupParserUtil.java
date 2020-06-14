package leotech.crawler.util;

import java.util.ArrayList;
import java.util.List;

import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

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
	
	public static List<String> getTexts(Document doc, String selector) {
		List<String> data = new ArrayList<>();
		Elements dataNodes = doc.select(selector);
		for (int i = 0; i < dataNodes.size(); ++i) {
			if (dataNodes.get(i) == null)
				continue;
			else
				data.add(dataNodes.get(i).text());
		}
		
		return data;
	}
}
