package leotech.cdp.model.customer;

import com.arangodb.ArangoCollection;

import leotech.cdp.model.CdpPersistentObject;

public class UserDevice extends CdpPersistentObject {

	public static final String COLLECTION_NAME =  getCollectionName(UserDevice.class);

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
