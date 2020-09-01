package leotech.system.util.database;

import com.arangodb.ArangoCollection;

/**
 * 
 * the interface for data persistent model
 * 
 * @author tantrieuf31
 * @since 2019
 *
 */
public interface PersistentArangoObject {

	// the collection for storing
	public ArangoCollection getCollection();

	// check for data validation
	public boolean isReadyForSave();

}
