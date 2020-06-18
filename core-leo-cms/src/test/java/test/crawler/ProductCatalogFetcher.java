package test.crawler;

import java.io.BufferedWriter;
import java.io.PrintWriter;
import java.io.Writer;

import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ProductCatalogFetcher implements Runnable {
	
	ChromeOptions options = null;
	ChromeDriver driver = null;
	WebDriverWait wait = null;
	PrintWriter outPW = null;
	
	@Override
	public void run() {
		// TODO Auto-generated method stub
		
	}
	
	public ProductCatalogFetcher(Writer out) {
		
		this.outPW = new PrintWriter(new BufferedWriter(out));
		
		System.setProperty("webdriver.chrome.driver", "/usr/bin/chromedriver");
		if (System.getProperty("os.name").toLowerCase().contains("windows"))
			System.setProperty("webdriver.chrome.driver", "D:/chromedriver.exe");
		
		this.options = new ChromeOptions();
		options.addArguments("start-maximized");
//    	options.addArguments("disable-extensions");
//    	options.addArguments("--headless");
//    	options.addArguments("--no-sandbox");
//    	options.setExperimentalOption("useAutomationExtension", false);
    	
		this.driver = new ChromeDriver(options);
		this.wait = new WebDriverWait(driver, 30);
		
		
	}
	
	public static void main(String[] args) {
		//ProductCatalogFetcher p = new ProductCatalogFetcher();
		
	}



}
