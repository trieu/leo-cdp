package leotech.crawler.util;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Arrays;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.xml.sax.SAXException;

import de.l3s.boilerpipe.BoilerpipeExtractor;
import de.l3s.boilerpipe.BoilerpipeProcessingException;
import de.l3s.boilerpipe.extractors.CommonExtractors;
import de.l3s.boilerpipe.sax.HTMLDocument;
import de.l3s.boilerpipe.sax.HTMLHighlighter;
import leotech.crawler.util.FacebookDataCrawler.FacebookEngagementData;
import rfx.core.util.FileUtils;
import rfx.core.util.HttpClientUtil;

public class ArticleDataCrawler {

    public static String process(String url) throws Exception {
	String html = HttpClientUtil.executeGet(url);
	String extractedHtml = processWithRules(html);
	if (extractedHtml == null) {
	    extractedHtml = processDefault(html);
	}
	return extractedHtml;
    }

    protected static String processWithRules(String html) {

	// TODO load from database here
	String patternIf = "medium-com";
	String contentSelector = "article";
	String cssHref = "<link href=\"https://cdn-static-1.medium.com/_/fp/css/main-branding-base.sMRbh_65n82B91860QdvTg.css\" rel=\"stylesheet\" type=\"text/css\" >";

	if (html.contains(patternIf)) {
	    Document doc = Jsoup.parse(html);
	    Element ele = doc.selectFirst(contentSelector);
	    if (ele != null) {
		return cssHref + ele.outerHtml();
	    }
	}

	return null;
    }

    protected static String processDefault(String html) {
	try {
	    BoilerpipeExtractor extractor = CommonExtractors.ARTICLE_EXTRACTOR;
	    boolean includeImages = true;
	    boolean bodyOnly = true;
	    final HTMLHighlighter hh = HTMLHighlighter.newExtractingInstance(includeImages, bodyOnly);
	    HTMLDocument doc = new HTMLDocument(html);
	    String extractedHtml = hh.process(doc, extractor);
	    return extractedHtml;
	} catch (Exception e) {
	    e.printStackTrace();
	}
	return "";
    }

    public static void main(String[] args) throws Exception {
	String urlStr = "https://medium.com/the-mission/why-building-your-own-deep-learning-computer-is-10x-cheaper-than-aws-b1c91b55ce8c";

	String extractedHtml = ArticleDataCrawler.process(urlStr);

	FileUtils.writeStringToFile("./BUILD-OUTPUT/test2.html", extractedHtml);

//	List<FacebookEngagementData> list = FacebookDataCrawler.getLinkShareStats(Arrays.asList(urlStr));
//
//	System.out.println(list);

    }
}
