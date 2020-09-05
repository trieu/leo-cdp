package leotech.cdp.dao;

import java.util.HashMap;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

import leotech.cdp.model.customer.Device;
import leotech.system.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbUtil;

public class DeviceDaoUtil extends BaseLeoCdpDao {

	static final String AQL_GET_DEVICE_BY_ID = AqlTemplate.get("AQL_GET_DEVICE_BY_ID");
	
	public static boolean save(Device d) {
		if (d.isReadyForSave()) {
			ArangoCollection col = d.getCollection();
			String id = d.getId();
			if (col != null) {
				ArangoDatabase db = getCdpDbInstance();
				boolean isExisted = ArangoDbUtil.isExistedDocument(db, Device.COLLECTION_NAME, id);
				if(!isExisted) {
					col.insertDocument(d);
				}
				return true;
			}
		}
		return false;
	}

	public static Device getById(String id) {
		ArangoDatabase db = getCdpDbInstance();
		Map<String, Object> bindVars = new HashMap<>(1);
		bindVars.put("id", id);
		Device p = new ArangoDbQuery<Device>(db, AQL_GET_DEVICE_BY_ID, bindVars, Device.class).getResultsAsObject();
		return p;
	}

}
