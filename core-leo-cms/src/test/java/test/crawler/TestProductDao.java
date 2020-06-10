package test.crawler;

import java.util.Date;

import com.arangodb.ArangoCollection;

import leotech.cdp.dao.BaseLeoCdpDao;
import leotech.cdp.model.business.ProductItem;
import leotech.cdp.model.business.Touchpoint;
import leotech.system.util.database.ArangoDbUtil;

public class TestProductDao extends BaseLeoCdpDao {

	public static String save(ProductItem item) {
		if (item.isReadyForSave()) {
			ArangoCollection col = item.getCollection();
			if (col != null) {
				String id = item.getId();
				boolean isExisted = ArangoDbUtil.isExistedDocument(ProductItem.COLLECTION_NAME, id);
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
