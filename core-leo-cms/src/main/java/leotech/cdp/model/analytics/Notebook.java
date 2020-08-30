package leotech.cdp.model.analytics;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.FulltextIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.Gson;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.CdpPersistentObject;
import rfx.core.util.StringUtil;

public class Notebook extends CdpPersistentObject  {
	
	public static final String COLLECTION_NAME = getCollectionName(Notebook.class);
	static ArangoCollection instance;

	@DocumentField(Type.KEY)
	@Expose
	String id;
	
	@Expose
	String type;
	
	@Expose
	protected String name = "";
	
	@Expose
	protected String description = "";
	
	@Expose
	protected List<String> dataSources = new ArrayList<String>();
	
	@Expose
	protected Map<String, Object> parameters = new HashMap<String, Object>();
	
	@Expose
	protected Date createdAt;
	
	@Expose
	protected Date updatedAt;
	
	protected String accessToken;
	
	@Override
	public ArangoCollection getCollection() {
		if (instance == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

			instance = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup
			instance.ensureFulltextIndex(Arrays.asList("name"), new FulltextIndexOptions());
			instance.ensureFulltextIndex(Arrays.asList("description"), new FulltextIndexOptions());
			
			instance.ensurePersistentIndex(Arrays.asList("createdAt"), new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("updatedAt"), new PersistentIndexOptions().unique(false));

			instance.ensurePersistentIndex(Arrays.asList("fullUrl"), new PersistentIndexOptions().unique(false));
			
		}
		return instance;
	}
	

	
	public Notebook(String type, String name, String siteDomain) {
		this.type = type;
		this.name = name;
		String keyHint = type + name;
		this.id = id(keyHint);
	}

	
	@Override
	public boolean isReadyForSave() {
		return StringUtil.isNotEmpty(this.type) && StringUtil.isNotEmpty(this.name) && (this.createdAt != null) ;
	}
	
	@Override
	public String toString() {
		return new Gson().toJson(this);
	}
	
	
}
