package leotech.system.model;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.HashIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.cms.model.Category;
import leotech.cms.model.Page;
import leotech.cms.model.Post;
import leotech.cms.model.common.PersistentArangoObject;
import leotech.system.util.Encryptor;
import leotech.system.util.database.ArangoDbUtil;
import rfx.core.util.StringUtil;

/**
 * @author trieu
 * 
 * core user model for system administration
 * 
 */
public class User implements PersistentArangoObject {

	public static final int STATUS_PENDING = 0;
	public static final int STATUS_ACTIVE = 1;
	public static final int STATUS_DISABLED = 2;
	public static final int STATUS_EXPIRED = 3;

	/**
	 * access public content only, can not create content,
	 */
	public static final int ROLE_GUEST = 0;

	/**
	 * access public and protected content but can not create content
	 */
	public static final int ROLE_STANDARD_USER = 1;

	/**
	 * access public, protected and private content, can create content in
	 * network
	 */
	public static final int ROLE_EDITOR = 2;

	/**
	 * full access to all contents in network, administrator of network
	 */
	public static final int ROLE_ADMIN = 3;

	/**
	 * full access to all contents in platforms, administrator of platform
	 */
	public static final int ROLE_SUPER_ADMIN = 6;

	@DocumentField(Type.KEY)
	@Expose
	private String key;

	@Expose
	String userLogin;

	@Expose
	String displayName;

	@Expose
	String userEmail;

	@Expose
	String avatarUrl = "";

	@Expose
	long creationTime;

	@Expose
	long modificationTime;

	@Expose
	long registeredTime = 0;

	@Expose
	int status = STATUS_PENDING;

	@Expose
	int role = ROLE_GUEST;

	@Expose
	boolean isOnline;

	@Expose
	long networkId;

	@Expose
	List<AppMetadata> subscribedNetworks;

	@Expose
	List<Category> subscribedCategories;

	@Expose
	List<Page> subscribedPages;

	@Expose
	List<Post> subscribedPosts;

	// high sensitive data
	transient String encryptionKey;
	String userPass;
	String activationKey;

	@Expose
	Map<String, String> customData = new HashMap<>();

	public User() {

	}

	/**
	 * this is root user account for development only
	 * 
	 * @return Root user
	 */
	public static final User createTestUser() {
		User user = new User("tester", "", "tester", "", 666);
		user.setActivationKey("");
		user.setStatus(STATUS_ACTIVE);
		user.setRole(ROLE_STANDARD_USER);
		return user;
	}

	public User(String userLogin, String userPass, String displayName, String userEmail, long networkId) {
		super();
		this.userLogin = userLogin;
		this.userPass = Encryptor.passwordHash(userLogin, userPass);
		this.displayName = displayName;
		this.userEmail = userEmail;
		this.networkId = networkId;
	}

	public static final String COLLECTION_NAME = User.class.getSimpleName().toLowerCase();
	static ArangoCollection instance;

	@Override
	public ArangoCollection getCollection() {
		if (instance == null) {
			ArangoDatabase arangoDatabase = ArangoDbUtil.getActiveArangoDbInstance();

			instance = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields
			instance.ensurePersistentIndex(Arrays.asList("userEmail"), new PersistentIndexOptions().unique(true));
			instance.ensurePersistentIndex(Arrays.asList("userLogin"), new PersistentIndexOptions().unique(true));
			instance.ensureHashIndex(Arrays.asList("networkId"), new HashIndexOptions());
			instance.ensureHashIndex(Arrays.asList("customData[*]"), new HashIndexOptions());
		}
		return instance;
	}

	@Override
	public boolean isReadyForSave() {
		return StringUtil.isNotEmpty(userEmail) && StringUtil.isNotEmpty(userLogin)
				&& StringUtil.isNotEmpty(userPass) && StringUtil.isNotEmpty(this.displayName);
	}

	public String getUserLogin() {
		return userLogin;
	}

	public void setUserLogin(String userLogin) {
		this.userLogin = userLogin;
	}

	public String getUserPass() {
		return userPass;
	}

	public void setUserPass(String userPass) {
		this.userPass = Encryptor.passwordHash(userLogin, userPass);;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public String getAvatarUrl() {
		return avatarUrl;
	}

	public void setAvatarUrl(String avatarUrl) {
		this.avatarUrl = avatarUrl;
	}

	public long getRegisteredTime() {
		return registeredTime;
	}

	public void setRegisteredTime(long registeredTime) {
		this.registeredTime = registeredTime;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
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

	public String getActivationKey() {
		return activationKey;
	}

	public void setActivationKey(String activationKey) {
		this.activationKey = activationKey;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public int getRole() {
		return role;
	}

	public void setRole(int role) {
		this.role = role;
	}

	public boolean isOnline() {
		return isOnline;
	}

	public void setOnline(boolean isOnline) {
		this.isOnline = isOnline;
	}

	public List<AppMetadata> getSubscribedNetworks() {
		return subscribedNetworks;
	}

	public void setSubscribedNetworks(List<AppMetadata> subscribedNetworks) {
		this.subscribedNetworks = subscribedNetworks;
	}

	public List<Category> getSubscribedCategories() {
		return subscribedCategories;
	}

	public void setSubscribedCategories(List<Category> subscribedCategories) {
		this.subscribedCategories = subscribedCategories;
	}

	public List<Page> getSubscribedPages() {
		return subscribedPages;
	}

	public void setSubscribedPages(List<Page> subscribedPages) {
		this.subscribedPages = subscribedPages;
	}

	public List<Post> getSubscribedPosts() {
		return subscribedPosts;
	}

	public void setSubscribedPosts(List<Post> subscribedPosts) {
		this.subscribedPosts = subscribedPosts;
	}

	public Map<String, String> getCustomData() {
		return customData;
	}

	public void setCustomData(Map<String, String> customData) {
		this.customData = customData;
	}

	public void addCustomData(String key, String value) {
		this.customData.put(key, value);
	}

	public long getNetworkId() {
		return networkId;
	}

	public void setNetworkId(long networkId) {
		this.networkId = networkId;
	}

	public String getEncryptionKey() {
		if (encryptionKey == null) {
			encryptionKey = "";
		}
		return encryptionKey;
	}

	public void setEncryptionKey(String encryptionKey) {
		this.encryptionKey = encryptionKey;
	}

	@Override
	public String toString() {
		return this.getUserLogin() + " " + this.getKey();
	}

}
