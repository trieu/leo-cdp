package test.crawler.util;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.assertj.core.util.Arrays;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoCursor;

import leotech.cdp.dao.BaseLeoCdpDao;
import leotech.cdp.model.business.ProductItem;
import leotech.system.util.database.ArangoDbUtil;

public class ProductItemDao extends BaseLeoCdpDao {
	
	public static boolean importProductItems(List<String> filePaths) {
		ObjectInputStream inOOS = null;
		FileInputStream inFile = null;
		try {			
			for (String filePath : filePaths) {
				inFile = new FileInputStream(filePath);
				inOOS = new ObjectInputStream(inFile);
				@SuppressWarnings("unchecked")
				Collection<ProductItem> aColl = (Collection<ProductItem>) inOOS.readObject();
				for (ProductItem item : aColl) {
					System.out.println(item);
					save(item);
				}
				inOOS.close();
				inFile.close();				
			}					
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		} finally {
			try {
				inOOS.close();
				inFile.close();				
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}		
		return true;
	}
	
	public static boolean isExistedDocument(String id, String sku, String siteDomain) {
		Map<String, Object> bindKeys = new HashMap<>(2);
		String aql = "RETURN LENGTH(FOR d IN " + ProductItem.COLLECTION_NAME + " FILTER ";
		if (sku == null || sku.isEmpty()) {
			aql += "d._key == @id";
			bindKeys.put("id", id);
		} else {
			aql += "d.sku == @sku";
			bindKeys.put("sku", sku);
		}
		aql += " AND d.siteDomain == @siteDomain LIMIT 1 RETURN true) > 0";
		bindKeys.put("siteDomain", siteDomain);		
		ArangoCursor<Boolean> cursor = ArangoDbUtil.getActiveArangoDbInstance().query(aql, bindKeys, null, Boolean.class);
		while (cursor.hasNext()) {
			return cursor.next();
		}
		return false;
	}

	public static String save(ProductItem item) {
		if (item.isReadyForSave()) {
			ArangoCollection col = item.getCollection();
			if (col != null) {
				String id = item.getId();
				boolean isExisted = isExistedDocument(id,item.getSku(),item.getSiteDomain());
				System.out.println("existence " + isExisted);
				if (isExisted) {
					item.setUpdatedAt(new Date());
					col.updateDocument(id, item);
				} else {
					col.insertDocument(item);
				}
				return id;
			}
		}
		return "";
	}
	
	public static void main(String[] args) {
		List<String> filePaths = new ArrayList<>();
		filePaths.add("watsonsVn_BlockingDequeOfProductItem_0Pages_fromPage10");
		importProductItems(filePaths);
	}
	
}
