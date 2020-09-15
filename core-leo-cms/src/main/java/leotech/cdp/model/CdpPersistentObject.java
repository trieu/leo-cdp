package leotech.cdp.model;

import java.util.UUID;

import com.arangodb.ArangoDatabase;
import com.devskiller.friendly_id.FriendlyId;

import leotech.cdp.dao.AbstractCdpDatabaseUtil;
import leotech.system.util.database.PersistentArangoObject;

/**
 * @author Trieu
 * 
 * common base class for all models in CDP
 *
 */
public abstract class CdpPersistentObject implements PersistentArangoObject {

	public final static String CDP_COLLECTION_PREFIX = "cdp_";
	
	public static String getCollectionName(Class<?> childClass) {
		return CDP_COLLECTION_PREFIX + childClass.getSimpleName().toLowerCase();
	}
	
	public static final ArangoDatabase getDatabaseInstance() {
		return AbstractCdpDatabaseUtil.getCdpDbInstance();
	}
	
	public static final String id(String keyHint) {
		return FriendlyId.toFriendlyId(UUID.nameUUIDFromBytes(keyHint.getBytes()));
	}
}
