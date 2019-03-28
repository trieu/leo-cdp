package test.util;

import java.net.URL;

import org.jsoup.Jsoup;

import de.l3s.boilerpipe.BoilerpipeExtractor;
import de.l3s.boilerpipe.extractors.CommonExtractors;
import de.l3s.boilerpipe.sax.HTMLHighlighter;
import leotech.system.util.media.Summarizer;
import leotech.system.util.media.TextSummarizer;

public class TestTextSummary {

    public static void main(String[] args) throws Exception {
	String urlStr = "https://vnexpress.net/phap-luat/nam-sinh-hoang-bao-bi-danh-thuoc-me-bat-coc-vao-oto-3767117.html";
	URL url = new URL(urlStr);
	final BoilerpipeExtractor extractor = CommonExtractors.ARTICLE_EXTRACTOR;

	final boolean includeImages = true;
	final boolean bodyOnly = true;
	final HTMLHighlighter hh = HTMLHighlighter.newExtractingInstance(includeImages, bodyOnly);

	String extractedHtml = hh.process(url, extractor);
	String text = Jsoup.parse(extractedHtml, "UTF-8").select("body").text();

	TextSummarizer summarizer = new TextSummarizer();
	
	
	System.out.println(text);
	System.out.println(summarizer.summarizeText(text, 3));
	System.out.println(new Summarizer().Summarize(text, 3));
    }
}
