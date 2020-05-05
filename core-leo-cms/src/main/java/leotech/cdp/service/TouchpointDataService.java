package leotech.cdp.service;

import leotech.cdp.dao.TouchpointDaoUtil;
import leotech.cdp.model.Touchpoint;
import rfx.core.util.StringUtil;

public class TouchpointDataService {
	
	static final Touchpoint DIRECT_TRAFFIC_WEB = new Touchpoint("DIRECT_TRAFFIC_WEB", Touchpoint.TouchpointType.WEBSITE, "DIRECT_TRAFFIC_WEB");
	static {
		TouchpointDaoUtil.save(DIRECT_TRAFFIC_WEB);
	}

	public static Touchpoint getOrCreateWebTouchpoint(String name, int type, String touchpointUrl, boolean isOwnedMedia) {
		if (StringUtil.isNotEmpty(touchpointUrl)) {
			Touchpoint tp = TouchpointDaoUtil.getByUrl(touchpointUrl);
			if (tp == null) {
				tp = new Touchpoint(name, type, touchpointUrl);
				tp.setOwnedMedia(isOwnedMedia);
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
				tp = new Touchpoint(name, type, touchpointUrl);
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
				tp = new Touchpoint(type, touchpointUrl);
				// run in a threadpool
				TouchpointDaoUtil.save(tp);
			}
			return tp;
		}
		return DIRECT_TRAFFIC_WEB;
	}

}
