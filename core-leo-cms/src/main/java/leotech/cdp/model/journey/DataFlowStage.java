package leotech.cdp.model.journey;

import java.util.Arrays;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.PersistentIndexOptions;
import com.github.slugify.Slugify;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.CdpPersistentObject;
import rfx.core.util.StringUtil;

/**
 * data flow stage is metadata of Data Journey Funnel
 * 
 * @author tantrieuf31
 * @since
 *
 */
public class DataFlowStage extends CdpPersistentObject {

	public static final String COLLECTION_NAME = getCollectionName(DataFlowStage.class);
	static ArangoCollection dbCollection;

	@DocumentField(Type.KEY)
	@Expose
	protected String id;

	@Expose
	int orderIndex;

	@Expose
	String name;

	@Expose
	String type;
	
	@Expose
	String flowName;

	public DataFlowStage() {

	}

	public DataFlowStage(int orderIndex, String name, String type, String flowName) {
		super();
		this.orderIndex = orderIndex;
		this.name = name;
		this.type = type;
		this.flowName = flowName;

		this.id = new Slugify().slugify(name);
	}

	@Override
	public boolean isReadyForSave() {
		return StringUtil.isNotEmpty(id) && StringUtil.isNotEmpty(name);
	}

	public int getOrderIndex() {
		return orderIndex;
	}
	public void setOrderIndex(int orderIndex) {
		this.orderIndex = orderIndex;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	public String getFlowName() {
		return flowName;
	}

	public void setFlowName(String flowName) {
		this.flowName = flowName;
	}

	@Override
	public int hashCode() {
		if(StringUtil.isNotEmpty(id)) {
			return this.id.hashCode();
		}
		return 0;
	}

	@Override
	public ArangoCollection getDbCollection() {
		if (dbCollection == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

			dbCollection = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup
			dbCollection.ensurePersistentIndex(Arrays.asList("type"), new PersistentIndexOptions().unique(false));
			dbCollection.ensurePersistentIndex(Arrays.asList("name"), new PersistentIndexOptions().unique(false));

		}
		return dbCollection;
	}

}
