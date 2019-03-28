package leotech.cms.model;

import java.util.Arrays;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.FulltextIndexOptions;
import com.arangodb.model.HashIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.github.slugify.Slugify;
import com.google.gson.annotations.Expose;

import leotech.cms.model.common.PersistentArangoObject;
import leotech.cms.model.common.QueryFilter;
import leotech.system.util.database.ArangoDbUtil;
import rfx.core.util.StringUtil;

public class PersistentQueryFilter extends QueryFilter implements PersistentArangoObject {

    @DocumentField(Type.KEY)
    @Expose
    private String key;

    @Expose
    long creationTime;

    @Expose
    long modificationTime;

    @Expose
    String slug = ""; // for SEO friendly

    public PersistentQueryFilter(String name, long networkId) {
	super(name, networkId);
	initRequiredData();
    }

    public void initRequiredData() {
	this.slug = networkId + "-" + new Slugify().slugify(name);
	this.creationTime = System.currentTimeMillis();
	this.modificationTime = System.currentTimeMillis();
    }

    public boolean isReadyForSave() {
	return StringUtil.isNotEmpty(name) && networkId > 0 && StringUtil.isNotEmpty(this.slug);
    }

    public static final String COLLECTION_NAME = QueryFilter.class.getSimpleName().toLowerCase();
    static ArangoCollection collection;

    @Override
    public ArangoCollection getCollection() {
	if (collection == null) {
	    ArangoDatabase arangoDatabase = ArangoDbUtil.getArangoDatabase();

	    collection = arangoDatabase.collection(COLLECTION_NAME);

	    // ensure indexing key fields
	    collection.ensureFulltextIndex(Arrays.asList("name"), new FulltextIndexOptions().minLength(2));
	    collection.ensurePersistentIndex(Arrays.asList("slug"), new PersistentIndexOptions().unique(true));
	    collection.ensureHashIndex(Arrays.asList("networkId"), new HashIndexOptions());
	}
	return collection;
    }
}
