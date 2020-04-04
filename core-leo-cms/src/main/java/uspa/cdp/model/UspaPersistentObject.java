package uspa.cdp.model;

import leotech.cms.model.common.PersistentArangoObject;

public abstract class UspaPersistentObject implements PersistentArangoObject{

    public final static String COLLECTION_PREFIX = "uspa_";
}
