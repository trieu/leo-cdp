package leotech.cms.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.FulltextIndexOptions;
import com.arangodb.model.HashIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.cms.model.common.PersistentArangoObject;
import leotech.system.model.AppMetadata;
import leotech.system.util.database.ArangoDbUtil;
import rfx.core.util.StringUtil;

/**
 * @author TrieuNT
 *
 */
public class FileMetadata implements PersistentArangoObject {

    @DocumentField(Type.KEY)
    private String key;

    @Expose
    String path;

    @Expose
    String name;

    @Expose
    long uploadedTime;

    @Expose
    int revision;

    @Expose
    String refObjectClass;

    @Expose
    String refObjectKey;

    @Expose
    boolean downloadable = true;

    @Expose
    protected String ownerLogin = ""; // the userId or botId

    @Expose
    int privacyStatus = 0;// 0: public, 1: protected or -1: private

    List<Long> viewerIds = new ArrayList<>();

    @Expose
    long networkId = AppMetadata.DEFAULT_ID;

    public FileMetadata() {
    }

    public FileMetadata(String ownerLogin, String path, String name, String refObjectClass, String refObjectKey) {
	super();
	this.ownerLogin = ownerLogin;
	this.path = path;
	this.name = name;
	this.uploadedTime = System.currentTimeMillis();
	this.refObjectClass = refObjectClass;
	this.refObjectKey = refObjectKey;
    }

    public static final String COLLECTION_NAME = FileMetadata.class.getSimpleName().toLowerCase();
    static ArangoCollection collection;

    @Override
    public ArangoCollection getCollection() {
	if (collection == null) {
	    ArangoDatabase arangoDatabase = ArangoDbUtil.getActiveArangoDbInstance();
	    collection = arangoDatabase.collection(COLLECTION_NAME);

	    // ensure indexing key fields
	    collection.ensurePersistentIndex(Arrays.asList("path"), new PersistentIndexOptions().unique(true));
	    collection.ensureHashIndex(Arrays.asList("refObjectClass", "refObjectKey"), new HashIndexOptions());
	    collection.ensureFulltextIndex(Arrays.asList("name"), new FulltextIndexOptions().minLength(1));
	    collection.ensureHashIndex(Arrays.asList("networkId"), new HashIndexOptions());
	    collection.ensureHashIndex(Arrays.asList("ownerLogin"), new HashIndexOptions());
	}
	return collection;
    }

    @Override
    public boolean isReadyForSave() {
	return StringUtil.isNotEmpty(name) && uploadedTime > 0 && StringUtil.isNotEmpty(this.path);
    }

    public String getKey() {
	return key;
    }

    public void setKey(String key) {
	this.key = key;
    }

    public String getPath() {
	return path;
    }

    public void setPath(String path) {
	this.path = path;
    }

    public String getName() {
	return name;
    }

    public void setName(String name) {
	this.name = name;
    }

    public long getUploadedTime() {
	return uploadedTime;
    }

    public void setUploadedTime(long uploadedTime) {
	this.uploadedTime = uploadedTime;
    }

    public int getRevision() {
	return revision;
    }

    public void setRevision(int revision) {
	this.revision = revision;
    }

    public boolean isDownloadable() {
	return downloadable;
    }

    public void setDownloadable(boolean downloadable) {
	this.downloadable = downloadable;
    }

    public int getPrivacyStatus() {
	return privacyStatus;
    }

    public void setPrivacyStatus(int privacyStatus) {
	this.privacyStatus = privacyStatus;
    }

    public List<Long> getViewerIds() {
	return viewerIds;
    }

    public void setViewerIds(List<Long> viewerIds) {
	this.viewerIds = viewerIds;
    }

    public String getRefObjectClass() {
	return refObjectClass;
    }

    public void setRefObjectClass(String refObjectClass) {
	this.refObjectClass = refObjectClass;
    }

    public String getRefObjectKey() {
	return refObjectKey;
    }

    public void setRefObjectKey(String refObjectKey) {
	this.refObjectKey = refObjectKey;
    }


    public String getOwnerLogin() {
        return ownerLogin;
    }

    public void setOwnerLogin(String ownerLogin) {
        this.ownerLogin = ownerLogin;
    }

    public long getNetworkId() {
	return networkId;
    }

    public void setNetworkId(long networkId) {
	this.networkId = networkId;
    }

}
