package leotech.cdp.job.scheduled;

import java.util.List;

import leotech.cdp.dao.SegmentDaoUtil;
import leotech.cdp.model.customer.Segment;
import rfx.core.job.ScheduledJob;

public class SegmentDataCleaningJob  extends ScheduledJob {

	@Override
	public void doTheJob() {
		 List<Segment> segments = SegmentDaoUtil.getSegmentsToDeleteForever();
		 for (Segment segment : segments) {
			 boolean ok = SegmentDaoUtil.delete(segment);
			 System.out.println(ok + " Deleted " + segment.getName());
		}
	}

}
