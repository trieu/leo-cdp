package leotech.cdp.model.activation;

import com.arangodb.ArangoCollection;

import leotech.cdp.model.CdpPersistentObject;

public class Creative extends CdpPersistentObject implements Comparable<Creative> {
    
    public static final String COLLECTION_NAME = CDP_COLLECTION_PREFIX + Creative.class.getSimpleName().toLowerCase();

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

    @Override
    public int compareTo(Creative o) {
	// TODO Auto-generated method stub
	return 0;
    }

}
