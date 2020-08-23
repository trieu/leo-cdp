package leotech.cdp.model.customer;

public class ProfileConstant {
	
	public final static String UNKNOWN = "unknown";
	// DMP
	public final static int TYPE_ANONYMOUS = 0;
	public final static int TYPE_IDENTIFIED = 1;
	public final static int TYPE_DMP_PROFILE = 2;
	public final static int TYPE_KOL_IN_NETWORK = 3;

	// CRM
	public final static int TYPE_CRM_CONTACT = 4;
	public final static int TYPE_KEY_ACCOUNT = 5;

	// Professional network
	public final static int TYPE_PARTNER = 6;
	public final static int TYPE_INTEGRATOR = 7;
	public final static int TYPE_COMPETITOR = 8;
	public final static int TYPE_GATEKEEPER = 9;
	
	// Social login
	public final static int TYPE_SOCIAL_LOGIN = 10;
	
	public final static String SCHEMA_TYPE_GENERAL = "general";
	
	// data schema type for direct service for human
	public final static String SCHEMA_TYPE_HEALTHCARE_SERVICE = "healthcare_service";
	public final static String SCHEMA_TYPE_EDUCATION_SERVICE = "education_service";
	public final static String SCHEMA_TYPE_HUMAN_RESOURCES_SERVICE = "human_resources_service";
	
	// data schema type for consumer
	public final static String SCHEMA_TYPE_ECOMMERCE_RETAIL_INDUSTRY = "ecommerce_retail_industry";
	public final static String SCHEMA_TYPE_FOOD_INDUSTRY = "food_industry";
	public final static String SCHEMA_TYPE_RETAIL_DISTRIBUTORS_INDUSTRY = "retail_distributors_industry";
	public final static String SCHEMA_TYPE_BANKING_INDUSTRY = "banking_industry";
	public final static String SCHEMA_TYPE_MEDIA_INDUSTRY = "media_industry";
	public final static String SCHEMA_TYPE_LOGISTICS_INDUSTRY = "logistics_industry";
	public final static String SCHEMA_TYPE_MANUFACTURING_INDUSTRY = "manufacturing_industry";
}
