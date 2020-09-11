package leotech.starter.router;

import java.util.List;

import io.vertx.core.MultiMap;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;
import leotech.ads.model.DisplayAdData;
import leotech.ads.service.AdsQueryService;
import leotech.cdp.handler.CdpAnalytics360Handler;
import leotech.cdp.handler.CdpCampaignHandler;
import leotech.cdp.handler.CdpFunnelHandler;
import leotech.cdp.handler.CdpJourneyMapHandler;
import leotech.cdp.handler.CdpMediaChannelHandler;
import leotech.cdp.handler.CdpObserverHandler;
import leotech.cdp.handler.CdpProfileHandler;
import leotech.cdp.handler.CdpSegmentHandler;
import leotech.cms.handler.admin.AdminSystemApiHandler;
import leotech.cms.handler.admin.LeoAssistantBotHandler;
import leotech.cms.handler.admin.CmsAdminCategoryHandler;
import leotech.cms.handler.admin.CmsAdminPageHandler;
import leotech.cms.handler.admin.CmsAdminPostApiHandler;
import leotech.cms.handler.admin.SystemUserApiHandler;
import leotech.system.common.BaseApiRouter;
import leotech.system.model.JsonDataPayload;

public class AdminApiRouter extends BaseApiRouter {
	
	public static final String CDP_JOURNEY_MAP_PREFIX = "/cdp/journeymap";
	public static final String CDP_PROFILE_PREFIX = "/cdp/profile";
	public static final String CDP_FUNNEL_PREFIX = "/cdp/funnel";
	public static final String CDP_OBSERVER_PREFIX = "/cdp/observer";
	public static final String CDP_SEGMENT_PREFIX = "/cdp/segment";
	public static final String CDP_MEDIA_CHANNEL_PREFIX = "/cdp/mediachannel";
	public static final String CDP_TOUCHPOINT_PREFIX = "/cdp/touchpoint";
	public static final String CDP_ANALYTICS_360_PREFIX = "/cdp/analytics360";
	public static final String CDP_CAMPAIGN_PREFIX = "/cdp/campaign";
	
	// Leo Ads System
	public static final String ADS_QUERY = "/ads/query";
	public static final String PLACEMENT_PARAM = "pms";

	public AdminApiRouter(RoutingContext context) {
		super(context);
	}

	public boolean handle() throws Exception {
		return this.handle(this.context);
	}

	@Override
	protected JsonDataPayload callHttpPostHandler(String userSession, String uri, JsonObject paramJson) {
		JsonDataPayload payload = null;
		try {
			
			//////// Core System Management ///////
			if (uri.startsWith(SYSTEM_USER_PREFIX)) {
				payload = new SystemUserApiHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			//
			else if (uri.startsWith(SYSTEM_PREFIX)) {
				payload = new AdminSystemApiHandler().httpPostApiHandler(userSession, uri, paramJson);
			} 
			//
			else if (uri.startsWith(LEO_ASSISTANT_BOT_PREFIX)) {
				payload = new LeoAssistantBotHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			
			//////// Customer Data Platform ///////
			//
			else if (uri.startsWith(CDP_ANALYTICS_360_PREFIX)) {
				payload = new CdpAnalytics360Handler().httpPostApiHandler(userSession, uri, paramJson);
			}
			//
			else if (uri.startsWith(CDP_FUNNEL_PREFIX)) {
				payload = new CdpFunnelHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			//
			else if(uri.startsWith(CDP_JOURNEY_MAP_PREFIX)) {
				payload = new CdpJourneyMapHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			//
			else if(uri.startsWith(CDP_MEDIA_CHANNEL_PREFIX)) {
				payload = new CdpMediaChannelHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			//
			else if(uri.startsWith(CDP_OBSERVER_PREFIX)) {
				payload = new CdpObserverHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			//
			else if (uri.startsWith(CDP_TOUCHPOINT_PREFIX)) {
				payload = new CdpProfileHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			//
			else if (uri.startsWith(CDP_PROFILE_PREFIX)) {
				payload = new CdpProfileHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			//
			else if (uri.startsWith(CDP_SEGMENT_PREFIX)) {
				payload = new CdpSegmentHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			//
			else if (uri.startsWith(CDP_CAMPAIGN_PREFIX)) {
				payload = new CdpCampaignHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			
			//////// Content Management System ///////
			//
			else if (uri.startsWith(CMS_CATEGORY_PREFIX)) {
				payload = new CmsAdminCategoryHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			//
			else if (uri.startsWith(CMS_PAGE_PREFIX)) {
				payload = new CmsAdminPageHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			//
			else if (uri.startsWith(CMS_POST_PREFIX)) {
				payload = new CmsAdminPostApiHandler().httpPostApiHandler(userSession, uri, paramJson);
			}
			
		} catch (Throwable e) {
			if (e instanceof IllegalArgumentException) {
				payload = JsonDataPayload.fail(e.getMessage(), 501);
			} else {
				e.printStackTrace();
				payload = JsonDataPayload.fail(e.getMessage(), 500);
			}
		}
		return payload;
	}

	@Override
	protected JsonDataPayload callHttpGetHandler(String userSession, String uri, MultiMap params) {
		JsonDataPayload payload = null;
		try {
			//////// Core System Management ///////
			if (uri.startsWith(SYSTEM_USER_PREFIX)) {
				payload = new SystemUserApiHandler().httpGetApiHandler(userSession, uri, params);
			}
			//
			else if (uri.startsWith(SYSTEM_PREFIX)) {
				payload = new AdminSystemApiHandler().httpGetApiHandler(userSession, uri, params);
			} 
			//
			else if (uri.startsWith(LEO_ASSISTANT_BOT_PREFIX)) {
				payload = new LeoAssistantBotHandler().httpGetApiHandler(userSession, uri, params);
			}
			
			//////// Customer Data Platform ///////
			//
			else if (uri.startsWith(CDP_ANALYTICS_360_PREFIX)) {
				payload = new CdpAnalytics360Handler().httpGetApiHandler(userSession, uri, params);
			}
			//
			else if (uri.startsWith(CDP_FUNNEL_PREFIX)) {
				payload = new CdpFunnelHandler().httpGetApiHandler(userSession, uri, params);
			}
			//
			else if(uri.startsWith(CDP_JOURNEY_MAP_PREFIX)) {
				payload = new CdpJourneyMapHandler().httpGetApiHandler(userSession, uri, params);
			}
			//
			else if(uri.startsWith(CDP_MEDIA_CHANNEL_PREFIX)) {
				payload = new CdpMediaChannelHandler().httpGetApiHandler(userSession, uri, params);
			}
			//
			else if(uri.startsWith(CDP_OBSERVER_PREFIX)) {
				payload = new CdpObserverHandler().httpGetApiHandler(userSession, uri, params);
			}
			//
			else if (uri.startsWith(CDP_TOUCHPOINT_PREFIX)) {
				payload = new CdpProfileHandler().httpGetApiHandler(userSession, uri, params);
			}
			//
			else if (uri.startsWith(CDP_PROFILE_PREFIX)) {
				payload = new CdpProfileHandler().httpGetApiHandler(userSession, uri, params);
			}
			//
			else if (uri.startsWith(CDP_SEGMENT_PREFIX)) {
				payload = new CdpSegmentHandler().httpGetApiHandler(userSession, uri, params);
			}
			//
			else if (uri.startsWith(CDP_CAMPAIGN_PREFIX)) {
				payload = new CdpCampaignHandler().httpGetApiHandler(userSession, uri, params);
			}
			
			//////// Content Management System ///////
			//
			else if (uri.startsWith(CMS_CATEGORY_PREFIX)) {
				payload = new CmsAdminCategoryHandler().httpGetApiHandler(userSession, uri, params);
			}
			//
			else if (uri.startsWith(CMS_PAGE_PREFIX)) {
				payload = new CmsAdminPageHandler().httpGetApiHandler(userSession, uri, params);
			}
			//
			else if (uri.startsWith(CMS_POST_PREFIX)) {
				payload = new CmsAdminPostApiHandler().httpGetApiHandler(userSession, uri, params);
			}
			//
			//////// Ads Server System ///////
			else if (uri.startsWith(ADS_QUERY)) {
				// TODO SSP Bid Request processing
				//AdBiddingHandler.handle(context);
				List<String> pmIds = params.getAll(PLACEMENT_PARAM);
				List<DisplayAdData> ads = AdsQueryService.getAds(pmIds);
				payload = JsonDataPayload.ok(uri, ads);
				payload.setReturnOnlyData(true);
			}
		} catch (Throwable e) {
			e.printStackTrace();
			payload = JsonDataPayload.fail(e.getMessage(), 500);
		}
		return payload;
	}

}
