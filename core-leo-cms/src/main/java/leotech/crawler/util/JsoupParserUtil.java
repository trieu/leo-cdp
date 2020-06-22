package leotech.crawler.util;

import java.util.ArrayList;
import java.util.List;

import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import rfx.core.util.StringUtil;

public class JsoupParserUtil {

	private static final String REGEX_FOR_KEEP_NUMBER = "[^0-9.]";
	private static final String REGEX_FOR_SPECIAL_CHARS = "[-+.^:,]";

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
	
	public static double getDoubleNumber(Document doc, String selector) {
		String data = "";
		Element dataNode = doc.selectFirst(selector);
		if (dataNode != null) {
			data = dataNode.text().trim().replaceAll(REGEX_FOR_SPECIAL_CHARS,"").replaceAll(REGEX_FOR_KEEP_NUMBER, "");
		}
		return StringUtil.safeParseDouble(data);
	}
	
	public static int getIntegerNumber(Document doc, String selector) {
		String data = "";
		Element dataNode = doc.selectFirst(selector);
		if (dataNode != null) {
			data = dataNode.text().trim().replaceAll(REGEX_FOR_SPECIAL_CHARS,"").replaceAll(REGEX_FOR_KEEP_NUMBER, "");
		}
		return StringUtil.safeParseInt(data);
	}
	
	public static List<String> getTexts(Document doc, String selector) {
		List<String> data = new ArrayList<>();
		Elements dataNodes = doc.select(selector);
		for (Element dataItem : dataNodes) {
			if (dataItem == null)
				continue;
			else
				data.add(dataItem.text());
		}
		
		return data;
	}
}
