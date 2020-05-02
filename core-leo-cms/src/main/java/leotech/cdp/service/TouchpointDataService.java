package leotech.cdp.service;

import leotech.cdp.dao.TouchpointDaoUtil;
import leotech.cdp.model.Touchpoint;

public class TouchpointDataService {
    
    public static String getTouchpointId(String name, int type, String touchpointUrl) {
	Touchpoint tp = new Touchpoint(name, type , touchpointUrl);
	
	//TODO run in a thread
	String id = TouchpointDaoUtil.save(tp);
	return id;
    }

}
