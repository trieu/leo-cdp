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
import com.github.slugify.Slugify;
import com.google.gson.Gson;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.CdpPersistentObject;
import rfx.core.util.StringUtil;

/**
 * 
 * Jupyter Notebook Model for doing analytics, data science tasks and building machine learning models
 * 
 * @author tantrieuf31
 * @since 2020/08/30
 *
 */
public class Notebook extends CdpPersistentObject  {
	
	public static final String COLLECTION_NAME = getCollectionName(Notebook.class);
	static ArangoCollection instance;

	@DocumentField(Type.KEY)
	@Expose
	String id;
	
	@Expose
	String type;
	
	@Expose
	int status;
	
	@Expose
	protected String name = "";
	
	@Expose
	protected String jupyterFileUri = "";
	
	@Expose
	protected String jupyterOutputFileUri = "";
	
	@Expose
	protected String htmlFileUri = "";
	
	@Expose
	protected String pythonFileUri = "";
	
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
	
	@Expose
	protected int autoRunAfterMinute = 0;
	
	@Expose
	protected Date lastRunAt;
	
	@Expose
	protected String accessToken;
	
	@Override
	public ArangoCollection getDbCollection() {
		if (instance == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

			instance = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup
			instance.ensureFulltextIndex(Arrays.asList("name"), new FulltextIndexOptions());
			instance.ensureFulltextIndex(Arrays.asList("description"), new FulltextIndexOptions());
			instance.ensurePersistentIndex(Arrays.asList("createdAt"), new PersistentIndexOptions().unique(false));
		}
		return instance;
	}
	
	public Notebook(String type, String name) {
		if(name.length() > 10) {
			this.type = type;
			this.name = name;
			String keyHint = type + name;
			this.id = id(keyHint);
			this.createdAt = new Date();
			
			Slugify slg = new Slugify();
			String slugifiedName = slg.slugify(name);
			this.jupyterFileUri = slugifiedName + ".ipynb";
			this.jupyterOutputFileUri = slugifiedName + "-output.ipynb";
			this.htmlFileUri = slugifiedName + "-output.html";
		} else {
			throw new IllegalArgumentException("Notebook's name must has more than 10 characters");
		}
	}

	
	public static ArangoCollection getInstance() {
		return instance;
	}

	public static void setInstance(ArangoCollection instance) {
		Notebook.instance = instance;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getJupyterFileUri() {
		return jupyterFileUri;
	}

	public void setJupyterFileUri(String jupyterFileUri) {
		this.jupyterFileUri = jupyterFileUri;
	}
	
	

	public String getJupyterOutputFileUri() {
		return jupyterOutputFileUri;
	}

	public void setJupyterOutputFileUri(String jupyterOutputFileUri) {
		this.jupyterOutputFileUri = jupyterOutputFileUri;
	}

	public String getPythonFileUri() {
		return pythonFileUri;
	}

	public void setPythonFileUri(String pythonFileUri) {
		this.pythonFileUri = pythonFileUri;
	}

	public String getHtmlFileUri() {
		return htmlFileUri;
	}

	public void setHtmlFileUri(String htmlFileUri) {
		this.htmlFileUri = htmlFileUri;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<String> getDataSources() {
		return dataSources;
	}

	public void setDataSources(List<String> dataSources) {
		this.dataSources = dataSources;
	}

	public Map<String, Object> getParameters() {
		return parameters;
	}

	public void setParameters(Map<String, Object> parameters) {
		this.parameters = parameters;
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

	public Date getLastRunAt() {
		return lastRunAt;
	}

	public void setLastRunAt(Date lastRunAt) {
		this.lastRunAt = lastRunAt;
	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public String getId() {
		return id;
	}
	
	

	public int getAutoRunAfterMinute() {
		return autoRunAfterMinute;
	}

	public void setAutoRunAfterMinute(int autoRunAfterMinute) {
		this.autoRunAfterMinute = autoRunAfterMinute;
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
