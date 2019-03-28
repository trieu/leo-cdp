package test.automation;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import rfx.core.util.RandomUtil;
import rfx.core.util.Utils;

public class TestOnMacOs {

    static final String path = "/Users/mac/devtools/chromedriver";

    static ChromeOptions chromeOptions;
    static {
	System.setProperty("webdriver.chrome.driver", path);

	Map<String, Object> deviceMetrics = new HashMap<>();
	deviceMetrics.put("width", 800);
	deviceMetrics.put("height", 600);

	Map<String, Object> mobileEmulation = new HashMap<>();
	mobileEmulation.put("deviceMetrics", deviceMetrics);
	mobileEmulation.put("userAgent",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246");

	chromeOptions = new ChromeOptions();
	// chromeOptions.setExperimentalOption("mobileEmulation", mobileEmulation);
	// chromeOptions.addArguments("headless");

    }

    static AtomicLong countImp = new AtomicLong();
    static AtomicLong countClick = new AtomicLong();
    static final int NUM_THREAD = 1;

    static void test() {
	String url = "http://bongda24h.vn/world-cup-2018/4-diem-nhan-sau-chien-thang-20-cua-phap-truoc-uruguay-421-190559.html";

	try {

	    ChromeDriver driver = new ChromeDriver(chromeOptions);

	    driver.get(url);

	    // driver.get(url);
	    Utils.sleep(500);

	    // driver.executeScript("window.scrollBy(0,2300)", "");

	    // WebElement adURLBox = driver.findElement(By.id("ad_url"));
	    // adURLBox.sendKeys(testUrl);
	    Utils.sleep(RandomUtil.randomNumber(3000, 5000));

	    try {
		WebElement btn = driver.findElement(By.className("inread__plus"));
		Dimension size = btn.getSize();
		long imp = countImp.incrementAndGet();
		System.out.println(imp + "==> Load OK Ad " + size.getWidth() + " " + size.getHeight());
		if (RandomUtil.randomNumber(1, 100) < 1000) {
		    btn.click();
		    long click = countClick.incrementAndGet();
		    System.out.println(click + "==> Click Ad OK");
		    Utils.sleep(RandomUtil.randomNumber(29000, 31000));
		} else {
		    Utils.sleep(RandomUtil.randomNumber(5000, 10000));
		}
	    } catch (NoSuchElementException e) {
		System.out.println("No ad, just Skip ..." + url);
	    }

	    driver.quit();
	} catch (Exception e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    public static void main(String[] args) {
	test();
    }

}
