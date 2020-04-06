package leotech.cdp.model;

/*id = PrimaryKey(str, 32)
createdAt = Required(datetime, index='cvsion_time_idx')
trackerId = Required(str, 32, index='cvsion_tracker_idx')
metricName = Required(str, 42, index='cvsion_metric_idx')
refTrackedEventId = Required(str, 32, index='cvsion_event_idx')
refTouchpointId = Required(str, 32, index='cvsion_context_idx')
refPostId = Required(str, 32, index='cvsion_post_idx')
refChannelId = Required(str, 32, index='cvsion_channel_idx')
refProfileId = Required(str, 32, index='cvsion_profile_idx')
refProfileType = Optional(int, size=8, default=0, unsigned=True)
refJourneyId = Optional(str, 32)
refJourneyStage = Optional(int, size=8, unsigned=True)
deviceId = Required(str, 36, index='cvsion_device_idx')
deviceName = Required(str, 100)
sourceIp = Required(str, 40)
timeSpent = Required(int, size=32, unsigned=True)
refCampaignId = Optional(str, 32, index='cvsion_campaign_idx')
transactionCode = Optional(str, 50, default='_', index='cvsion_transaction_idx')
transactionValue = Optional(float, default=0)
currencyCode = Optional(str, 10, default='_')
satisfactionScore = Optional(int, size=8, default=0, unsigned=True)
fraudScore = Optional(int, size=8, default=0, unsigned=True)
feedbackData = Optional(str, 1000)
partitionId = Optional(int, size=16, default=1)*/

public class ConversionEvent {

}
