package leotech.crawler.pools;

import java.util.regex.Pattern;

import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import edu.uci.ics.crawler4j.crawler.CrawlConfig;
import edu.uci.ics.crawler4j.crawler.CrawlController;
import edu.uci.ics.crawler4j.crawler.Page;
import edu.uci.ics.crawler4j.crawler.WebCrawler;
import edu.uci.ics.crawler4j.parser.HtmlParseData;
import edu.uci.ics.crawler4j.robotstxt.RobotstxtConfig;
import edu.uci.ics.crawler4j.robotstxt.RobotstxtServer;
import edu.uci.ics.crawler4j.url.WebURL;
import leotech.cdp.model.business.ProductItem;
import leotech.crawler.model.AjaxPageFetcher;
import leotech.crawler.util.JsoupParserUtil;
import leotech.crawler.util.ProductDataCrawler;
import leotech.crawler.util.ProductDataCrawler.ProductExtInfoParser;

public class CrawlerFahasaVN extends WebCrawler {

	private final static Pattern FILTERS = Pattern.compile(".*(\\.(css|js|gif|jpg" + "|png|mp3|mp4|zip|gz))$");
	
	ProductExtInfoParser parser = new ProductExtInfoParser(true) {
		@Override
		public void process() {
			double originalPrice = JsoupParserUtil.getDoubleNumber(doc,"div[id='catalog-product-details-price'] .old-price .price");
			System.out.println("originalPrice " + originalPrice);
			this.item.setOriginalPrice(originalPrice);

			double salePrice = JsoupParserUtil.getDoubleNumber(doc,"div[id='catalog-product-details-price'] .special-price .price");
			System.out.println("salePrice " + salePrice);
			this.item.setSalePrice(salePrice);
		}
	};

	
	@Override
	public boolean shouldVisit(Page referringPage, WebURL url) {
		String href = url.getURL().toLowerCase();
		boolean checked = !FILTERS.matcher(href).matches() && href.endsWith(".html") && (href.startsWith("https://www.fahasa.com") || href.startsWith("https://fahasa.com"));
		//System.out.println("shouldVisit " + href + " checked " + checked);
		return checked;
	}

	/**
	 * This function is called when a page is fetched and ready to be processed
	 * by your program.
	 */
	@Override
	public void visit(Page page) {
		String urlStr = page.getWebURL().getURL();
		System.out.println("visit URL: " + urlStr);
		//System.out.println("getParseData: " + page.getParseData().getClass());

		if (page.getParseData() instanceof HtmlParseData) {
			HtmlParseData htmlParseData = (HtmlParseData) page.getParseData();

			String html = htmlParseData.getHtml();
			//System.out.println(html);
			try {
				ProductItem item = ProductDataCrawler.parseHtmlToProductItem(page.getWebURL().getDomain(), urlStr, html, parser);
				if(item != null) {
					if(! item.isEmpty()) {
						System.out.println("ProductItem: " + item);	
					}
					
				} else {
					System.out.println("Item is NULL");	
				}
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	public static void main(String[] args) throws Exception {
		
		// TODO move to config file for ChromeDriver
		System.setProperty("webdriver.chrome.driver", "/Users/mac/programs/webdriver/chromedriver");
		ChromeOptions options = new ChromeOptions();
		options.addArguments("disable-extensions");
		options.addArguments("--headless");
		ChromeDriver driver = new ChromeDriver(options);
		
		
        String crawlStorageFolder = "/Users/mac/projects/leo-cms-framework/core-leo-cms/CRAWLER_CACHE";
        int numberOfCrawlers = 1;

        CrawlConfig config = new CrawlConfig();
        config.setCrawlStorageFolder(crawlStorageFolder);

        // Instantiate the controller for this crawl.
        AjaxPageFetcher ajaxPageFetcher = new AjaxPageFetcher(config, driver);
        RobotstxtConfig robotstxtConfig = new RobotstxtConfig();
       
        
        RobotstxtServer robotstxtServer = new RobotstxtServer(robotstxtConfig, ajaxPageFetcher);
        CrawlController controller = new CrawlController(config, ajaxPageFetcher, robotstxtServer);

      
        controller.addSeed("https://www.fahasa.com/");
        
    	
    	// The factory which creates instances of crawlers.
        CrawlController.WebCrawlerFactory<CrawlerFahasaVN> factory = CrawlerFahasaVN::new;
        
        // Start the crawl. This is a blocking operation, meaning that your code
        // will reach the line after this only when crawling is finished.
        controller.start(factory, numberOfCrawlers);
    }
}
