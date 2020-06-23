package test.crawler;

import java.util.List;
import java.util.concurrent.ForkJoinPool;

import org.jsoup.Jsoup;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import leotech.cdp.model.business.ProductItem;
import rfx.core.util.HttpClientUtil;

import static org.junit.Assert.assertEquals;

public class eshopGuardianVnCrawler {

	public static void main(String[] args) {
		
		final int PARALLEISM = 4;
		
		ForkJoinPool forkJoinPool = null;
		
		System.setProperty("webdriver.chrome.driver", "/usr/bin/chromedriver");
		if (System.getProperty("os.name").toLowerCase().contains("windows"))
			System.setProperty("webdriver.chrome.driver", "D:/chromedriver.exe");
		
		ChromeOptions options = new ChromeOptions();
//		options.addArguments("start-maximized");
//    	options.addArguments("disable-extensions");
//    	options.addArguments("--headless");
//    	options.addArguments("--no-sandbox");
//    	options.setExperimentalOption("useAutomationExtension", false);
    	
		ChromeDriver driver = new ChromeDriver(options);
		WebDriverWait wait = new WebDriverWait(driver, 30);
		
		ProductInfoDocParser parser = new eshopGuardianVnProductInfoDocParser();
		
		try {
			forkJoinPool = new ForkJoinPool(PARALLEISM);
            WebElement nextPageElement = null;
            do {
        		driver.get(nextPageElement == null ? "https://eshop.guardian.vn/collections/all" : nextPageElement.getAttribute("href"));
        		final List<WebElement> currentProductItemList = wait.until(ExpectedConditions.visibilityOfNestedElementsLocatedBy(
																		                		By.cssSelector("div[class*='product-list']"),
																		                		By.cssSelector("div[class*='product-detail']")));
                forkJoinPool.submit(() -> 
                	currentProductItemList.parallelStream().forEach(item -> {
	                	String urlStr = item.findElement(By.cssSelector("a[href*='/products/']")).getAttribute("href");
	                	String htmlStr;
	                	ProductItem productItem = new ProductItem(urlStr);
	                	productItem.setSiteDomain("eshop.guardian.vn");
	                	try {
							if (!(htmlStr = HttpClientUtil.executeGet(urlStr)).equals("404")
									&& parser.parse(Jsoup.parse(htmlStr), productItem)) {
								System.out.println(productItem);
								TestProductDao.save(productItem);
							}
						} catch (Exception e) {
							System.out.println(Thread.currentThread().getName() + " Raise Exception ...");
							e.printStackTrace();						
						}
	                })
                ).get();         
//                assertEquals(currentProductItemList.size(),40);
        	} while ((nextPageElement = SeleniumUtil.findElementByCssSelector(driver, "a.next")) != null);
            System.out.println("=> Crawling Completed !");
		} catch (AssertionError __) {			
			System.out.println("Crawling Completed at final catalog link " + driver.getCurrentUrl());
		} catch (Exception e) {
        	e.printStackTrace();
        } finally {
        	if (forkJoinPool != null)
                forkJoinPool.shutdown();
            driver.quit();
        }

	}

}
