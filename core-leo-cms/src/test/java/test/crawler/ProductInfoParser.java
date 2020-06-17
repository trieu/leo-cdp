package test.crawler;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.PipedInputStream;
import java.io.PipedOutputStream;
import java.io.Reader;
import java.net.URL;
import java.util.concurrent.CountDownLatch;

import org.apache.commons.lang3.SerializationUtils;
import org.jsoup.Jsoup;
import org.jsoup.helper.Validate;
import org.jsoup.nodes.Document;

import leotech.cdp.model.business.ProductItem;
import rfx.core.util.HttpClientUtil;

public class ProductInfoParser implements Runnable {
	
	private String hostName;
	private ProductItem currentProductItem;	
	private String currentHTML;
	private Document currentDoc;
	private ProductInfoDocParser currentProductItemDocParser;
	private BufferedReader inBR;
	private ObjectOutputStream outOOS;
	private CountDownLatch outReadyLatch;
	private CountDownLatch outAliveLatch;
	
	
	public String getHostName() {
		return hostName;
	}
	
	public void setCurrentHTML(String htmlStr) {
		this.currentHTML = htmlStr;
		this.currentDoc = Jsoup.parse(htmlStr);
	}
	
	public String getCurrentHTML() {
		return currentHTML;
	}
	
	public void setHostName(String aHostName) throws Exception {
		
		Validate.notNull(aHostName,"Host name cannot be null");
		Validate.notEmpty(aHostName, "Host name cannot be empty");
		
		switch(aHostName.trim().toLowerCase()) {
			case "tiki.vn":
				this.hostName = "tiki.vn";
				this.currentProductItemDocParser = new tikiVnProductInfoDocParser();
				break;
			case "eshop.guardian.vn":
				this.hostName = "eshop.guardian.vn";
				this.currentProductItemDocParser = new eshopGuardianVnProductInfoDocParser();
			    break;
			default:
				throw new Exception("Host name " + aHostName + " is not yet supported !");
		}
		
		if (currentProductItem == null) {
			currentProductItem = new ProductItem("");
			currentProductItem.setSiteDomain(hostName);
		}
	}
	
	public ProductItem process(String urlStr) throws Exception {
		String htmlStr;
		if (new URL(urlStr).getHost().equals(hostName)
				&& !(htmlStr = HttpClientUtil.executeGet(urlStr)).equals("404")) {
			this.setCurrentHTML(htmlStr);
			if (currentProductItemDocParser.parse(currentDoc, currentProductItem))
				return currentProductItem;		
		}
		return null;
	}	
	
	@Override
	public void run() {
		System.out.println(Thread.currentThread().getName() + " STARTs ");
		String input;
        try {        	
        	if (outReadyLatch.getCount() > 0) {
        		outOOS.writeObject(null);
        		outOOS.flush();
        		outReadyLatch.countDown();
        	}        	
			while ((input = inBR.readLine().trim()) != null && !input.isEmpty()) {
				if (process(input) != null) {
					System.out.println(Thread.currentThread().getName() + " sends out => " + currentProductItem.getName());
					outOOS.writeObject(SerializationUtils.clone(currentProductItem));
					outOOS.flush();
				}
			}
			System.out.println(Thread.currentThread().getName() + " ENDs ");
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			outAliveLatch.countDown();
			try {
				if (outAliveLatch.getCount() == 0)
					outOOS.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
	}
	
	public ProductInfoParser(String aHostName, Reader in, PipedOutputStream out, CountDownLatch readyLatch, CountDownLatch aliveLatch) throws Exception {
		this.setHostName(aHostName);
		this.inBR = new BufferedReader(in);
		this.outOOS =  new ObjectOutputStream(out);
		this.outReadyLatch = readyLatch;
		this.outAliveLatch = aliveLatch;
	}


	public static void main(String[] args) throws Exception {
		System.out.println("Main thread is- " + Thread.currentThread().getName()); 
		PipedInputStream pipedInputStream=new PipedInputStream();
		PipedOutputStream pipedOutputStream=new PipedOutputStream();
		pipedInputStream.connect(pipedOutputStream);
		
		CountDownLatch readyLatch = new CountDownLatch(1);
		CountDownLatch aliveLatch = new CountDownLatch(1);
		
		/*Thread for reading data from pipe*/
		Thread pipeReader=new Thread(new Runnable() {
			@Override
			public void run() {
				ObjectInputStream objectInputStream;
				System.out.println(Thread.currentThread().getName() + " STARTs ");
				try {
					objectInputStream = new ObjectInputStream(pipedInputStream);
					readyLatch.await();
					if (objectInputStream.readObject() == null)
						System.out.println(Thread.currentThread().getName() + " connect OK ");
					ProductItem currentItem;
					do {		
						currentItem = (ProductItem) objectInputStream.readObject();
						System.out.println(Thread.currentThread().getName() + " receives <= " + currentItem.getName());						
					} while (currentItem != null);
					System.out.println(Thread.currentThread().getName() + " ENDs ");
					
				} catch (java.io.EOFException eof) {
					// Do nothing, out pipe closed
				} catch (IOException | ClassNotFoundException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (Exception e) {
					e.printStackTrace();
				} finally {
					try {
						pipedInputStream.close();
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
		});
		
//		Thread t0 = new Thread(new ProductInfoParser("eshop.guardian.vn",new InputStreamReader(System.in),null));
		Thread t0 = new Thread(new ProductInfoParser("tiki.vn",new InputStreamReader(System.in),pipedOutputStream,readyLatch,aliveLatch));
		t0.start();
		
		pipeReader.start();
		System.out.print("Enter link: ");	
		/* copy following links and paste to terminal when test:
		 
		 
		 https://tiki.vn/ly-giu-nhiet-lock-lock-swing-tumbler-bac-p2151853.html?spid=2130491&src=home-deal-hot
		 https://tiki.vn/thien-tai-ben-trai-ke-dien-ben-phai-p19963125.html?spid=19963126&src=home-deal-hot
		 https://tiki.vn/loa-vi-tinh-microlab-m-108-2-1-11w-hang-chinh-hang-p375565.html?spid=73850&src=home-deal-hot
		 https://tiki.vn/an-dam-khong-phai-la-cuoc-chien-tai-ban-p2287449.html?spid=2287671&src=home-deal-hot
		 https://tiki.vn/bo-05-noi-trang-men-nap-kinh-mishio-mk153-p25033902.html?spid=25033911&src=home-deal-hot
		 https://tiki.vn/dien-thoai-iphone-xr-64gb-hang-nhap-khau-chinh-hang-p4529255.html?src=personalization
		 
		  
		 */
		aliveLatch.await();
		System.out.println("Main thread ends !!!");
	}

}
