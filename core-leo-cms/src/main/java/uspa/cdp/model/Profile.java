package uspa.cdp.model;

import java.util.Arrays;
import java.util.List;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.HashIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.annotations.Expose;

import leotech.cms.model.common.PersistentArangoObject;
import leotech.system.util.database.ArangoDbUtil;


//class Profile(db.Entity):
//    id = PrimaryKey(str, 32)
//    created_at = Required(datetime)
//    collection_id = Required(str, 32, index='profile_collection_idx')
//    root_profile_id = Optional(str, 32, index='profile_root_idx')
//    in_segments = Optional(Json, index='profile_segments_idx')
//    in_journey_maps = Optional(Json)
//    status = Optional(int, size=8, default=1, unsigned=True)
//    type = Optional(int, size=8, default=0, unsigned=True, index='profile_type_idx')
//    tracker_id = Optional(str, 32, index='profile_tracker_idx')
//    last_seen_channel_id = Optional(str, 32, index='profile_last_media_idx')
//    last_seen_context_id = Optional(str, 32, index='profile_last_context_idx')
//    last_seen_ip = Optional(str, 40, index='profile_last_ip_idx')
//    seen_context_ids = Optional(Json, index='profile_contexts_idx')
//    gender_score = Optional(int, default=50, unsigned=True)
//    age_group = Optional(int, size=8, default=0, unsigned=True)
//    working_info = Optional(str, 100)
//    avatar_url = Optional(str, 100, index='profile_avatar_idx')
//    media_interests = Optional(Json)
//    personal_attributes = Optional(Json)
//    social_media_profiles = Optional(Json)
//    personal_contacts = Optional(Json)
//    personal_interests = Optional(Json)
//    subscribed_channels = Optional(Json)
//    credit_score = Optional(int, size=32, default=0)
//    cx_score = Optional(int, size=32, default=0)
//    total_cac = Optional(int, size=64)
//    total_clv = Optional(int, size=64)
//    updated_at = Optional(datetime)
//    merged_profile_log = Optional(str, 200)
//    actor_uri = Optional(str, 100, unique=True, index='profile_actor_idx')
//    partition_id = Optional(int, size=16, default=1)


public class Profile implements PersistentArangoObject, Comparable<Profile> {

    public static final String COLLECTION_NAME = Profile.class.getSimpleName().toLowerCase();
    static ArangoCollection instance;
    
    @DocumentField(Type.KEY)
    @Expose
    private String key;
    
    @Expose
    String collectionId;
    
    // the main key after Identity Resolution 
    @Expose
    String rootProfileId;
    
    @Expose
    List<String> inSegments;
    
    @Expose
    List<String> inJourneyMaps;
    
    int status;
    
    
    
    

    @Override
    public ArangoCollection getCollection() {
	if (instance == null) {
	    ArangoDatabase arangoDatabase = ArangoDbUtil.getArangoDatabase();

	    instance = arangoDatabase.collection(COLLECTION_NAME);

	    // ensure indexing key fields
	    instance.ensurePersistentIndex(Arrays.asList("userEmail"), new PersistentIndexOptions().unique(true));
	    instance.ensurePersistentIndex(Arrays.asList("userLogin"), new PersistentIndexOptions().unique(true));
	    instance.ensureHashIndex(Arrays.asList("networkId"), new HashIndexOptions());
	    instance.ensureHashIndex(Arrays.asList("customData[*]"), new HashIndexOptions());
	}
	return instance;
    }

    @Override
    public int compareTo(Profile o) {
	// TODO Auto-generated method stub
	return 0;
    }

    @Override
    public boolean isReadyForSave() {
	// TODO Auto-generated method stub
	return false;
    }

}
