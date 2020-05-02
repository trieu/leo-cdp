package leotech.cdp.model;

import java.util.UUID;

import com.devskiller.friendly_id.FriendlyId;

import leotech.cms.model.common.PersistentArangoObject;

public abstract class CdpPersistentObject implements PersistentArangoObject{

    public final static String COLLECTION_PREFIX = "cdp_";
    
    protected static String id(String keyHint) {
	return FriendlyId.toFriendlyId(UUID.nameUUIDFromBytes(keyHint.getBytes()));
    }
}
