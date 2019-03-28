package leotech.cms.model;

import com.arangodb.ArangoCollection;

import leotech.cms.model.common.TaxonomyNode;

public class Category extends TaxonomyNode {

    public Category() {

    }

    public Category(String name, long networkId) {
	super(name, networkId);
    }

    public static final String COLLECTION_NAME = Category.class.getSimpleName().toLowerCase();
    static ArangoCollection collectionInstance;

    @Override
    public ArangoCollection getCollection() {
	return getCollection(collectionInstance, COLLECTION_NAME);
    }

}
