package test.crawler;

import static org.junit.Assert.assertEquals;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.io.PipedInputStream;
import java.io.PipedOutputStream;
import java.io.PipedReader;
import java.io.PipedWriter;
import java.io.PrintWriter;
import java.io.Writer;
import java.util.List;
import java.util.concurrent.CountDownLatch;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import leotech.cdp.model.business.ProductItem;


public class eshopGuardianVnProductCatalogBrowser implements ProductCatalogBrowser {

	@Override
	public void browse(ChromeDriver driver, WebDriverWait wait, Object outMedium) {
		PrintWriter outStr = null;
		try {
			boolean isCharBasedMedium = IOUtil.isCharBasedMedium(outMedium);
			if (isCharBasedMedium)
				outStr = new PrintWriter(new BufferedWriter(((Writer) outMedium)));
			else
				return;
//			ObjectOutputStream outObj = isCharBasedMedium?null:new ObjectOutputStream((OutputStream) outMedium);
            WebElement nextPageElement = null;
            do {
        		driver.get(nextPageElement == null ? "https://eshop.guardian.vn/collections/all" : nextPageElement.getAttribute("href"));
                List<WebElement> currentProductItemList = wait.until(ExpectedConditions.presenceOfNestedElementsLocatedBy(
                		By.cssSelector("div[class*='product-list']"),
                		By.cssSelector("div[class*='product-detail']")));
                for (WebElement item: currentProductItemList) {
                	outStr.println(item.findElement(By.cssSelector("a[href*='/products/']")).getAttribute("href"));
                }
                assertEquals(currentProductItemList.size(),40);
        	} while ((nextPageElement = SeleniumUtil.findElementByCssSelector(driver, "a.next")) != null);
		} catch (Exception e) {
        	e.printStackTrace();
        } finally {
            driver.quit();
            outStr.close();
            System.out.println(Thread.currentThread().getName() + " ENDs");
        }

	}

	public static void main(String[] args) throws Exception {
		
		System.out.println("Main thread is- " + Thread.currentThread().getName()); 
		
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
		
		
		/*Thread for reading data from pipe*/
		Thread pipeReader2=new Thread(new Runnable() {
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
		
		/*Thread for reading data from pipe*/
		Thread pipeReader3=new Thread(new Runnable() {
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
		
		/*Thread for reading data from pipe*/
		Thread pipeReader4=new Thread(new Runnable() {
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
		
		/*Thread for reading data from pipe*/
		Thread pipeReader5=new Thread(new Runnable() {
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
		
		pipeReader2.start();
		pipeReader3.start();
		pipeReader4.start();
		pipeReader5.start();
		
		
		
//		
//		
//		
//		PipedInputStream pipedInputStream=new PipedInputStream();
//		PipedOutputStream pipedOutputStream=new PipedOutputStream();
//		pipedInputStream.connect(pipedOutputStream);
//		
//		CountDownLatch readyLatch = new CountDownLatch(1);
//		CountDownLatch endLatch = new CountDownLatch(1);
//		
//		/*Thread for reading data from pipe*/
//		Thread pipeReader=new Thread(new Runnable() {
//			@Override
//			public void run() {
//				ObjectInputStream objectInputStream = null;
//				System.out.println(Thread.currentThread().getName() + " STARTs ");
//				try {
//					objectInputStream = new ObjectInputStream(pipedInputStream);
//					readyLatch.await();
//					if (objectInputStream.readObject() == null)
//						System.out.println(Thread.currentThread().getName() + " connect OK ");
//					ProductItem currentItem;
//					do {		
//						currentItem = (ProductItem) objectInputStream.readObject();
//						System.out.println(Thread.currentThread().getName() + " receives <= " + currentItem);	
//						try { TestProductDao.save(currentItem);} catch (Exception e) {}
//					} while (currentItem != null);
//				} catch (java.io.EOFException eof) {
//					// Do nothing, the sender has closed the pipe
//				} catch (Exception e) {
//					e.printStackTrace();
//				} finally {
//					try {
//						pipedInputStream.close();
//						objectInputStream.close();						
//					} catch (IOException e) {
//						// TODO Auto-generated catch block
//						e.printStackTrace();
//					}
//					System.out.println(Thread.currentThread().getName() + " ENDs ");
//				}
//			}
//		});
//		
//		Thread t1 = new Thread(new ProductInfoParser(pipeIn,pipedOutputStream,readyLatch,endLatch));
////		Thread t2 = new Thread(new ProductInfoParser(pipeIn,pipedOutputStream,readyLatch,endLatch));
////		Thread t3 = new Thread(new ProductInfoParser(pipeIn,pipedOutputStream,readyLatch,endLatch));
////		Thread t4 = new Thread(new ProductInfoParser(pipeIn,pipedOutputStream,readyLatch,endLatch));
////		Thread t5 = new Thread(new ProductInfoParser(pipeIn,pipedOutputStream,readyLatch,endLatch));
//		
//		t1.start();
////		t2.start();
////		t3.start();
////		t4.start();
////		t5.start();
//		
//		pipeReader.start();
//		System.out.println("Enter Any Link to test (empty line = terminate)");	
//		/* copy following links and paste to terminal when test:
//		 
//		 https://eshop.guardian.vn/products/dau-tay-trang-sach-sau-senka-all-clear-oil-230ml
//		 https://tiki.vn/ly-giu-nhiet-lock-lock-swing-tumbler-bac-p2151853.html?spid=2130491&src=home-deal-hot
//		 https://eshop.guardian.vn/products/bioderma-kem-chong-nang-laser-spf50-30ml
//		 https://tiki.vn/thien-tai-ben-trai-ke-dien-ben-phai-p19963125.html?spid=19963126&src=home-deal-hot
//		 https://tiki.vn/loa-vi-tinh-microlab-m-108-2-1-11w-hang-chinh-hang-p375565.html?spid=73850&src=home-deal-hot
//		 https://tiki.vn/an-dam-khong-phai-la-cuoc-chien-tai-ban-p2287449.html?spid=2287671&src=home-deal-hot
//		 https://eshop.guardian.vn/products/bioderma-kem-duong-phuc-hoi-da-mun-30ml
//		 https://tiki.vn/bo-05-noi-trang-men-nap-kinh-mishio-mk153-p25033902.html?spid=25033911&src=home-deal-hot
//		 https://tiki.vn/dien-thoai-iphone-xr-64gb-hang-nhap-khau-chinh-hang-p4529255.html?src=personalization
//		 https://eshop.guardian.vn/products/tui-thom-bell-duc-huong-vana-15g
//		 
//		 */
//		
//		
//		
//		
//		
//		
//		
//		
//		
		
		
		
		
		
		eshopGuardianVnProductCatalogBrowser tikiBrowser = new eshopGuardianVnProductCatalogBrowser();
		tikiBrowser.browse(driver, wait, new PrintWriter(new BufferedWriter(pipeOut)));
		
		
//		endLatch.await();
		System.out.println("Test Finishes !!!");
		
		
	}

}
