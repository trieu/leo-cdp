package leotech.cdp.model.customer;

public final class ProfileType {
	
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
	
	
}
