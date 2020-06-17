package test.crawler;

import java.io.BufferedWriter;

import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ProductCatalogFetcher {
	
	ChromeOptions options = null;
	ChromeDriver driver = null;
	WebDriverWait wait = null;
	BufferedWriter outBW = null;
	
	public ProductCatalogFetcher(PipedWriter out) {
		System.setProperty("webdriver.chrome.driver", "/usr/bin/chromedriver");
		
		options = new ChromeOptions();
		options.addArguments("start-maximized");
    	//options.addArguments("disable-extensions");
//    	options.addArguments("--headless");
    	//options.addArguments("--no-sandbox");
    	//options.setExperimentalOption("useAutomationExtension", false);
    	
		driver = new ChromeDriver(options);
		wait = new WebDriverWait(driver, 30);
	}
	
	public static void main(String[] args) {
		ProductCatalogFetcher p = new ProductCatalogFetcher();
		
	}

}
