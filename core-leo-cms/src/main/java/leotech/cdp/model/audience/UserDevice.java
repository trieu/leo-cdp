package leotech.cdp.model.audience;

import com.arangodb.ArangoCollection;

import leotech.cdp.model.CdpPersistentObject;

public class UserDevice extends CdpPersistentObject{
    
    public static final String COLLECTION_NAME = COLLECTION_PREFIX + UserDevice.class.getSimpleName().toLowerCase();

    @Override
    public ArangoCollection getCollection() {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public boolean isReadyForSave() {
	// TODO Auto-generated method stub
	return false;
    }

}
