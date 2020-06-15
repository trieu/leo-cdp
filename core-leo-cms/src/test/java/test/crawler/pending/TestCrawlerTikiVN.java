package test.crawler.pending;

import java.util.Set;
import java.util.regex.Pattern;

import org.openqa.selenium.chrome.ChromeOptions;

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
import test.crawler.TestProductDataCrawlerForTiki.ProductExtInfoParser;

public class TestCrawlerTikiVN extends WebCrawler {

	private final static Pattern BLOCK_PATTERN = Pattern.compile(".*(\\.(css|js|gif|jpg|png|mp3|mp4|zip|gz))$");
	
	private static final Pattern PASS_PATTERN = Pattern.compile("^https://tiki\\.vn/.*(p\\d+\\.html(\\?(src|spid)=.*)?)$");

//	private static final ChromeOptions chromeOptions = new ChromeOptions().addArguments("--headless");
	
	@Override
	public boolean shouldVisit(Page referringPage, WebURL url) {
		String href = url.getURL().toLowerCase();
		return !BLOCK_PATTERN.matcher(href).matches() && PASS_PATTERN.matcher(href).matches();
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
			
//			System.out.println(html);
			try {
				ProductItem item = TestProductDataCrawlerForTiki.parseHtmlToProductItem(urlStr, html);
				if(item != null) {
					System.out.println("Item: " + item);	
				}
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
//			Set<WebURL> links = htmlParseData.getOutgoingUrls();
//			System.out.println("Number of outgoing links: " + links.size());
//			System.out.println(links);
		}
	}
	
	public static void main(String[] args) throws Exception {
		
		System.setProperty("webdriver.chrome.driver", "/usr/bin/chromedriver");
		
		TestProductDataCrawlerForTiki.addProductExtInfoParser("eshop.guardian.vn", new ProductExtInfoParser() {
			@Override
			public void process() {
				String sku = JsoupParserUtil.getText(doc, "span[itemprop='sku']").replace("SKU:", "").trim();
				this.item.setSku(sku);

				String originalPrice = JsoupParserUtil.getText(doc, "p[class='original-price']").replace("Giá thị trường:", "").replace("₫", "")
						.replace(".", "").trim();
				this.item.setOriginalPrice(originalPrice);
				
				
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
        controller.addSeed("https://tiki.vn/dac-nhan-tam-kho-lon-p480040.html?spid=192412&src=home-deal-hot");
        controller.addSeed("https://tiki.vn/combo-sua-tam-l-amont-en-provence-cherry-blossom-shower-gel-huong-hoa-anh-dao-hoa-hong-500ml-chai-p1347157.html?spid=1347159&src=home-deal-hot");
        controller.addSeed("https://tiki.vn/man-hinh-dell-u2419h-24inch-fullhd-8ms-60hz-ips-hang-chinh-hang-p7986170.html?spid=7986171&src=home-deal-hot");
        controller.addSeed("https://tiki.vn/sapiens-luoc-su-loai-nguoi-tai-ban-co-chinh-sua-p888553.html?spid=888555&src=home-deal-hot");
        
       
    	
    	
    	// The factory which creates instances of crawlers.
        CrawlController.WebCrawlerFactory<TestCrawlerTikiVN> factory = TestCrawlerTikiVN::new;
        
        // Start the crawl. This is a blocking operation, meaning that your code
        // will reach the line after this only when crawling is finished.
        controller.start(factory, numberOfCrawlers);
    }
}
