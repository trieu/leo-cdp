package test.crawler;

import java.util.List;
import java.util.regex.Pattern;

import edu.uci.ics.crawler4j.crawler.CrawlConfig;
import edu.uci.ics.crawler4j.crawler.CrawlController;
import edu.uci.ics.crawler4j.crawler.Page;
import edu.uci.ics.crawler4j.crawler.WebCrawler;
import edu.uci.ics.crawler4j.fetcher.PageFetcher;
import edu.uci.ics.crawler4j.parser.HtmlParseData;
import edu.uci.ics.crawler4j.robotstxt.RobotstxtConfig;
import edu.uci.ics.crawler4j.robotstxt.RobotstxtServer;
import edu.uci.ics.crawler4j.url.WebURL;
import leotech.cdp.model.business.ProductItem;
import leotech.crawler.util.JsoupParserUtil;
import leotech.crawler.util.ProductDataCrawler;
import leotech.crawler.util.ProductDataCrawler.ProductExtInfoParser;

public class TestCrawlerAlphabooksVN extends WebCrawler {

	private final static Pattern FILTERS = Pattern.compile(".*(\\.(css|js|gif|jpg" + "|png|mp3|mp4|zip|gz))$");

	
	@Override
	public boolean shouldVisit(Page referringPage, WebURL url) {
		String href = url.getURL().toLowerCase();
		return !FILTERS.matcher(href).matches() && href.startsWith("https://alphabooks.vn");
	}

	/**
	 * This function is called when a page is fetched and ready to be processed
	 * by your program.
	 */
	@Override
	public void visit(Page page) {
		String urlStr = page.getWebURL().getURL();
		System.out.println("URL: " + urlStr);

		if (page.getParseData() instanceof HtmlParseData) {
			HtmlParseData htmlParseData = (HtmlParseData) page.getParseData();

			String html = htmlParseData.getHtml();
			try {
				ProductItem item = ProductDataCrawler.parseHtmlToProductItem(page.getWebURL().getDomain(), urlStr, html);
				if(item != null) {
					System.out.println("Item: " + item);	
				}
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	public static void main(String[] args) throws Exception {
		ProductDataCrawler.addProductExtInfoParser("eshop.guardian.vn", new ProductExtInfoParser() {
			@Override
			public void process() {
				String sku = JsoupParserUtil.getText(doc, "span[id='pro_sku']").replace("SKU:", "").trim();
				this.item.setSku(sku);

				String originalPrice = JsoupParserUtil.getText(doc, "div[id='price-preview'] del").replace("₫", "").replace(",", "").trim();
				this.item.setOriginalPrice(originalPrice);
				
				List<String> categories = JsoupParserUtil.getTexts(doc, "ol[itemtype='http://schema.org/BreadcrumbList'] span[itemprop='name']");
				try {
					// remove redundant categories
					categories.remove(0); //Trang Chu
					categories.remove(categories.size() - 1); //Ten san pham da lay roi
				} catch(Exception e){}
				this.item.setCategories(categories);
			}
		});
		
        String crawlStorageFolder = "./CRAWLER_CACHE";
        int numberOfCrawlers = 4;

        CrawlConfig config = new CrawlConfig();
        config.setCrawlStorageFolder(crawlStorageFolder);

        // Instantiate the controller for this crawl.
        PageFetcher pageFetcher = new PageFetcher(config);
        RobotstxtConfig robotstxtConfig = new RobotstxtConfig();
       
        
        RobotstxtServer robotstxtServer = new RobotstxtServer(robotstxtConfig, pageFetcher);
        CrawlController controller = new CrawlController(config, pageFetcher, robotstxtServer);

        // For each crawl, you need to add some seed urls. These are the first
        // URLs that are fetched and then the crawler starts following links
        // which are found in these pages
        controller.addSeed("https://eshop.guardian.vn");
    	
    	
    	// The factory which creates instances of crawlers.
        CrawlController.WebCrawlerFactory<TestCrawlerAlphabooksVN> factory = TestCrawlerAlphabooksVN::new;
        
        // Start the crawl. This is a blocking operation, meaning that your code
        // will reach the line after this only when crawling is finished.
        controller.start(factory, numberOfCrawlers);
    }
}
