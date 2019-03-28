package test.util;

import java.io.File;
import java.io.IOException;

import leotech.system.util.media.ImageUtil;

public class WatermarkOverImage {

   

    public static void main(String[] args) throws IOException {
	File watermarkFile = new File("./public/images/product-logo/logo-lysaght.png");
	
//	String inputFilePath = "/home/platform/Pictures/bluescope/test.png";
//	String scaledFilePath = "/home/platform/Pictures/bluescope/scaled-test.png";
	//ImageUtil.resize(inputFilePath, scaledFilePath, 1);
	//ImageUtil.addWatermark(new File(scaledFilePath), watermarkFile, 200);
	ImageUtil.addWatermark(new File("/home/platform/Pictures/bluescope/lysaght-page.png"), watermarkFile,250);
	
    }
}
