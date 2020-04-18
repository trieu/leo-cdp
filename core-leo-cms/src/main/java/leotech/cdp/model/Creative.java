package leotech.cdp.model;

import com.arangodb.ArangoCollection;

public class Creative extends CdpPersistentObject implements Comparable<Creative> {

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
