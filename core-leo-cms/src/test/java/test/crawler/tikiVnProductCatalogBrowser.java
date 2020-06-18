package test.crawler;

import static org.junit.Assert.assertEquals;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.PipedReader;
import java.io.PipedWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;


public class tikiVnProductCatalogBrowser implements ProductCatalogBrowser {

	@Override
	public void browse(ChromeDriver driver, WebDriverWait wait, Object outMedium) throws Exception {
		try {
			
			driver.get("https://tiki.vn/bep-nuong-dien-sunhouse-shd4607-1500w-hang-chinh-hang-p1460199.html");
			
			wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("iframe[title*='like' i][title*='facebook' i]")));
			
			WebElement firstAnotherSellerEle = driver.findElementByCssSelector("div.title");
			if (firstAnotherSellerEle != null) {
				System.out.println(firstAnotherSellerEle.getText());
			}
			
//			driver.get("https://tiki.vn/");
//			Elements eleCategories = Jsoup.parse(driver.getPageSource()).select("a[href~=(?i)\\/c\\d+][class*='MenuItem']");
//			for (Element ele: eleCategories) {
//				System.out.println(ele.attr("href"));
//				driver.findElementByCssSelector(String.format("a[href='%s']",ele.attr("href"))).click();
//				
//				
//				
//				break;
//			}
		} catch (Exception e) {
        	e.printStackTrace();
        } finally {
            //driver.quit();
            out.close();
            System.out.println(Thread.currentThread().getName() + " ENDs");
        }

	}

	public static void main(String[] args) throws Exception {
		System.setProperty("webdriver.chrome.driver", "/usr/bin/chromedriver");
		if (System.getProperty("os.name").toLowerCase().contains("windows"))
			System.setProperty("webdriver.chrome.driver", "D:/chromedriver.exe");
			
		
		ChromeOptions options = new ChromeOptions();
		options.addArguments("start-maximized");
//    	options.addArguments("disable-extensions");
//    	options.addArguments("--headless");
//    	options.addArguments("--no-sandbox");
//    	options.setExperimentalOption("useAutomationExtension", false);
    	
		ChromeDriver driver = new ChromeDriver(options);
		WebDriverWait wait = new WebDriverWait(driver, 30);
		
		PipedWriter pipeOut = new PipedWriter();
        PipedReader pipeIn = new PipedReader(pipeOut);
        
               
        /*Thread for reading data from pipe*/
		Thread pipeReader=new Thread(new Runnable() {
			@Override
			public void run() {
				BufferedReader inBR = null;
				System.out.println(Thread.currentThread().getName() + " STARTs ");
				String input;
				try {
					inBR = new BufferedReader(pipeIn);
					while ((input = inBR.readLine().trim()) != null && !input.isEmpty()) {
						System.out.println(Thread.currentThread().getName() + " receives <= " + input);
					}
				} catch (NullPointerException e) {
					// Do nothing, the sender has closed the pipe
				} catch (Exception e) {
					e.printStackTrace();
				} finally {
					try {
						pipeIn.close();
						inBR.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
					System.out.println(Thread.currentThread().getName() + " ENDs ");
				}
			}
		});
		
		pipeReader.start();
		
		tikiVnProductCatalogBrowser tikiBrowser = new tikiVnProductCatalogBrowser();
		tikiBrowser.browse(driver, wait, new PrintWriter(new BufferedWriter(pipeOut)));
		
	}

}
