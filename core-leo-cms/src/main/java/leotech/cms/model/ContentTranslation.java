package leotech.cms.model;

import java.util.Arrays;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDBException;
import com.arangodb.ArangoDatabase;
import com.arangodb.model.PersistentIndexOptions;

import leotech.system.util.database.ArangoDbUtil;
import leotech.system.util.database.PersistentArangoObject;
import rfx.core.util.StringUtil;

public class ContentTranslation implements PersistentArangoObject {

	String localeCode;
	String contentId;

	String title;
	String mediaInfo;

	long creationTime;
	long modificationTime;

	public static final String COLLECTION_NAME = ContentTranslation.class.getSimpleName().toLowerCase();
	static ArangoCollection collection;

	public ContentTranslation() {
		super();
	}

	@Override
	public ArangoCollection getCollection() throws ArangoDBException {
		if (collection == null) {
			ArangoDatabase arangoDatabase = ArangoDbUtil.getActiveArangoDbInstance();

			collection = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields
			collection.ensurePersistentIndex(Arrays.asList("localeCode", "contentId"),
					new PersistentIndexOptions().unique(true));

		}
		return collection;
	}

	@Override
	public boolean isReadyForSave() {
		return StringUtil.isNotEmpty(localeCode) && StringUtil.isNotEmpty(this.contentId)
				&& StringUtil.isNotEmpty(this.title);
	}

	public String getLocaleCode() {
		return localeCode;
	}

	public void setLocaleCode(String localeCode) {
		this.localeCode = localeCode;
	}

	public String getContentId() {
		return contentId;
	}

	public void setContentId(String contentId) {
		this.contentId = contentId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getMediaInfo() {
		return mediaInfo;
	}

	public void setMediaInfo(String mediaInfo) {
		this.mediaInfo = mediaInfo;
	}

	public long getCreationTime() {
		return creationTime;
	}

	public void setCreationTime(long creationTime) {
		this.creationTime = creationTime;
	}

	public long getModificationTime() {
		return modificationTime;
	}

	public void setModificationTime(long modificationTime) {
		this.modificationTime = modificationTime;
	}

}
