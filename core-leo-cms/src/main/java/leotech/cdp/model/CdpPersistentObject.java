package leotech.cdp.model;

import java.util.UUID;

import com.arangodb.ArangoDatabase;
import com.devskiller.friendly_id.FriendlyId;

import leotech.cdp.dao.BaseLeoCdpDao;
import leotech.cms.model.common.PersistentArangoObject;

/**
 * @author Trieu
 * 
 * common base class for all models in CDP
 *
 */
public abstract class CdpPersistentObject implements PersistentArangoObject {

	public final static String COLLECTION_PREFIX = "cdp_";

	public static String id(String keyHint) {
		return FriendlyId.toFriendlyId(UUID.nameUUIDFromBytes(keyHint.getBytes()));
	}

	public static String getCollectionName(Class<?> childClass) {
		return COLLECTION_PREFIX + childClass.getSimpleName().toLowerCase();
	}
	
	public static final ArangoDatabase cdpDbInstance() {
		return BaseLeoCdpDao.getCdpDbInstance();
	}
}
