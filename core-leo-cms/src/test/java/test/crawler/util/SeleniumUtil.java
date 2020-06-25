package test.crawler.util;

import static org.junit.Assert.assertEquals;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedCondition;
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
	
	public static List<WebElement> findElementsByCssSelector(ChromeDriver driver, String using) {
		try {
			return driver.findElementsByCssSelector(using);
		} catch (NoSuchElementException e) {
			// Do Nothing
		}
		return null;
	}	
	
	public static void wait4jsLoad(WebDriverWait wait) {
		wait.until((ExpectedCondition<Boolean>) wd -> ((JavascriptExecutor) wd).executeScript("return document.readyState").equals("complete"));
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
