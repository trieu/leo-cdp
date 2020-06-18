package test.crawler;

import static org.junit.Assert.assertEquals;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class SeleniumUtil {
	
	public static WebElement findElement(ChromeDriver driver, By locator) {
		try {
			return driver.findElement(locator);
		} catch (NoSuchElementException e) {
			// Do Nothing
		}
		return null;
	}
	
	public static WebElement findElementByCssSelector(ChromeDriver driver, String using) {
		try {
			return driver.findElementByCssSelector(using);
		} catch (NoSuchElementException e) {
			// Do Nothing
		}
		return null;
	}	

	public static void main(String[] args) {
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
//		WebDriverWait wait = new WebDriverWait(driver, 30);
		
		driver.get("https://www.google.com/");
		
		assertEquals(findElement(driver,By.cssSelector("div")),null);

	}

}
