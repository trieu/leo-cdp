package test.crawler;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoCursor;

import leotech.cdp.dao.BaseLeoCdpDao;
import leotech.cdp.model.business.ProductItem;
import leotech.system.util.database.ArangoDbUtil;

public class TestProductDao extends BaseLeoCdpDao {
	
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
				System.out.println(isExisted);
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
	
	
}
