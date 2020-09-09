package leotech.cdp.model.journey;

import java.util.Date;

import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.github.slugify.Slugify;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.CdpPersistentObject;

/**
 * @author Trieu Nguyen (Thomas)
 * 
 *  Event metric is meta-data for quantify event data stream
 *
 */
public abstract class EventMetaData extends CdpPersistentObject {
	
	private static final int MAX_LEN_EVENT_NAME = 60;
	public static final int LEAD_SCORING_METRIC = 1;
	public static final int DATA_QUALITY_SCORING_METRIC = 2;
	public static final int ACQUISITION_SCORING_METRIC = 3;
	public static final int SATISFACTION_SCORING_METRIC = 4;
	public static final int LIFETIME_VALUE_SCORING_METRIC = 5;
	public static final int EFFORT_SCORING_METRIC = 6;
	public static final int PROMOTER_SCORING_METRIC = 7;
	public static final int CREDIT_SCORING_METRIC = 8;

	public static final int FIRST_PARTY_DATA = 1;
	public static final int SECOND_PARTY_DATA = 2;
	public static final int THIRD_PARTY_DATA  = 3;
	
	@DocumentField(Type.KEY)
	@Expose
	protected String id;
	
	@Expose
	protected String eventName;
	
	@Expose
	protected String eventLabel;
	
	@Expose
	protected Date createdAt;
	
	@Expose
	protected Date updatedAt;
	
	@Expose
	protected int score = 0;
	
	@Expose
	protected int scoreModel = LEAD_SCORING_METRIC;

	@Expose
	protected int dataType = 0;
	
	public EventMetaData() {
	}
	
	public EventMetaData(String eventName) {
		super();
		initBaseData(eventName);
	}
	
	public EventMetaData(String eventName, String eventLabel) {
		super();
		initBaseData(eventName);
		this.eventLabel = eventLabel;
	}
	
	public EventMetaData(String eventName, int score) {
		super();
		initBaseData(eventName);
		this.score = score;
	}
	
	public EventMetaData(String eventName, int score, int dataType) {
		super();
		initBaseData(eventName);
		this.score = score;
		
		if(dataType > 0 && dataType <= 3){
			this.dataType = dataType;
		}
	}
	
	public EventMetaData(String eventName, String eventLabel, int score, int dataType) {
		super();
		initBaseData(eventName);
		this.score = score;
		this.eventLabel = eventLabel;
		
		if(dataType > 0 && dataType <= 3){
			this.dataType = dataType;
		}
	}

	private void initBaseData(String eventName) {
		if(eventName.length() <= MAX_LEN_EVENT_NAME) {
			this.eventName = eventName.toLowerCase().replaceAll("[^a-z0-9]", "_");
			this.id = new Slugify().slugify(eventName);
			
			this.createdAt = new Date();
			this.dataType = FIRST_PARTY_DATA;
		} else {
			throw new IllegalArgumentException(eventName + " must have the length less than 50 characters ");
		}
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getEventName() {
		return eventName;
	}

	public void setEventName(String eventName) {
		this.eventName = eventName;
	}

	public String getEventLabel() {
		return eventLabel;
	}

	public void setEventLabel(String eventLabel) {
		this.eventLabel = eventLabel;
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

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

	public int getDataType() {
		return dataType;
	}

	public void setDataType(int dataType) {
		this.dataType = dataType;
	}

	public int getScoreModel() {
		return scoreModel;
	}

	public void setScoreModel(int scoreModel) {
		this.scoreModel = scoreModel;
	}

}
