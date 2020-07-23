package leotech.cdp.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoCursor;
import com.arangodb.ArangoDatabase;

import leotech.cdp.model.business.ProductItem;
import leotech.cdp.model.marketing.Touchpoint;
import leotech.core.config.AqlTemplate;
import leotech.system.model.DataFilter;
import leotech.system.model.JsonDataTablePayload;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbUtil;

public class ProductItemDaoUtil extends BaseLeoCdpDao {

	static final String AQL_GET_PRODUCT_ITEM_BY_ID = AqlTemplate.get("AQL_GET_PRODUCT_ITEM_BY_ID");
	static final String AQL_GET_PRODUCT_ITEM_BY_URL = AqlTemplate.get("AQL_GET_PRODUCT_ITEM_BY_FULL_URL");
	static final String AQL_GET_PRODUCT_ITEMS_BY_FILTER  = AqlTemplate.get("AQL_GET_PRODUCT_ITEMS_BY_FILTER");
	static final String AQL_GET_PRODUCT_ITEMS = AqlTemplate.get("AQL_GET_PRODUCT_ITEMS");



	public static String save(ProductItem item) {
		if (item.isReadyForSave()) {
			ArangoDatabase db = getCdpDbInstance();
			ArangoCollection col = item.getCollection();
			if (col != null) {
				String id = item.getId();
				boolean isExisted = ArangoDbUtil.isExistedDocument(db,ProductItem.COLLECTION_NAME, id);
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

	public static ProductItem getById(String id) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("id", id);
		ProductItem p = new ArangoDbQuery<ProductItem>(db, AQL_GET_PRODUCT_ITEM_BY_ID, bindVars, ProductItem.class)
				.getResultsAsObject();
		return p;
	}

	public static ProductItem getByUrl(String url) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("url", url);
		ProductItem p = new ArangoDbQuery<ProductItem>(db, AQL_GET_PRODUCT_ITEM_BY_URL, bindVars, ProductItem.class)
				.getResultsAsObject();
		return p;
	}

	public static List<ProductItem> list(int startIndex, int numberResult) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(2);
		bindVars.put("startIndex", startIndex);
		bindVars.put("numberResult", numberResult);
		List<ProductItem> list = new ArangoDbQuery<ProductItem>(db, AQL_GET_PRODUCT_ITEMS, bindVars, ProductItem.class).getResultsAsList();
		return list;
	}
	
	
	public static JsonDataTablePayload filter(DataFilter filter) {
		ArangoDatabase db = getCdpDbInstance();
		
		//System.out.println("==> before apply DataFilter " + filter);
		
		//TODO dynamic query builder for filtering data
		Map<String, Object> bindVars = new HashMap<>(2);
		bindVars.put("startIndex", filter.getStart());
		bindVars.put("numberResult", filter.getLength());
		
		List<ProductItem> list = new ArangoDbQuery<ProductItem>(db, AQL_GET_PRODUCT_ITEMS_BY_FILTER, bindVars, ProductItem.class).getResultsAsList();
		
		long recordsTotal = countTotalOfProductItems();
		int recordsFiltered = list.size();
		int draw = filter.getDraw();
		JsonDataTablePayload payload =  JsonDataTablePayload.data(filter.getUri(), list, recordsTotal, recordsFiltered, draw);
		return payload;
	}
	
	public static long countTotalOfProductItems() {
		ArangoDatabase db = getCdpDbInstance();
		long c = db.collection(ProductItem.COLLECTION_NAME).count().getCount();
		return c;
	}

}
