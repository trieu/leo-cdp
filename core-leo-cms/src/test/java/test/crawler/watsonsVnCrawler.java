package test.crawler;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.net.Proxy;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingDeque;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.ThreadLocalRandom;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import leotech.cdp.model.business.ProductItem;
import leotech.crawler.util.JsoupParserUtil;
import test.crawler.util.ProductItemDao;


public class watsonsVnCrawler {
	
	private static boolean isOnCloud = true;
	
	private static final int PARALLELISM = 1;
	
	private static final String USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36";
	
//	private static final Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("91.67.240.45",3128));
	private static final Proxy proxy = null;
	
	private static final int minThreadSleepMSec = 3000;
	
	private static final int maxThreadSleepMSec = 10000;
	
	private static final Pattern PROMO_PATTERN = Pattern.compile("(?i)(Mua\\s+(\\d)\\s+t\u00ednh\\s+ti\u1ec1n\\s+(\\d))|(m\u00e3\\s+([\\w]+)\\s+.*gi\u1ea3m\\s+(\\d+)\\%\\/(\\d)\\s+(tri\u1ec7u))");
	
	private static BlockingDeque<ProductItem> productItems = new LinkedBlockingDeque<>();
	
	public static void processOneProduct(String productUrl, String promoStr) throws Exception{
		ProductItem productItem = new ProductItem(productUrl);
		watsonsVn_ProductJsoupDocToProductItem.commonParser.parse(Jsoup.connect(productUrl).userAgent(USER_AGENT).proxy(proxy).get(),productItem);
		Matcher m;
		if (!promoStr.isEmpty() && (m = PROMO_PATTERN.matcher(promoStr)).find()) {
			double salePrice = productItem.getSalePrice();
			List<String> promoCodes = productItem.getPromoCodes();
			List<Double> promoPrices = productItem.getPromoPrices();
			if (promoCodes == null)
				promoCodes = new ArrayList<>();
			if (promoPrices == null)
				promoPrices = new ArrayList<>();
			if (m.group(1) != null && m.group(2) != null && m.group(3) != null) {
				int itemCount4Promo = Integer.parseUnsignedInt(m.group(2));
				int itemCharged4Promo = Integer.parseUnsignedInt(m.group(3));
				if (itemCharged4Promo == 1) {
					promoPrices.add(salePrice/itemCount4Promo);
				}					
				promoCodes.add(m.group(1));			
			} else if (m.group(4) != null && m.group(5) != null && m.group(6) != null && m.group(7) != null && m.group(8) != null) {
				promoCodes.add(m.group(4));				
				double reducePercent = Double.parseDouble(m.group(6));
				double thresholdValue = Double.parseDouble(m.group(7));
				int multiplier = 1000000;				
				switch(m.group(8)) {
				  case "ng\u00e0n":
				  case "ngh\u00ecn":
					  multiplier = 1000;
					  break;
				  default:
					  break;
				}
				double price4Promo =  thresholdValue * multiplier;
				if (salePrice >= price4Promo)
					promoPrices.add(salePrice*(100-reducePercent)/100);
			}
			productItem.setPromoCodes(promoCodes);
			productItem.setPromoPrices(promoPrices);
		}
		
		if (isOnCloud)
			productItems.put(productItem);
		else
			ProductItemDao.save(productItem);
		System.out.println(productItem);		
	}
	
	public static void crawlWatsonsVn(int startPageIndex, int pageCount){
		ForkJoinPool forkJoinPool = null;
		String currentPageUrl = "product-categories/c/1?q=%3AigcBestSeller&page=" + (startPageIndex<0?0:startPageIndex) + "&resultsForPage=64&text=&sort=igcBestSeller&deliveryType=";
		Document page = null;
		int count = 0;
		try {								
			forkJoinPool = new ForkJoinPool(PARALLELISM);			
			
			do {
				currentPageUrl = "https://www.watsons.vn/" + currentPageUrl.replaceFirst("^\\s*\\/", "");				
				page = Jsoup.connect(currentPageUrl).userAgent(USER_AGENT).proxy(proxy).get();
				System.out.println("=> PAGE " + currentPageUrl);
				
				final Elements productItemContainers = page.select("div.productItemContainer");
				
				forkJoinPool.submit(() -> productItemContainers.parallelStream().forEach(productItemContainer -> {
					String productUrl;
					try {
						Thread.sleep(ThreadLocalRandom.current().nextInt(minThreadSleepMSec, maxThreadSleepMSec));
						productUrl = "https://www.watsons.vn/" + productItemContainer.selectFirst("div.productNameInfo a[href]").attr("href").replaceFirst("^\\s*\\/", "");
						Element promoEle = productItemContainer.selectFirst("div.PWPbtn > a.gtmAlink");
						processOneProduct(productUrl,promoEle == null?"":promoEle.text().trim());
					} catch (Exception e) {
						System.out.println("=> ITEM <=");
						e.printStackTrace();
					}				
				})).get();
				if ((++count) >= pageCount)
					break;
			} while (!(currentPageUrl = JsoupParserUtil.getAttr(page, "a.next", "href")).isEmpty());
	
		} catch (Exception e) {
			System.out.println("=> PAGE <= " + currentPageUrl);
			e.printStackTrace();
		} finally {
			if (isOnCloud) {				
				try {
					ObjectOutputStream toFile;
					toFile = new ObjectOutputStream(new FileOutputStream(
							"watsonsVn_BlockingDequeOfProductItem_" + count + "Pages_fromPage" + startPageIndex));
					toFile.writeObject(productItems);				
					toFile.close();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}				
				System.out.println("=> Saved into watsonsVn_BlockingDequeOfProductItem_" + count + "Pages_fromPage" + startPageIndex);
			}
			if (forkJoinPool != null)
                forkJoinPool.shutdown();
			System.out.println("=> DONE !");
		}
	}

	public static void main(String[] args) throws Exception {
		if (args.length >= 2) {
			System.out.println("Crawler config: ");
			System.out.println("=> Number of concurrent threads: " + PARALLELISM);
			System.out.println("=> Minium wait time between requests to watsons.vn: " + minThreadSleepMSec);
			isOnCloud = args.length>=3?Boolean.parseBoolean(args[2]):isOnCloud;
			if (isOnCloud)
				System.out.println("=> A collection of all crawled product items will be saved into a file");
			else
				System.out.println("=> Crawled product items will be saved directly into database");	
			System.out.println("=> Crawler now starts crawling from page " + args[0] + " ...");
			crawlWatsonsVn(Integer.parseInt(args[0]),Integer.parseInt(args[1]));	
			// VM instance 1: nohup java -jar watsonsVnCrawler.jar 0 21 2>&1 &
			// VM instance 2: nohup java -jar watsonsVnCrawler.jar 21 21 2>&1 &
			// VM instance 3: nohup java -jar watsonsVnCrawler.jar 42 21 2>&1 &
			// VM instance 4: nohup java -jar watsonsVnCrawler.jar 63 21 2>&1 &
			// VM instance 5: nohup java -jar watsonsVnCrawler.jar 84 21 2>&1 &
			// after get all data file, use ProductItemDao.importProductItems to save into database
		} else {
			System.out.println("This is a quick test for crawler");
			crawlWatsonsVn(0,1);	
		}
	}

}
