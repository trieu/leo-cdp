  package uspa.cdp.model;

 /* id = PrimaryKey(str, 36)
  createdAt = Required(datetime, index='event_time_idx')
  sessionKey = Required(str, 32, index='event_session_key_idx')
  trackerId = Required(str, 32, index='event_tracker_idx')
  collectionId = Required(str, 32, index='event_collection_idx')
  metricName = Required(str, 42, index='event_metric_name_idx')
  metricValue = Required(int, size=64, default=1)
  refProfile_id = Required(str, 32, index='event_profile_idx')
  refProfileType = Optional(int, size=8, default=0, unsigned=True)
  srcTouchpointId = Required(str, 32, index='event_src_ctx_idx')
  refTouchpointId = Optional(str, 32, index='event_ref_ctx_idx')
  refChannelId = Optional(str, 32, index='event_channel_idx')
  refCampaignId = Optional(str, 32, index='event_campaign_idx')
  refPostId = Optional(str, 32, index='event_post_idx')
  refMessageId = Optional(str, 32, index='event_message_idx')
  refServiceId = Optional(str, 32, index='event_service_idx')
  refItemId = Optional(str, 32, index='event_product_idx')
  refSurveyId = Optional(str, 32, index='event_survey_idx')
  refJourneyId = Optional(str, 32)
  refJourneyStage = Optional(int, size=8, unsigned=True)
  timeSpent = Optional(int, size=32, default=0, unsigned=True)
  browserName = Optional(str, 100)
  webCookies = Optional(str, 1000)
  deviceId = Optional(str, 36, index='event_device_idx')
  deviceOS = Optional(str, 100)
  deviceName = Optional(str, 100)
  sourceIP = Optional(str, 40, index='event_ip_idx')
  feedbackData = Optional(str, 1000)
  partitionId = Optional(int, size=16, default=1)*/

public class TrackingEvent {

}
