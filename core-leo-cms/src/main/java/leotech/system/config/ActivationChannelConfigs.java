package leotech.system.config;

import java.util.HashMap;

import com.google.gson.Gson;

import rfx.core.util.FileUtils;

/**
 * Activation Channel Configuration
 * 
 * @author tantrieuf31
 * @since 2020
 *
 */
public class ActivationChannelConfigs {

	public static final String MARKETING_EMAIL_SERVICE = "marketing_email_service";
	public static final String SYSTEM_EMAIL_SERVICE = "system_email_service";
	public static final String PUSH_NOTIFICATION_SERVICE = "push_notification_service";
	public static final String MOBILE_GATEWAY_SMS_SERVICE = "mobile_gateway_sms_service";
	
	public static final String FILE_ACTIVATION_CHANNEL_CONFIGS_JSON = "./configs/activation-channel-configs.json";
	
	HashMap<String, String> configs;
	
	protected ActivationChannelConfigs() {
	}
	
	public HashMap<String, String> getConfigs() {
		return configs;
	}
	
	public String getValue(String name) {
		if(configs != null) {
			return configs.getOrDefault(name, "");
		}
		return "";
	}
	
	@Override
	public String toString() {
		if(configs != null) {
			return new Gson().toJson(configs);
		}
		return "configs is NULL";
	}

	public static final class ActivationChannelConfigsMap {

		private HashMap<String, ActivationChannelConfigs> map;

		public ActivationChannelConfigsMap() {
		}

		public HashMap<String, ActivationChannelConfigs> getMap() {
			if (map == null) {
				map = new HashMap<String, ActivationChannelConfigs>(0);
			}
			return map;
		}

		public void setMap(HashMap<String, ActivationChannelConfigs> map) {
			this.map = map;
		}
	}

	static ActivationChannelConfigsMap map = null;

	public static ActivationChannelConfigs load(String configKey) {
		try {
			if (map == null) {
				String json = FileUtils.readFileAsString(FILE_ACTIVATION_CHANNEL_CONFIGS_JSON);
				map = new Gson().fromJson(json, ActivationChannelConfigsMap.class);
			}
			ActivationChannelConfigs configs = map.getMap().get(configKey);
			return configs;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public static ActivationChannelConfigs loadSystemEmailServiceConfig() {
		return load(SYSTEM_EMAIL_SERVICE);
	}
	
	public static ActivationChannelConfigs loadMarketingEmailServiceConfig() {
		return load(MARKETING_EMAIL_SERVICE);
	}
	
	public static ActivationChannelConfigs loadPushNoticationServiceConfig() {
		return load(PUSH_NOTIFICATION_SERVICE);
	}
	
	public static ActivationChannelConfigs loadMobileGatewaySmsServiceConfig() {
		return load(MOBILE_GATEWAY_SMS_SERVICE);
	}
	
}
