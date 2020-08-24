package leotech.cms.model.common;

import leotech.system.util.database.PersistentArangoObject;

/**
 * @author Trieu
 * 
 * common base class for all models in CDP
 *
 */
public abstract class CmsPersistentObject implements PersistentArangoObject {

	public final static String CMS_COLLECTION_PREFIX = "cms_";
	
	public static String getCollectionName(Class<?> childClass) {
		return CMS_COLLECTION_PREFIX + childClass.getSimpleName().toLowerCase();
	}
	
}
