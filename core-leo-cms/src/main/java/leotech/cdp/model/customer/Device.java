package leotech.cdp.model.customer;

import java.util.Arrays;
import java.util.Date;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.CdpPersistentObject;
import leotech.system.model.DeviceInfo;
import rfx.core.util.StringUtil;

public class Device extends CdpPersistentObject {

	public static final String COLLECTION_NAME = getCollectionName(Device.class);

	static ArangoCollection instance;

	@Override
	public ArangoCollection getDbCollection() {
		if (instance == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

			instance = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup

			instance.ensurePersistentIndex(Arrays.asList("name"), new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("type"), new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("osName"), new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("browserName"),new PersistentIndexOptions().unique(false));

		}
		return instance;
	}

	@DocumentField(Type.KEY)
	@Expose
	String id;

	@Expose
	String name;

	@Expose
	String type;

	@Expose
	String osName;

	@Expose
	String osVersion;

	@Expose
	String browserName;

	@Expose
	Date createdAt;

	public Device(DeviceInfo dv, Date createdAt) {

		this.name = dv.deviceName;
		this.type = dv.deviceType;
		this.osName = dv.deviceOs;
		this.osVersion = dv.deviceOsVersion;
		this.browserName = dv.deviceName;

		this.id = id(this.name + this.type + this.osName + this.osVersion + this.browserName);
		this.createdAt = createdAt;
	}

	public Device(DeviceInfo dv) {

		this.name = dv.deviceName;
		this.type = dv.deviceType;
		this.osName = dv.deviceOs;
		this.osVersion = dv.deviceOsVersion;
		this.browserName = dv.deviceName;

		this.id = id(this.name + this.type + this.osName + this.osVersion + this.browserName);
		this.createdAt = new Date();
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

	public String getOsName() {
		return osName;
	}

	public void setOsName(String osName) {
		this.osName = osName;
	}

	public String getOsVersion() {
		return osVersion;
	}

	public void setOsVersion(String osVersion) {
		this.osVersion = osVersion;
	}

	public String getBrowserName() {
		return browserName;
	}

	public void setBrowserName(String browserName) {
		this.browserName = browserName;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public String getId() {
		return id;
	}

	@Override
	public boolean isReadyForSave() {
		return StringUtil.isNotEmpty(id);
	}

}
