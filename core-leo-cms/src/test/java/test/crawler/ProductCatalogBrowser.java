package test.crawler;

import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

public interface ProductCatalogBrowser {

	void browse(ChromeDriver driver, WebDriverWait wait, Object outMedium) throws Exception;
}
