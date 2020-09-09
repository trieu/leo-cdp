package leotech.cms.model;

import com.arangodb.ArangoCollection;
import com.google.gson.annotations.Expose;

import leotech.cms.model.common.TaxonomyNode;

public class Category extends TaxonomyNode {

	// version 1.0
	public static final int WEB_CONTENT = 1;
	public static final int SOCIAL_MEDIA_CONTENT = 2;
	public static final int EMAIL_CONTENT = 3;
	public static final int PUSH_MESSAGE_CONTENT = 4;

	// version 2.0
	public static final int APP_CONTENT = 5;
	public static final int UPLOADED_VIDEO = 6;
	public static final int AR_VR_CONTENT = 7;
	public static final int EBOOK_CONTENT = 8;
	public static final int PRESENTATION_CONTENT = 9;

	@Expose
	int type = WEB_CONTENT;

	public Category() {
	}

	public Category(String name, long networkId) {
		super(name, networkId);
	}

	public Category(String name, long networkId, int type) {
		super(name, networkId);
		this.type = type;
	}

	public static final String COLLECTION_NAME = getCollectionName(Category.class);
	static ArangoCollection collectionInstance;

	@Override
	public ArangoCollection getDbCollection() {
		return getCollection(collectionInstance, COLLECTION_NAME);
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

}
