package leotech.cdp.model;

import java.util.Arrays;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.HashIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.Profile.ProfileType;
import leotech.cms.model.common.PersistentArangoObject;
import leotech.system.util.database.ArangoDbUtil;


//    size = Required(int, size=64, default=0)
//    query_template = Required(str)
//    query_parameter = Optional(Json)
//    attribution_model = Optional(Json)
//    is_public = Required(bool)
//    keywords = Optional(Json)
//    in_collection = Optional(Collection)
//    index_score = Optional(int, size=32, default=0, unsigned=True)
//    segmenter_uri = Optional(str, 100, unique=True, index='segmenter_idx')
//    ext_data = Optional(Json)
//    has_campaigns = Set('Campaign')
public class Segment extends UspaPersistentObject implements Comparable<Segment>{
    
    public static class SegmentationType {
	// https://learn.g2.com/market-segmentation
   	public final static int GEOGRAPHIC = 1;
   	public final static int DEMOGRAPHIC = 2;
   	public final static int PSYCHOGRAPHIC = 3;
   	public final static int BEHAVIORAL = 4;
   	
   	// common segment type for customer acquisition
   	public final static int FIRST_RETARGETING = 5;
   	public final static int LOOKALIKE = 6;
   	
   	// common segment type for customer retention
   	public final static int RFM_ANALYSIS = 7; // https://clevertap.com/blog/rfm-analysis/
   	public final static int CHURN = 8;
   	
   	public final static int AD_HOC_QUERY = 9;
    }

    public static final String COLLECTION_NAME = COLLECTION_PREFIX + Segment.class.getSimpleName().toLowerCase();
    static ArangoCollection instance;
    
    @Override
    public ArangoCollection getCollection() {
	if (instance == null) {
	    ArangoDatabase arangoDatabase = ArangoDbUtil.getArangoDatabase();

	    instance = arangoDatabase.collection(COLLECTION_NAME);

	    // ensure indexing key fields for fast lookup
	    instance.ensurePersistentIndex(Arrays.asList("primaryEmail"), new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("primaryPhone"), new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("primaryAvatar"), new PersistentIndexOptions().unique(false));
	    instance.ensurePersistentIndex(Arrays.asList("rootProfileId"), new PersistentIndexOptions().unique(false));
	    instance.ensureHashIndex(Arrays.asList("identityAttributes[*]"), new HashIndexOptions());
	    instance.ensureHashIndex(Arrays.asList("personaUri"), new HashIndexOptions());
	}
	return instance;
    }

    @DocumentField(Type.KEY)
    @Expose
    private String key;
    
    @Expose
    String name;

    @Expose
    int type = 0;
    
    @Expose
    int status = 0;
    
    @Expose
    long size = 0;
    
    @Expose
    String queryTemplate;
    
    

    @Override
    public int compareTo(Segment o) {
	// TODO Auto-generated method stub
	return 0;
    }

    @Override
    public boolean isReadyForSave() {
	// TODO Auto-generated method stub
	return false;
    }
    
}
