package leotech.system.activation;

import leotech.system.config.ActivationChannelConfigs;

public class MobileSmsSender {

	static ActivationChannelConfigs configs = ActivationChannelConfigs.loadMobileGatewaySmsServiceConfig();
	static final String AuthorizationHeader = configs.getValue("Authorization");
	
	 
}
