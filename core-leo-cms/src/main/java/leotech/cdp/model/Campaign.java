package leotech.cdp.model;

import com.arangodb.ArangoCollection;

public class Campaign extends CdpPersistentObject implements Comparable<Campaign> {
    public static final String COLLECTION_NAME = COLLECTION_PREFIX + Campaign.class.getSimpleName().toLowerCase();

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
    public int compareTo(Campaign o) {
	// TODO Auto-generated method stub
	return 0;
    }

}
