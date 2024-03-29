package leotech.crawler.pools;

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
import leotech.cdp.dao.ProductItemDaoUtil;
import leotech.cdp.model.business.ProductItem;
import leotech.crawler.util.JsoupParserUtil;
import leotech.crawler.util.ProductDataCrawler;
import leotech.crawler.util.ProductDataCrawler.ProductExtInfoParser;

public class CrawlerGuardianVN extends WebCrawler {

	private final static Pattern FILTERS = Pattern.compile(".*(\\.(css|js|gif|jpg" + "|png|mp3|mp4|zip|gz))$");

	ProductExtInfoParser parser = new ProductExtInfoParser() {
		@Override
		public void process() {
			String sku = JsoupParserUtil.getText(doc, "span[id='pro_sku']").replace("SKU:", "").trim();
			this.item.setSku(sku);

			double originalPrice = JsoupParserUtil.getDoubleNumber(doc, "div[id='price-preview'] del");
			this.item.setOriginalPrice(originalPrice);
		}
	};
	
	@Override
	public boolean shouldVisit(Page referringPage, WebURL url) {
		String href = url.getURL().toLowerCase();
		return !FILTERS.matcher(href).matches() && href.startsWith("https://eshop.guardian.vn/products/");
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
				String domain = page.getWebURL().getDomain();
				ProductItem item = ProductDataCrawler.parseHtmlToProductItem(domain, urlStr, html, parser);
				if(item != null) {
					System.out.println("Item: " + item);	
					if(item.isReadyForSave()) {
						ProductItemDaoUtil.save(item);
					}
				}
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	public static void main(String[] args) throws Exception {
        String crawlStorageFolder = "/Users/mac/projects/leo-cms-framework/core-leo-cms/CRAWLER_CACHE";
        int numberOfCrawlers = 3;

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
        controller.addSeed("https://eshop.guardian.vn/");
        controller.addSeed("https://eshop.guardian.vn/collections/thuong-hieu-guardian");
        
        
    	
    	
    	// The factory which creates instances of crawlers.
        CrawlController.WebCrawlerFactory<CrawlerGuardianVN> factory = CrawlerGuardianVN::new;
        
        // Start the crawl. This is a blocking operation, meaning that your code
        // will reach the line after this only when crawling is finished.
        controller.start(factory, numberOfCrawlers);
    }
}
