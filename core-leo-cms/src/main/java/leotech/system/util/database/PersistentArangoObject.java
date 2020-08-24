package leotech.system.util.database;

import com.arangodb.ArangoCollection;

public interface PersistentArangoObject {

	public ArangoCollection getCollection();

	public boolean isReadyForSave();
	

}
