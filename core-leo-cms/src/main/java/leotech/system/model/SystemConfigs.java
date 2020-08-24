package leotech.system.model;

import java.util.Arrays;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.system.util.database.ArangoDbUtil;
import leotech.system.util.database.PersistentArangoObject;
import rfx.core.util.StringUtil;

public class SystemConfigs implements PersistentArangoObject {
	
	public static final String COLLECTION_NAME = "system_configs";
	static ArangoCollection instance;
	
	@Override
	public ArangoCollection getCollection() {
		if (instance == null) {
			ArangoDatabase arangoDatabase = ArangoDbUtil.getActiveArangoDbInstance();

			instance = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields
			instance.ensurePersistentIndex(Arrays.asList("name"), new PersistentIndexOptions().unique(true));
		}
		return instance;
	}

	@Override
	public boolean isReadyForSave() {
		return StringUtil.isNotEmpty(name) && configs != null;
	}

	@Expose
	String name;
	
	@Expose
	Map<String, String> configs;
	

	public SystemConfigs(String name, Map<String, String> configs) {
		super();
		this.name = name;
		this.configs = configs;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	public Map<String, String> getConfigs() {
		return configs;
	}

	public void setConfigs(Map<String, String> configs) {
		this.configs = configs;
	}

	
}
