package leotech.cdp.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.devskiller.friendly_id.FriendlyId;

import leotech.cdp.model.Profile;
import leotech.cdp.model.Touchpoint;
import leotech.cms.model.Page;
import leotech.cms.model.Post;
import leotech.core.config.AqlTemplate;
import leotech.system.util.database.ArangoDbQuery;
import leotech.system.util.database.ArangoDbUtil;

public class TouchpointDaoUtil {

   
    static final String AQL_GET_PROFILE_BY_ID = AqlTemplate.get("AQL_GET_PROFILE_BY_ID");
    private static final String AQL_FIND_KEY_AQL = ArangoDbUtil.contentFindKeyAql(Touchpoint.COLLECTION_NAME);

    public static String save(Touchpoint tp) {
   	if (tp.isReadyForSave() ) {
   	    ArangoCollection col = tp.getCollection();
   	    if (col != null) {
   		String id = tp.getId();
   		String _key = ArangoDbUtil.findKey(AQL_FIND_KEY_AQL, "id", id);
   		if (_key == null) {
   		    col.insertDocument(tp);
   		} else {
   		    tp.setUpdatedAt(new Date());
   		    col.updateDocument(_key, tp);
   		}
   		return id;
   	    }
   	}
   	return "";
       }

    public static Profile getById(String id) {
	ArangoDatabase db = ArangoDbUtil.getArangoDatabase();
	Map<String, Object> bindVars = new HashMap<>(1);
	bindVars.put("id", id);
	Profile p = new ArangoDbQuery<Profile>(db, AQL_GET_PROFILE_BY_ID, bindVars, Profile.class).getResultsAsObject();
	return p;
    }

}
