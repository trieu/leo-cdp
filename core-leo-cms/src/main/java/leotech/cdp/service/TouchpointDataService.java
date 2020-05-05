package leotech.cdp.service;

import leotech.cdp.dao.TouchpointDaoUtil;
import leotech.cdp.model.Touchpoint;
import rfx.core.util.StringUtil;

public class TouchpointDataService {

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
		throw new IllegalArgumentException("web touchpoint must have valid URL");
	}
	
	public static Touchpoint getOrCreateWebTouchpoint(int type, String touchpointUrl) {
		if (StringUtil.isNotEmpty(touchpointUrl)) {
			Touchpoint tp = TouchpointDaoUtil.getByUrl(touchpointUrl);
			if (tp == null) {
				tp = new Touchpoint(type, touchpointUrl);
				// run in a threadpool
				TouchpointDaoUtil.save(tp);
			}
			return tp;
		}
		throw new IllegalArgumentException("web touchpoint must have valid URL");
	}

}
