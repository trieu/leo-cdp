package leotech.cdp.model;

import com.arangodb.ArangoCollection;

public class Device extends CdpPersistentObject{

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
