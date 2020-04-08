package leotech.cdp.model;

import leotech.cms.model.common.PersistentArangoObject;

public abstract class CdpPersistentObject implements PersistentArangoObject{

    public final static String COLLECTION_PREFIX = "cdp_";
}
