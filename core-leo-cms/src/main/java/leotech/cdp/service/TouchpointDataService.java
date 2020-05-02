package leotech.cdp.service;

import leotech.cdp.dao.TouchpointDaoUtil;
import leotech.cdp.model.Touchpoint;

public class TouchpointDataService {
    
    public static String getTouchpointIdFromWebsite(String mediaHost, String touchpointUrl) {
	Touchpoint tp = new Touchpoint(mediaHost, Touchpoint.TouchpointType.WEBSITE, touchpointUrl);
	
	//TODO run in a thread
	String id = TouchpointDaoUtil.save(tp);
	return id;
    }

}
