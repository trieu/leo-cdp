package test.ecommerce;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.List;

import com.univocity.parsers.csv.CsvParser;
import com.univocity.parsers.csv.CsvParserSettings;

import leotech.cdp.dao.ProductItemDaoUtil;
import leotech.cdp.model.business.ProductItem;
import rfx.core.util.StringUtil;

public class ProductImporter {

	public static void main(String[] args) {
		CsvParserSettings settings = new CsvParserSettings();
		settings.setHeaderExtractionEnabled(true);
		CsvParser csvParser = new CsvParser(settings);
		
		String pathname = "./data/product-items.csv";
		// parses all rows in one go.
		List<String[]> allRows;
		try {
			allRows = csvParser.parseAll(new FileReader(new File(pathname)));
			allRows.stream().forEach(data -> {
				String sku = data[0];
				String name = data[1];
				String description = data[2];
				String image = data[3];
				double originalPrice = StringUtil.safeParseDouble(data[4]) ;
				double salePrice = StringUtil.safeParseDouble(data[5]) ;
				String priceCurrency = data[6];
				String fullUrl =  data[7];
				String siteName = data[8];
				String siteDomain = data[9];
				ProductItem item = new ProductItem(sku, name, description, image, originalPrice, salePrice, priceCurrency, fullUrl, siteName, siteDomain);
				item.setAvailability("http://schema.org/InStock");
				item.setItemCondition("http://schema.org/NewCondition");
				System.out.println(item);
				ProductItemDaoUtil.save(item);
			});
			
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
}
