package leotech.cdp.service;

import leotech.cdp.dao.TouchpointDaoUtil;
import leotech.cdp.model.Touchpoint;

public class TouchpointDataService {
    

    public static Touchpoint getOrCreateDigitalTouchpoint(String name, int type, String touchpointUrl) {
	Touchpoint tp = TouchpointDaoUtil.getByUrl(touchpointUrl);
	if(tp == null) {
	    tp = new Touchpoint(name, type , touchpointUrl);
	    // run in a threadpool
	    TouchpointDaoUtil.save(tp);
	}
	return tp;
    }

}
