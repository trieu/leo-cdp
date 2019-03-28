package test.automation;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

import leotech.crawler.model.CrawledFacebookVideo;
import rfx.core.util.StringUtil;
import rfx.core.util.Utils;

public class TestCrawlingFacebookVideo {

    static final String path = "/home/platform/data/chromedriver";
    static ChromeOptions chromeOptions;
    static ChromeDriver driver;
    static final int numClickShowMore = 5;
    static {
	System.setProperty("webdriver.chrome.driver", path);

	Map<String, Object> deviceMetrics = new HashMap<>();
	deviceMetrics.put("width", 800);
	deviceMetrics.put("height", 600);

	chromeOptions = new ChromeOptions();
	chromeOptions.addArguments("headless");
    }

    static void initDriver() {
	driver = new ChromeDriver(chromeOptions);
    }

    static void loginFacebook() {
	if (driver != null) {
	    driver.get("https://www.facebook.com");
	    Utils.sleep(2000);
	    StringBuilder js = new StringBuilder();
	    js.append("document.querySelector('#login_form input[type=email]').value = 'tantrieuf31.database@gmail.com';");
	    js.append("document.querySelector('#login_form input[type=password]').value = 'hellboy@12345';");
	    js.append("document.querySelector('#login_form').submit()");

	    driver.executeScript(js.toString(), "");
	    Utils.sleep(4000);
	}

    }

    static void killDriver() {
	if (driver != null) {
	    driver.quit();
	}
    }

    static List<CrawledFacebookVideo> crawledFacebookVideos = new ArrayList<>();

    static void crawlingVideos(String channelName) {
	String url = "https://www.facebook.com/" + channelName + "/videos/";

	try {
	    if (driver == null) {
		initDriver();
	    }

	    WebDriverWait wait = new WebDriverWait(driver, 6);

	    driver.get(url);
	    Utils.sleep(3000);

	    try {

		wait.until((ExpectedCondition<Boolean>) wd -> ((JavascriptExecutor) wd).executeScript("return document.readyState").equals("complete"));

		clickShowMore(driver);

		By content_container = By.id("content_container");
		WebElement divVideos = driver.findElement(content_container);

		processVideoDivHtml(divVideos);

	    } catch (Exception e) {
		e.printStackTrace();
	    }

	} catch (Exception e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    public static void processVideoDivHtml(WebElement div) {
	// grab HTML of main DIV videos
	String html = div.getAttribute("innerHTML");
	// System.out.println(html + " \n");

	// convert to model of JSOUP
	Document doc = Jsoup.parse(html, "UTF-8");

	// get all video div
	Elements videoHolders = doc.select("._2t3a");
	if (videoHolders.size() == 0) {
	    videoHolders = doc.select("._51m-");
	}

	for (Element videoHolder : videoHolders) {

	    String imgSrc = null, href = null, title = null;
	    // headline IMAGE
	    Element img = videoHolder.selectFirst("img");
	    if (img != null) {
		imgSrc = img.attr("src");
		System.out.println("Image Source : " + imgSrc);
	    }

	    // standard Video Pages, e.g:
	    // https://www.facebook.com/footballgoalhighlightshd/videos/
	    Elements videoLinks = videoHolder.select("div[role=heading] span[videoid]"); // a with href or div class ._u3y
	    if (videoLinks.size() > 0) {
		for (Element videoLink : videoLinks) {
		    href = videoLink.attr("href");
		    title = videoLink.text();
		    System.out.println(title + " " + href);
		}

		Elements videoStats = videoHolder.select("span._6gok");
		for (Element ele : videoStats) {
		    String fbText = ele.text();
		    long num = fbTextToNumber(fbText);
		    System.out.println(num + " raw: " + fbText);
		}
	    }

	    // special video page , e.g:; https://www.facebook.com/pg/natgeo/videos/
	    Elements videoLinksAlt = videoHolder.select("a[data-video-channel-id]");
	    if (videoLinksAlt.size() > 0) {
		for (Element videoLink : videoLinksAlt) {
		    href = videoLink.attr("href");
		    if (!href.startsWith("http")) {
			href = "https://www.facebook.com" + href;
		    }
		    title = videoLink.attr("title");
		    System.out.println(title + " " + href);
		}

		Element videoStats = videoHolder.selectFirst("span.fcg");
		String fbText = videoStats.text();
		long num = fbTextToNumber(fbText);
		System.out.println(num + " raw: " + fbText);
	    }

	    if (href != null) {
		crawledFacebookVideos.add(new CrawledFacebookVideo(title, href));
	    }

	}

    }

    public static void clickShowMore(ChromeDriver driver) {
	// document.querySelectorAll('.uiMorePagerPrimary')[0].click()
	try {
	    for (int i = 0; i < numClickShowMore; i++) {
		driver.executeScript("try{ window.scrollBy(0,3000); document.querySelector('._1k2v').click(); } catch(e){}", "");
		Utils.sleep(4000);
	    }
	} catch (Exception e) {
	    // e.printStackTrace();
	    System.err.println(e.getMessage());
	}
    }

    static long fbTextToNumber(String fbText) {
	long n = 0;
	Calendar calendar = Calendar.getInstance();
	fbText = fbText.trim();
	if (fbText.contains("views")) {
	    fbText = fbText.replace("views", "").replace(",", "").trim();
	    n = toNumber(fbText);

	} else if (fbText.contains("comments")) {
	    fbText = fbText.replace("comments", "").replace(",", "").trim();
	    System.out.println(fbText);
	    n = toNumber(fbText);

	} else if (fbText.equals("over a year ago")) {
	    n = 1;
	    calendar.set(Calendar.YEAR, 1);
	    int daysInYear = calendar.getActualMaximum(Calendar.DAY_OF_YEAR);
	    n = TimeUnit.DAYS.toMillis(daysInYear);
	} else if (fbText.contains("hours ago")) {
	    int h = StringUtil.safeParseInt(fbText.replace("hours ago", "").trim());
	    calendar.set(Calendar.HOUR, h);
	    n = calendar.getTimeInMillis();
	} else if (fbText.contains("hours ago")) {
	    n = StringUtil.safeParseLong(fbText.replace("hours ago", "").trim());
	}

	return n;
    }

    public static long toNumber(String fbText) {
	long n = 0;
	if (fbText.contains("K")) {
	    n = (long) (1000 * StringUtil.safeParseFloat(fbText.replace("K", "")));
	} else if (fbText.contains("M")) {
	    n = (long) (1000000 * StringUtil.safeParseFloat(fbText.replace("M", "")));
	} else if (fbText.contains("B")) {
	    n = (long) (1000000000 * StringUtil.safeParseFloat(fbText.replace("B", "")));
	} else {
	    n = StringUtil.safeParseLong(fbText);
	}
	return n;
    }

    public static void runCrawler() {
	initDriver();
	loginFacebook();

	// String[] channels = new String[] { "NTDLifeOfficial",
	// "footballgoalhighlightshd" };
	String[] channels = new String[] { "natgeo" };

	for (String channel : channels) {
	    crawlingVideos(channel);
	}

	killDriver();

	List<CrawledFacebookVideo> list = crawledFacebookVideos;
	System.out.println("------ total: " + list.size());
	for (CrawledFacebookVideo v : list) {
	    System.out.println(v);
	}
    }

    public static void main(String[] args) {

	// System.out.println(fbTextToNumber("2,647 comments"));
	runCrawler();
    }

}
