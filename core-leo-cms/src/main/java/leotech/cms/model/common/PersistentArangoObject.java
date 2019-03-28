package leotech.cms.model.common;

import com.arangodb.ArangoCollection;

public interface PersistentArangoObject {

    public ArangoCollection getCollection();
    
    public boolean isReadyForSave();
}
