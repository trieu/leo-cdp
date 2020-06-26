package test.crawler;

import java.io.File;
import java.io.FileOutputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.BlockingDeque;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.ThreadLocalRandom;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.jsoup.Jsoup;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import leotech.cdp.model.business.ProductItem;
import test.crawler.util.ProductItemDao;
import test.crawler.util.SeleniumUtil;


public class watsonsVnSeleniumCrawler {
	
	private static final int minPauseTimeMSec = 1000;
	
	private static final int maxPauseTimeMSec = 3000;
	
	private static final Pattern PROMO_PATTERN = Pattern.compile("(?i)(Mua\\s+(\\d)\\s+t\u00ednh\\s+ti\u1ec1n\\s+(\\d))|(m\u00e3\\s+([\\w]+)\\s+.*gi\u1ea3m\\s+(\\d+)\\%\\/(\\d)\\s+(tri\u1ec7u))");
	
	private static BlockingDeque<ProductItem> productItems = new LinkedBlockingDeque<>();
	
	public static void processOneProductItem(String productUrl, String productHtml, String promoStr) throws Exception{		
		ProductItem productItem = new ProductItem(productUrl);
		watsonsVn_ProductJsoupDocToProductItem.commonParser.parse(Jsoup.parse(productHtml),productItem);
		Matcher m;
		if (!promoStr.isEmpty() && (m = PROMO_PATTERN.matcher(promoStr)).find()) {
			double salePrice = productItem.getSalePrice();
			List<String> promoCodes = productItem.getPromoCodes();
			List<Double> promoPrices = productItem.getPromoPrices();
			if (promoCodes == null)
				promoCodes = new ArrayList<>();
			if (promoPrices == null)
				promoPrices = new ArrayList<>();
			if (m.group(1) != null && m.group(2) != null && m.group(3) != null) {
				int itemCount4Promo = Integer.parseUnsignedInt(m.group(2));
				int itemCharged4Promo = Integer.parseUnsignedInt(m.group(3));
				if (itemCharged4Promo == 1) {
					promoPrices.add(salePrice/itemCount4Promo);
				}					
				promoCodes.add(m.group(1));			
			} else if (m.group(4) != null && m.group(5) != null && m.group(6) != null && m.group(7) != null && m.group(8) != null) {
				promoCodes.add(m.group(4));				
				double reducePercent = Double.parseDouble(m.group(6));
				double thresholdValue = Double.parseDouble(m.group(7));
				int multiplier = 1000000;				
				switch(m.group(8)) {
				  case "ng\u00e0n":
				  case "ngh\u00ecn":
					  multiplier = 1000;
					  break;
				  default:
					  break;
				}
				double price4Promo =  thresholdValue * multiplier;
				if (salePrice >= price4Promo)
					promoPrices.add(salePrice*(100-reducePercent)/100);
			}
			productItem.setPromoCodes(promoCodes);
			productItem.setPromoPrices(promoPrices);
		}
		
		productItems.put(productItem);
//		ProductItemDao.save(productItem);
		System.out.println(productItem);		
	}
	
	public static void crawlWatsonsVn(ChromeDriver driver, WebDriverWait wait, JavascriptExecutor js, int startPageIndex, int pageCount){
		
		List<Integer> pageOrders = IntStream.rangeClosed(1, 64).boxed().collect(Collectors.toList());
		
		String currentPageUrl = "https://www.watsons.vn/product-categories/c/1?q=%3AigcBestSeller&page=" + (startPageIndex<0?0:startPageIndex) + "&resultsForPage=64&text=&sort=igcBestSeller&deliveryType=";
		driver.get(currentPageUrl);
		
		int count = 0;
		WebElement nextPageBtn = null;
		try {											
			do {		
				
				if (nextPageBtn != null) {
					nextPageBtn.click();
					Thread.sleep(ThreadLocalRandom.current().nextInt(minPauseTimeMSec, maxPauseTimeMSec));
					currentPageUrl = driver.getCurrentUrl();
				}				
				
				// human will wait to see an image for product
				WebElement firstProductImg = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("#mainContent > main > div > div.PLP_content > div.contentRight > div.ProductSales > div.bottomProductSales > div:nth-child(1) > div.productItemPhotoContainer > div.productItemPhoto > a > img")));
				wait.until(ExpectedConditions.elementToBeClickable(firstProductImg));
				
				System.out.println("=> PAGE " + currentPageUrl);				
				
				// human will randomly pick item while scroll down until the end of the page 
				Collections.shuffle(pageOrders);
				
				String myCurrentTabName = driver.getWindowHandle();
				
				for (int itemNum : pageOrders) {									
					WebElement itemEle = driver.findElementByCssSelector("#mainContent > main > div > div.PLP_content > div.contentRight > div.ProductSales > div.bottomProductSales > div:nth-child(" + itemNum + ") > div.productItemPhotoContainer > div.productItemPhoto > a");
					
					js.executeScript("arguments[0].scrollIntoView();", itemEle);
					js.executeScript("window.open('https://www.watsons.vn/" + itemEle.getAttribute("href").replaceFirst("^\\s*\\/", "") + "');");					
					
					
					Thread.sleep(ThreadLocalRandom.current().nextInt(minPauseTimeMSec, maxPauseTimeMSec));		
				}			
				
				
				for (String tabName : new ArrayList<String> (driver.getWindowHandles())) {
					if (tabName.equals(myCurrentTabName))
						continue;
					driver.switchTo().window(tabName);
					WebElement promoEle = null;
					try {
						promoEle = SeleniumUtil.findElementByCssSelector(driver, "div.Promotions a[title]");
					} catch (TimeoutException __) {
						// it simply doesnot have promo code
					}
					try {
						processOneProductItem(driver.getCurrentUrl(),driver.getPageSource(),promoEle == null?"":promoEle.getAttribute("title").trim());	
					} catch (Exception e) {
						e.printStackTrace();
					}					
				    driver.close();
				}
				
				driver.switchTo().window(myCurrentTabName);

			} while ((nextPageBtn = SeleniumUtil.findElementByCssSelector(driver, "a.next[href]")) != null 
						&& ++count < pageCount);
	
		} catch (Exception e) {
			System.out.println("=> PAGE <= " + currentPageUrl);
			e.printStackTrace();
		} finally {
			try {
				ObjectOutputStream toFile;
				toFile = new ObjectOutputStream(new FileOutputStream(
						"watsonsVn_BlockingDequeOfProductItem_" + count + "Pages_fromPage" + startPageIndex));
				toFile.writeObject(productItems);				
				toFile.close();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}				
			System.out.println("=> Saved into watsonsVn_BlockingDequeOfProductItem_" + count + "Pages_fromPage" + startPageIndex);
			driver.quit();
			System.out.println("=> END !");
		}
	}

	public static void main(String[] args) throws Exception {
		System.setProperty("webdriver.chrome.driver", "/usr/bin/chromedriver");
		if (System.getProperty("os.name").toLowerCase().contains("windows"))
			System.setProperty("webdriver.chrome.driver", "D:/chromedriver.exe");
		
		ChromeOptions options = new ChromeOptions();
		options.addArguments("start-maximized");
		options.addArguments("--disable-notifications");
//    	options.addArguments("disable-extensions");
//    	options.addArguments("--headless");
//    	options.addArguments("--no-sandbox");
//    	options.setExperimentalOption("useAutomationExtension", false);
		
		// add VPN extension
		options.addExtensions(new File("C:\\Users\\Administrator\\Downloads\\setupVPN.crx"));
		
		ChromeDriver driver = new ChromeDriver(options);
		WebDriverWait wait = new WebDriverWait(driver, 30);		
		
		JavascriptExecutor js = (JavascriptExecutor) driver;
		
		driver.get("https://www.google.com/");	
		
		// wait 60s to finish MANUALLY establishment VPN connection
		// code byp-4t4iy-su
		Thread.sleep(30000);
		
		// close the tab openned by extension
		List<String> tabNames = new ArrayList<String> (driver.getWindowHandles());
		if (tabNames.size() > 1) {
			driver.switchTo().window(tabNames.get(1));
		    driver.close();
		    driver.switchTo().window(tabNames.get(0));
		}	    
	    
		driver.get("https://www.watsons.vn/");
		
		// MANUAL wait for banner and close it
		Thread.sleep(20000);
		
		// scrolling down
		js.executeScript("window.scrollTo(0, document.body.scrollHeight)");
	    
	    crawlWatsonsVn(driver,wait,js,12,72);
	}

}
