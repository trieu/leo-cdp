package leotech.crawler.model;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Date;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.message.BasicHeader;
import org.openqa.selenium.chrome.ChromeDriver;

import edu.uci.ics.crawler4j.crawler.CrawlConfig;
import edu.uci.ics.crawler4j.crawler.exceptions.PageBiggerThanMaxSizeException;
import edu.uci.ics.crawler4j.fetcher.PageFetchResult;
import edu.uci.ics.crawler4j.fetcher.PageFetcher;
import edu.uci.ics.crawler4j.url.URLCanonicalizer;
import edu.uci.ics.crawler4j.url.WebURL;

public class AjaxPageFetcher extends PageFetcher {

	ChromeDriver webDriver;
	public AjaxPageFetcher(CrawlConfig config, ChromeDriver webDriver) {
		super(config);
		this.webDriver = webDriver;
	}

	@Override
	public PageFetchResult fetchPage(WebURL webUrl)
			throws InterruptedException, IOException, PageBiggerThanMaxSizeException {
		// Getting URL, setting headers & content
		PageFetchResult fetchResult = new PageFetchResult();
		String toFetchURL = webUrl.getURL();
		

		try {
			//URL url = new URL(toFetchURL);
			URI uri = new URI(toFetchURL);

			if (config.getPolitenessDelay() > 0) {
				// Applying Politeness delay
				synchronized (mutex) {
					long now = (new Date()).getTime();
					if ((now - lastFetchTime) < config.getPolitenessDelay()) {
						Thread.sleep(config.getPolitenessDelay() - (now - lastFetchTime));
					}
					lastFetchTime = (new Date()).getTime();
				}
			}

			//Execute selenium driver to get content
			webDriver.get(toFetchURL);

			String html = webDriver.getPageSource();
			AjaxWebEntity entity = new AjaxWebEntity(html.getBytes());
			fetchResult.setEntity(entity);
			
			fetchResult.setResponseHeaders(null);

			// Setting HttpStatus
			int statusCode = 200;

			// is 2XX, everything looks ok
			fetchResult.setFetchedUrl(toFetchURL);
			String uriStr = uri.toString();
			if (!uriStr.equals(toFetchURL)) {
				if (!URLCanonicalizer.getCanonicalURL(uriStr).equals(toFetchURL)) {
					fetchResult.setFetchedUrl(uriStr);
				}
			}

			fetchResult.setStatusCode(statusCode);
			return fetchResult;

		} catch (URISyntaxException e) {
			
			e.printStackTrace();
		} finally { // occurs also with thrown exceptions

		}
		return fetchResult;
	}

	

	public static class AjaxWebEntity implements HttpEntity {

		byte[] contentBytes;

		public AjaxWebEntity(byte[] contentBytes) {
			this.contentBytes = contentBytes;
		}

		@Override
		public boolean isRepeatable() {
			return false;
		}

		@Override
		public boolean isChunked() {
			return false;
		}

		@Override
		public long getContentLength() {
			return contentBytes.length;
		}

		@Override
		public Header getContentType() {
			return new BasicHeader("content-type", "text/html; charset=UTF-8");
		}

		@Override
		public Header getContentEncoding() {
			return new BasicHeader("content-type", "gzip");
		}

		@Override
		public InputStream getContent() throws IOException, UnsupportedOperationException {
			return new ByteArrayInputStream(contentBytes);
		}

		@Override
		public void writeTo(OutputStream outStream) throws IOException {

		}

		@Override
		public boolean isStreaming() {

			return false;
		}

		@Override
		public void consumeContent() throws IOException {

		}

	}

}
