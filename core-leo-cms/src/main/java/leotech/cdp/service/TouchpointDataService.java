package leotech.cdp.service;

import leotech.cdp.dao.TouchpointDaoUtil;
import leotech.cdp.model.marketing.MediaChannelType;
import leotech.cdp.model.marketing.Touchpoint;
import leotech.system.model.DataFilter;
import leotech.system.model.JsonDataTablePayload;
import leotech.system.util.UrlUtil;
import rfx.core.util.StringUtil;

public class TouchpointDataService {
	
	static final Touchpoint DIRECT_TRAFFIC_WEB = new Touchpoint("DIRECT_TRAFFIC_WEB", MediaChannelType.WEB_URL, "DIRECT_TRAFFIC_WEB");
	static {
		TouchpointDaoUtil.save(DIRECT_TRAFFIC_WEB);
	}
	
	static Touchpoint getOrCreateParentTouchpoint(int type, String touchpointUrl, boolean isOwnedMedia) {
		String hostname = UrlUtil.getHostName(touchpointUrl);
		Touchpoint tp = TouchpointDaoUtil.getByName(hostname);
		if(tp == null) {
			tp = new Touchpoint(hostname, MediaChannelType.WEBSITE, hostname);
			tp.setOwnedMedia(isOwnedMedia);
			TouchpointDaoUtil.save(tp);
		}
		return tp;
	}

	public static Touchpoint getOrCreateWebTouchpoint(String name, int type, String touchpointUrl, boolean isOwnedMedia) {
		if (StringUtil.isNotEmpty(touchpointUrl)) {
			Touchpoint tp = TouchpointDaoUtil.getByUrl(touchpointUrl);
			
			if (tp == null) {
				Touchpoint parent = getOrCreateParentTouchpoint(type, touchpointUrl, isOwnedMedia);
				
				tp = new Touchpoint(name, type, touchpointUrl);
				tp.setOwnedMedia(isOwnedMedia);
				tp.setParentId(parent.getId());
				
				// run in a threadpool
				TouchpointDaoUtil.save(tp);
			}
			return tp;
		}
		return DIRECT_TRAFFIC_WEB;
	}
	
	public static Touchpoint getOrCreateWebTouchpoint(String name, int type, String touchpointUrl) {
		if (StringUtil.isNotEmpty(touchpointUrl)) {
			Touchpoint tp = TouchpointDaoUtil.getByUrl(touchpointUrl);
			if (tp == null) {
				Touchpoint parent = getOrCreateParentTouchpoint(type, touchpointUrl, true);
				tp = new Touchpoint(name, type, touchpointUrl);
				tp.setParentId(parent.getId());
				// run in a threadpool
				TouchpointDaoUtil.save(tp);
			}
			return tp;
		}
		return DIRECT_TRAFFIC_WEB;
	}
	
	public static Touchpoint getOrCreateWebTouchpoint(int type, String touchpointUrl, boolean isOwnedMedia) {
		if (StringUtil.isNotEmpty(touchpointUrl)) {
			Touchpoint tp = TouchpointDaoUtil.getByUrl(touchpointUrl);
			if (tp == null) {
				Touchpoint parent = getOrCreateParentTouchpoint(type, touchpointUrl, isOwnedMedia);
				tp = new Touchpoint(type, touchpointUrl);
				tp.setParentId(parent.getId());
				// run in a threadpool
				TouchpointDaoUtil.save(tp);
			}
			return tp;
		}
		return DIRECT_TRAFFIC_WEB;
	}
	
	public static JsonDataTablePayload filter(DataFilter filter){
		JsonDataTablePayload rs  = TouchpointDaoUtil.filter(filter);
		//TODO caching
		return rs;
	}

}
