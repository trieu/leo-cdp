package leotech.cdp.job.reactive;

import leotech.cdp.dao.singleview.ProfileSingleDataView;

public abstract class ReactiveProfileDataJob {
	
	protected static final int BATCH_PROCESSING_SIZE = 200;
	protected static final int TIME_TO_PROCESS = 9000;//milisecs

	abstract protected void initTimer();
	
	abstract protected void doReactiveJob(ProfileSingleDataView profile);
	
	abstract public void enque(ProfileSingleDataView profile);
}
