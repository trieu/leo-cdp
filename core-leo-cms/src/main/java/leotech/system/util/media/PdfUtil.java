package leotech.system.util.media;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.encryption.InvalidPasswordException;
import org.apache.pdfbox.rendering.PDFRenderer;

public class PdfUtil {
    private static final String JPG = "jpg";
    
    static {
	 System.setProperty("sun.java2d.cmm", "sun.java2d.cmm.kcms.KcmsServiceProvider");
    }

    public static void savePageThumbnail(File pdfFile, File imageFile, int pageIndex) {
	try {
	   
	    PDDocument document = PDDocument.load(pdfFile);
	    PDFRenderer pdfRenderer = new PDFRenderer(document);
	    int num = document.getNumberOfPages();
	    if (num > pageIndex) {
		//BufferedImage bufferedImage = pdfRenderer.renderImageWithDPI(pageIndex, 300, ImageType.RGB);
		BufferedImage bufferedImage = pdfRenderer.renderImage(pageIndex, 0.5f);
		ImageIO.write(bufferedImage, JPG, imageFile);
	    }
	    document.close();
	} catch (InvalidPasswordException e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	} catch (IOException e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }
    
    public static void saveFirstPageThumbnail(File pdfFile, File imageFile) {
	savePageThumbnail(pdfFile, imageFile, 0);
    }
    
    public static void main(String[] args) {	
	savePageThumbnail( new File("/home/platform/Desktop/in-tmt-rise-of-on-demand-content.pdf"), new File("./test-PdfUtil.jpg"),4);
    }
}
