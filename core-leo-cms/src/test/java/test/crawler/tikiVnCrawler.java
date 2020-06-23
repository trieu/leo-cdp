package test.crawler;

import static org.junit.Assert.assertTrue;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.PipedReader;
import java.io.PipedWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ForkJoinPool;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.ElementClickInterceptedException;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import leotech.cdp.model.business.ProductItem;

public class tikiVnCrawler {
	
	private static final int PARALLELISM = 0;
	
	private static final Pattern PRODUCT_LINK_PATTERN = Pattern.compile("^https://tiki\\.vn/.*(p\\d+\\.html(\\?(src|spid)=.*)?)$");
	
	
	public static boolean wait2dismissBanner(WebDriverWait wait) {
		try {
			WebElement bannerCloseBtn = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("onesignal-popover-cancel-button")));
			wait.until(ExpectedConditions.elementToBeClickable(bannerCloseBtn));
			bannerCloseBtn.click();
			bannerCloseBtn.click();
			wait.until(ExpectedConditions.invisibilityOf(bannerCloseBtn));
		} catch (Exception __) {
			return false;
		}
		return true;
	}
	
	public static void acquireProductItemFromProductURL(String productURL, ChromeDriver readyDriver, WebDriverWait readyWait, ProductInfoDocParser readyParser) throws Exception {
		
		readyDriver.get(productURL);
		
		// wait for things to be ready
		readyWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("iframe[title*='like' i][title*='facebook' i]")));

		
		List<WebElement> OptionCategories = SeleniumUtil.findElementsByCssSelector(readyDriver, "div[class*='product' i][class*='option' i] > div.option");
		
		List<String> nameOptionCategories = OptionCategories.stream().map((ele) -> {
						String tmpStr = ele.findElement(By.cssSelector("p[class*='name' i]")).getText().toLowerCase().replace("chá»�n", "");
						return tmpStr.substring(0, tmpStr.indexOf(":")).trim();
					}).collect(Collectors.toList());
		
		int optionCount = nameOptionCategories.size();
		
		List<Integer> maxOptionInds = OptionCategories.stream()
										.map(ele -> ele.findElements(By.cssSelector("div.list > a[class*='btn' i][class*='option' i]")).size())
										.collect(Collectors.toList());		
		
		List<Integer> currentOptionInds = maxOptionInds.parallelStream().map(anInt -> anInt = 0).collect(Collectors.toList());
		
		List<List<String>> optionStrs = OptionCategories.stream()
											.map(ele -> ele.findElements(By.cssSelector("div.list > a[class*='btn' i][class*='option' i]"))
															.stream().map(elee -> elee.getText()).collect(Collectors.toList()))
											.collect(Collectors.toList());
		
		OptionCategories = null;
		
		int totalChoiceCount = maxOptionInds.stream().reduce(1, (a, b) -> a * b);
		
		assertTrue(totalChoiceCount > 0);
		
		for (int z = 0; z < totalChoiceCount; ++z) {
			int currentIntTrack = z;
			for (int j = 0; j < optionCount; ++j) {					
				int currentInd = currentIntTrack % maxOptionInds.get(j);																	
				WebElement currentBtn = readyDriver.findElementByCssSelector("div[class*='product' i][class*='option' i] > div.option:nth-child(" + (j+1) + ") > div.list > a[class*='btn' i][class*='option' i]:nth-child(" + (currentInd + 1) + ")");

//							String currentBtnStr = currentBtn.getText();
//							System.out.print(currentBtnStr.toUpperCase());
				
				if (!currentBtn.getAttribute("class").contains("active")) {							
					currentBtn.click();		
					readyWait.until(ExpectedConditions.invisibilityOf(currentBtn));				
				}				
				
				currentOptionInds.set(j, currentInd);
				
				currentIntTrack /= maxOptionInds.get(j);				
			}
			
			List<String> sellerURLs = new ArrayList<>();
			
			WebElement firstAnotherSellerEle = SeleniumUtil.findElementByCssSelector(readyDriver, "div[class*='other' i][class*='seller' i] > div.seller");
			
			if (firstAnotherSellerEle != null) {
//							System.out.println("Found Another Seller !");					
				WebElement moreSellerBtn = SeleniumUtil.findElementByCssSelector(readyDriver, "div[class*='other' i][class*='seller' i] > div[class*='show' i][class*='more' i]");
				if (moreSellerBtn != null) {
//								System.out.println("Found Button Show More Sellers !");
					moreSellerBtn.click();
					readyWait.until(ExpectedConditions.invisibilityOf(moreSellerBtn));
				}
				
				sellerURLs.addAll(readyDriver.findElementsByCssSelector("div[class*='other' i][class*='seller' i] > div.seller > a.seller__name")
											.stream().map((ele) -> ele.getAttribute("href")).collect(Collectors.toList()));
			}
			
			sellerURLs.add(readyDriver.findElementByCssSelector("a[class='seller-name']").getAttribute("href"));					
			
			int sellerCount = sellerURLs.size();
			
			
			for (int i = 0; i < sellerCount; ++i) {

				if (sellerCount > 1) {
					try {
//									System.out.println(sellerURLs.get(i));
						WebElement chooseSellerBtn = readyWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("a.seller__name[href='" + sellerURLs.get(i) + "'] ~ button.seller__view")));
						readyWait.until(ExpectedConditions.elementToBeClickable(chooseSellerBtn));
						chooseSellerBtn.click();
//									wait.until(ExpectedConditions.invisibilityOf(chooseSellerBtn));
						readyWait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("a[class='seller-name'][href='" + sellerURLs.get(i) + "']")));							
					} catch (ElementClickInterceptedException | StaleElementReferenceException __) {
						// refetch again, it's simply a glitch due to javascript
						i -= 1;
						continue;
					} catch (TimeoutException __) {
						z -= 1;
						readyDriver.navigate().refresh();
						break;
					}
				}						

				List<String> realOptionStrs = new ArrayList<>();
				
				boolean continueForI = false;
				
				for (int j = 0; j < optionCount; ++j) {	
					String expectedBtnStr = optionStrs.get(j).get(currentOptionInds.get(j));						
					String currentBtnStr = readyDriver.findElementByCssSelector("div[class*='product' i][class*='option' i] > div.option:nth-child(" + (j+1) + ") > div.list > a[class*='btn' i][class*='option' i][class*='active' i]").getText();
					realOptionStrs.add(currentBtnStr);
					if (!currentBtnStr.equals(expectedBtnStr)) {
						try {
							WebElement focusedBtn = readyDriver.findElementsByCssSelector("div[class*='product' i][class*='option' i] > div.option:nth-child(" + (j+1) + ") > div.list > a[class*='btn' i][class*='option' i]")
																	.stream().filter(ele -> ele.getText().contains(expectedBtnStr)).findAny().get();
							focusedBtn.click();
							readyWait.until(ExpectedConditions.invisibilityOf(focusedBtn));
							if (!readyDriver.findElementByCssSelector("a[class='seller-name']").getAttribute("href").equals(sellerURLs.get(i))) {
//											System.out.println("Js Glitch");
								i -= 1;
								continueForI = true;
								break;
							}
						} catch (NullPointerException __) {
							// Do Nothing, there are no such options from the current seller
						}
					}
				}
				
				if (continueForI)
					continue;
				
				String urlStr = readyDriver.getCurrentUrl();
				ProductItem aProductItem = new ProductItem(urlStr);
				aProductItem.setSiteDomain("tiki.vn");
				readyParser.parse(Jsoup.parse(readyDriver.getPageSource()), aProductItem);
				aProductItem.setFullUrl(urlStr);
				aProductItem.setOptionFields(nameOptionCategories);
				aProductItem.setOptionValues(realOptionStrs);
				
				System.out.println(aProductItem);
				
				
			}
		}
	}

	public static void main(String[] args) throws IOException {
	
		
//		ForkJoinPool forkJoinPool = null;
		
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
		
		ConcurrentHashMap<Long,List<Object>> threadId2ListOfDriverAndWait = new ConcurrentHashMap<>();
		
		ProductInfoDocParser parser = new tikiVnProductInfoDocParser();
		
		PipedWriter pipeOut = new PipedWriter();		
		PipedReader pipeIn = new PipedReader(pipeOut);
		PrintWriter outPW = new PrintWriter(new BufferedWriter(pipeOut));
		
		for (int i = 0; i < PARALLELISM; ++i)
			new Thread(new Runnable() {
				@Override
				public void run() {
					BufferedReader inBR = null;
					try {
						long currentThreadId = Thread.currentThread().getId();
						ChromeDriver tDriver = null;
						WebDriverWait tWait = null;
						if (!threadId2ListOfDriverAndWait.containsKey(currentThreadId)) {
							ChromeOptions tOptions = new ChromeOptions();
							tOptions.addArguments("start-maximized");
//					    	tOptions.addArguments("disable-extensions");
//					    	tOptions.addArguments("--headless");
//					    	tOptions.addArguments("--no-sandbox");
//					    	tOptions.setExperimentalOption("useAutomationExtension", false);
					    	
							tDriver = new ChromeDriver(tOptions);
							tWait = new WebDriverWait(tDriver, 30);
							
							threadId2ListOfDriverAndWait.put(currentThreadId, new ArrayList<Object>());
							threadId2ListOfDriverAndWait.get(currentThreadId).add(tDriver);
							threadId2ListOfDriverAndWait.get(currentThreadId).add(tWait);
							
							tDriver.get("https://tiki.vn/");
							
							if (wait2dismissBanner(tWait))
								System.out.println(Thread.currentThread().getName() + " init ok !");
						}
						
						if (tDriver == null || tWait == null) {
							tDriver = (ChromeDriver) threadId2ListOfDriverAndWait.get(currentThreadId).get(0);
							tWait = (WebDriverWait) threadId2ListOfDriverAndWait.get(currentThreadId).get(1);
						}     
						
						String productUrl;
						
						inBR = new BufferedReader(pipeIn);
						
						while ((productUrl = inBR.readLine().trim()) != null && !productUrl.isEmpty()) {
							System.out.println(Thread.currentThread().getName() + " receives <= " + productUrl);
							if (PRODUCT_LINK_PATTERN.matcher(productUrl).matches())
								acquireProductItemFromProductURL(productUrl,tDriver,tWait,parser);
						}			
						
					} catch (NullPointerException e) {
						// Do Nothing, the sender has closed the pipe
					} catch (Exception e) {
						System.out.println(Thread.currentThread().getName() + " raises EXCEPTION !");
						e.printStackTrace();
					}
				}				
			}).start();
		
		
		try {
//			forkJoinPool = new ForkJoinPool(PARALLELISM);
			
			driver.get("https://tiki.vn/");
			
			wait2dismissBanner(wait);
			
			Elements eleCategories = Jsoup.parse(driver.getPageSource()).select("a[href~=(?i)\\/c\\d+][class*='MenuItem']");
			for (Element ele: eleCategories) {
				System.out.println(ele.attr("href"));
				WebElement tmpEle = driver.findElementByCssSelector(String.format("a[href='%s']",ele.attr("href")));
				tmpEle.click();
				wait.until(ExpectedConditions.invisibilityOf(tmpEle));			
				
				
				String markURL;
				
				// traverse through this category
				WebElement nextPageElement = null;
				
				do {
					if (nextPageElement != null)
						driver.get(nextPageElement.getAttribute("href"));
					
	        		List<WebElement> currentProductItemList = wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(By.cssSelector("div[class*='product-box-list' i] > div[class*='product-item' i]")));
					
	        		markURL = driver.getCurrentUrl();
	        		
//	        		System.out.println(currentProductItemList.size());
	        		
	        		List<String> currentProductLinks = currentProductItemList.stream().map(item -> {
										                	String urlStr = item.findElement(By.cssSelector("a[href*='.html' i]"))
										                							.getAttribute("href");
										                	if (!PRODUCT_LINK_PATTERN.matcher(urlStr).matches()) 
										                		urlStr = "";
															return urlStr;
	                									}).filter(urlStr -> !urlStr.isEmpty()).collect(Collectors.toList());
	        		
	        		for (String urlStr : currentProductLinks) {
//	        			String urlStr = item.findElement(By.cssSelector("a[href*='.html' i]")).getAttribute("href");
//				    	if (PRODUCT_LINK_PATTERN.matcher(urlStr).matches()) {
////				    		outPW.println(urlStr);
////				    		System.out.println(Thread.currentThread().getName() + " sends out => " + urlStr);
				    		acquireProductItemFromProductURL(urlStr,driver,wait,parser);
//				    	}
	        		}
	        		
//	        		forkJoinPool.submit(() -> currentProductLinks.parallelStream().forEach(productUrl -> {
//	        			try {
//		        			long currentThreadId = Thread.currentThread().getId();
//		        			ChromeDriver tDriver = null;
//		        			WebDriverWait tWait = null;
//		        			if (!threadId2ListOfDriverAndWait.containsKey(currentThreadId)) {
//		        				ChromeOptions tOptions = new ChromeOptions();
//		        		    	
//		        				tDriver = new ChromeDriver(tOptions);
//		        				tWait = new WebDriverWait(tDriver, 30);
//		        				
//		        				threadId2ListOfDriverAndWait.put(currentThreadId, new ArrayList<Object>());
//		        				threadId2ListOfDriverAndWait.get(currentThreadId).add(tDriver);
//		        				threadId2ListOfDriverAndWait.get(currentThreadId).add(tWait);
//		        				
//		        				tDriver.get("https://tiki.vn/");
//		        				
//		        				if (wait2dismissBanner(tWait))
//		        					System.out.println(Thread.currentThread().getName() + " init ok !");
//		        			}
//		        			
//		        			if (tDriver == null || tWait == null) {
//		        				tDriver = (ChromeDriver) threadId2ListOfDriverAndWait.get(currentThreadId).get(0);
//		        				tWait = (WebDriverWait) threadId2ListOfDriverAndWait.get(currentThreadId).get(1);
//		        			}        			
//	        			
//							acquireProductItemFromProductURL(productUrl,tDriver,tWait,new tikiVnProductInfoDocParser());
//							
//						} catch (Exception e) {
//							System.out.println(Thread.currentThread().getName() + " raises EXCEPTION !");
//							e.printStackTrace();
//						} 
//	        			return true;
//	        		})).get();         		
	        
	        		driver.get(markURL);
	        		wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(By.cssSelector("div[class*='product-box-list' i] > div[class*='product-item' i]")));

	        		nextPageElement = SeleniumUtil.findElementByCssSelector(driver, "a.next[rel*='next' i]");
				} while (nextPageElement != null);
				
				break;
			}
			
			

            System.out.println("=> Crawling Completed !");
            
		} catch (Exception e) {
        	e.printStackTrace();
        } finally {
//        	if (forkJoinPool != null)
//                forkJoinPool.shutdown();
//        	threadId2ListOfDriverAndWait.values().stream().forEach(objList -> ((ChromeDriver) objList.get(0)).quit());
        	outPW.close();
//            driver.quit();
        }
	}


}
