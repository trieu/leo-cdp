package leotech.cdp.model.activation;

import java.util.Arrays;
import java.util.Date;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.Gson;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.CdpPersistentObject;
import rfx.core.util.StringUtil;

public class TargetMediaUnit extends CdpPersistentObject {
	
	public static final String COLLECTION_NAME = getCollectionName(TargetMediaUnit.class);
	static ArangoCollection dbCollection;

	@DocumentField(Type.KEY)
	@Expose
	String id;
	
	@Expose
	protected Date createdAt;
	
	@Expose
	protected Date updatedAt;
	
	@Expose
	protected Date expiredAt;

	@Expose
	protected int status = 0; // 0 is not read, 1 is clicked , 2 is read, 3 is got feedback from targeted profile
	
	@Expose
	protected String refCampaignId= "";
	
	@Expose
	protected String refProductId= "";
	
	@Expose
	protected String refProfileId = "";
	
	@Expose
	protected String refTouchpointId = "";
	
	@Expose
	protected String landingPageName = "";
	
	@Expose
	protected String landingPageUrl = "";
	
	@Expose
	protected String imageUrl = "";
	
	@Expose
	protected String videoUrl = "";
	
	@Expose
	protected String deepLinkUrl = "";
	
	protected String eventMetaDataId = "";
	
	@Override
	public boolean isReadyForSave() {
		return StringUtil.isNotEmpty(this.id) && StringUtil.isNotEmpty(this.landingPageName) && StringUtil.isNotEmpty(this.landingPageUrl) 
				&& StringUtil.isNotEmpty(this.refProfileId) && StringUtil.isNotEmpty(eventMetaDataId);
	}
	
	@Override
	public ArangoCollection getDbCollection() {
		if (dbCollection == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

			dbCollection = arangoDatabase.collection(COLLECTION_NAME);
			dbCollection.ensurePersistentIndex(Arrays.asList("refProfileId"), new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("refProductId"), new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("refCampaignId"), new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("landingPageUrl"), new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("eventMetaDataId"), new PersistentIndexOptions().unique(false));
		}
		return dbCollection;
	}
	

	public TargetMediaUnit(String refProfileId, String landingPageUrl,  String landingPageName, String eventMetaDataId) {
		super();
		this.createdAt = new Date();
		
		this.refProfileId = refProfileId;
		this.landingPageName = landingPageName;
		this.landingPageUrl = landingPageUrl;
		this.eventMetaDataId = eventMetaDataId;
		
		this.id = id(refProfileId + landingPageUrl + eventMetaDataId);
	}
	
	public TargetMediaUnit() {
	}

	public String getRefProductId() {
		return refProductId;
	}

	public void setRefProductId(String refProductId) {
		this.refProductId = refProductId;
	}

	public String getRefProfileId() {
		return refProfileId;
	}

	public void setRefProfileId(String refProfileId) {
		this.refProfileId = refProfileId;
	}

	public String getRefTouchpointId() {
		return refTouchpointId;
	}

	public void setRefTouchpointId(String refTouchpointId) {
		this.refTouchpointId = refTouchpointId;
	}

	public String getLandingPageUrl() {
		return landingPageUrl;
	}

	public void setLandingPageUrl(String landingPageUrl) {
		this.landingPageUrl = landingPageUrl;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	

	public String getLandingPageName() {
		return landingPageName;
	}

	public void setLandingPageName(String landingPageName) {
		this.landingPageName = landingPageName;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public Date getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}

	public String getRefCampaignId() {
		return refCampaignId;
	}

	public void setRefCampaignId(String refCampaignId) {
		this.refCampaignId = refCampaignId;
	}


	public String getDeepLinkUrl() {
		return deepLinkUrl;
	}

	public void setDeepLinkUrl(String deepLinkUrl) {
		this.deepLinkUrl = deepLinkUrl;
	}

	public Date getExpiredAt() {
		return expiredAt;
	}

	public void setExpiredAt(Date expiredAt) {
		this.expiredAt = expiredAt;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public String getVideoUrl() {
		return videoUrl;
	}

	public void setVideoUrl(String videoUrl) {
		this.videoUrl = videoUrl;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}
	
	public String getEventMetaDataId() {
		return eventMetaDataId;
	}

	public void setEventMetaDataId(String eventMetaDataId) {
		this.eventMetaDataId = eventMetaDataId;
	}

	@Override
	public String toString() {
		return new Gson().toJson(this);
	}
	
}
