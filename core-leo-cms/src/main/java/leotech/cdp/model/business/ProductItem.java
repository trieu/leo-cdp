package leotech.cdp.model.business;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.FulltextIndexOptions;
import com.arangodb.model.HashIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.Gson;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.CdpPersistentObject;
import leotech.system.util.database.ArangoDbUtil;
import rfx.core.util.StringUtil;

public class ProductItem extends CdpPersistentObject implements Serializable {

	private static final long serialVersionUID = -3618110544243923554L;
	
	public static final String COLLECTION_NAME = getCollectionName(ProductItem.class);
	static ArangoCollection instance;

	@DocumentField(Type.KEY)
	@Expose
	String id;
	
	// Stock Keeping Unit
	protected String sku;
	
	protected String name;
	protected String description;
	protected String image;

	protected double originalPrice;
	
	protected double salePrice;
	
	protected String priceCurrency;

	protected String fullUrl;
	protected String siteName;
	protected String siteDomain;

	protected String itemCondition;
	protected String availability;

	protected String brand;
	
	protected String sellerName;
	
	protected List<String> keywords = new ArrayList<>(20);
	protected List<String> categories = new ArrayList<>(10);
	protected List<String> promoCodes = new ArrayList<>(10);
	protected List<Double> promoPrices = new ArrayList<>(10);
	
	protected List<String> optionFields = new ArrayList<>(10);
	protected List<String> optionValues = new ArrayList<>(10);

	protected Date updatedAt;
	
	@Override
	public ArangoCollection getCollection() {
		if (instance == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

			instance = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup
			instance.ensureFulltextIndex(Arrays.asList("name"), new FulltextIndexOptions());
			instance.ensureFulltextIndex(Arrays.asList("brand"), new FulltextIndexOptions());
			instance.ensurePersistentIndex(Arrays.asList("sku"), new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("siteDomain"), new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("updatedAt", "availability"), new PersistentIndexOptions().unique(false));

			instance.ensurePersistentIndex(Arrays.asList("fullUrl"), new PersistentIndexOptions().unique(false));
			instance.ensureHashIndex(Arrays.asList("keywords[*]"), new HashIndexOptions());

		}
		return instance;
	}
	
	public ProductItem() {
		this.fullUrl = "";
	}
	
	public ProductItem(String fullUrl) {
		this.fullUrl = "";
		this.id = id(fullUrl);
	}
	
	public ProductItem(String fullUrl, String name, String siteDomain) {
		this.fullUrl = fullUrl;
		this.name = name;
		this.siteDomain = siteDomain;
		String keyHint = fullUrl +  name + siteDomain;
		this.id = id(keyHint);
	}

	public ProductItem(String fullUrl, String name, String siteDomain, String sku) {
		this.fullUrl = fullUrl;
		this.name = name;
		this.siteDomain = siteDomain;
		this.sku = sku;
		String keyHint = fullUrl +  name + siteDomain + sku;
		this.id = id(keyHint);
	}

	@Override
	public boolean isReadyForSave() {
		return StringUtil.isNotEmpty(this.name) && StringUtil.isNotEmpty(this.fullUrl) && StringUtil.isNotEmpty(this.id) && StringUtil.isNotEmpty(this.siteDomain);
	}
	public String getSku() {
		return sku;
	}
	public void setSku(String sku) {
		this.sku = sku;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public double getOriginalPrice() {
		return originalPrice;
	}
	public void setOriginalPrice(double originalPrice) {
		if(originalPrice > 0) {
			this.originalPrice = originalPrice;
		}
	}
	public void setOriginalPrice(String originalPrice) {
		this.originalPrice = StringUtil.safeParseDouble(originalPrice);
	}
	public double getSalePrice() {
		return salePrice;
	}
	
	public void setSalePrice(double salePrice) {
		this.salePrice = salePrice;
		
		if(this.originalPrice == 0) {
			this.originalPrice = this.salePrice ;
		}
	}
	public void setSalePrice(String salePrice) {
		this.salePrice = StringUtil.safeParseDouble(salePrice);
		
		// because originalPrice can not be zero if sale price is larger than zero
		if(this.originalPrice == 0) {
			this.originalPrice = this.salePrice ;
		}
	}

	public String getPriceCurrency() {
		return priceCurrency;
	}
	public void setPriceCurrency(String priceCurrency) {
		this.priceCurrency = priceCurrency;
	}
	public String getFullUrl() {
		return fullUrl;
	}
	public void setFullUrl(String fullUrl) {
		this.fullUrl = fullUrl;
	}
	public String getSiteName() {
		return siteName;
	}
	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}
	public String getSiteDomain() {
		return siteDomain;
	}
	public void setSiteDomain(String siteDomain) {
		this.siteDomain = siteDomain;
	}
	
	public String getBrand() {
		return brand;
	}
	public void setBrand(String brand) {
		this.brand = brand;
	}
	public List<String> getKeywords() {
		return keywords;
	}
	public void setKeywords(List<String> keywords) {
		this.keywords = keywords;
	}
	public List<String> getCategories() {
		return categories;
	}
	public void setCategories(List<String> categories) {
		this.categories = categories;
	}
	public List<String> getPromoCodes() {
		return promoCodes;
	}
	public void setPromoCodes(List<String> promoCodes) {
		this.promoCodes = promoCodes;
	}
	
	public List<Double> getPromoPrices() {
		return promoPrices;
	}

	public void setPromoPrices(List<Double> promoPrices) {
		this.promoPrices = promoPrices;
	}
	
	public Date getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}
	
	public String getItemCondition() {
		return itemCondition;
	}

	public void setItemCondition(String itemCondition) {
		this.itemCondition = itemCondition;
	}

	public String getAvailability() {
		return availability;
	}

	public void setAvailability(String availability) {
		this.availability = availability;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	public boolean isEmpty() {
		return StringUtil.isEmpty(this.id);
	}

	@Override
	public String toString() {
		return new Gson().toJson(this);
	}
	
	public String getSellerName() {
		return sellerName;
	}
	
	public void setSellerName(String sellerName) {
		this.sellerName = sellerName;
	}
	
	public List<String> getOptionFields() {
		return optionFields;
	}

	public void setOptionFields(List<String> otherOptionFields) {
		this.optionFields = otherOptionFields;
	}
	
	public List<String> getOptionValues() {
		return optionValues;
	}

	public void setOptionValues(List<String> otherOptionValues) {
		this.optionValues = otherOptionValues;
	}
}
