package leotech.cdp.model;

import com.arangodb.ArangoCollection;

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
