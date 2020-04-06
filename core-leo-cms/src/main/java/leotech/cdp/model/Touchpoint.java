package leotech.cdp.model;

/*id = PrimaryKey(str, 32)
name = Required(str, 250)
type = Required(int, size=8, unsigned=True, index='touchpoint_type_idx')
isMediaSrc = Required(bool, index='touchpoint_media_src_idx')
createdAt = Required(datetime)
status = Optional(int, size=8, default=1, unsigned=True)
url = Optional(str, 1000, default='_', index='touchpoint_url_idx')
thumbnailUrl = Optional(str, 500, default='_')
countryCode = Optional(str, 5, default='_', index='touchpoint_country_idx')
locationCode = Optional(str, 50, default='_', index='touchpoint_loccode_idx')
address = Optional(str, 1000, default='_')
latitude = Optional(float, default=0)
longitude = Optional(float, default=0)
radius = Optional(float, default=0)
reachableArea = Optional(float, default="-1")
keywords = Optional(str)
collectionId = Optional(str, 32, index='touchpoint_collection_id_idx')
parentId = Optional(str, 32, index='touchpoint_parent_idx')
unit_cost = Optional(int, size=64)
updatedAt = Optional(datetime)
partitionId = Optional(int, size=16, default=1)*/

public class Touchpoint {

    public static final class TouchpointType {
	public static final int ECOMMERCE_PLATFORM = 1;
	public static final int WEBSITE = 2;
	public static final int MOBILE_APP = 3;
	public static final int SMART_TV_APP = 4;
	public static final int IOT_APP = 5;
	public static final int OTT_APP = 6;
	public static final int SOCIAL_MEDIA_PLATFORM = 7;
	
	public static final int SHOPPING_MALL = 8;
	public static final int URBAN_MARKET = 9;
	public static final int RETAIL_STORE = 10;
	public static final int COFFEE_SHOP = 11;
	public static final int CONFERENCE_HALL = 12;
	public static final int URBAN_PARK = 13;
	public static final int OFFICE_BUILDING = 14;
	public static final int EXPERIENCE_SPACE = 15;
	public static final int OUTDOOR_PR_EVENT = 16;
	public static final int TRADITIONAL_TV = 17;
	public static final int BILLBOARD_OUTDOOR = 18;
	public static final int BILLBOARD_INDOOR = 19;
	public static final int TRANSIT_MEDIA = 20;
	public static final int SPORTING_EVENT = 21;
	
	public static final int KEY_OPINION_LEADER = 22;
    }
}
