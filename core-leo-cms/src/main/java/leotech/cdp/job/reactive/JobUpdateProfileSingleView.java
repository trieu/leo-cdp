package leotech.cdp.job.reactive;

import java.util.Queue;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ConcurrentLinkedQueue;

import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.service.ProfileDataService;

/**
 * single-view processing reactive job (triggered by external event)
 * 
 * @author tantrieuf31
 * @since 2020
 *
 */
public class JobUpdateProfileSingleView extends ReactiveProfileDataJob {

	private static Queue<ProfileSingleDataView> queueProfiles = new ConcurrentLinkedQueue<>();
	private static volatile JobUpdateProfileSingleView instance = null;
	private static Timer timer = null;
	
	public static JobUpdateProfileSingleView job() {
		if(instance == null) {
			instance = new JobUpdateProfileSingleView();
		}
		return instance;
	}

	protected JobUpdateProfileSingleView() {
		initTimer();
	}
	
	@Override
	protected void initTimer() {
		if(timer == null) {
			timer = new Timer(true);
			timer.schedule(new TimerTask() {
				@Override
				public void run() {
					for (int i = 0; i < BATCH_PROCESSING_SIZE; i++) {
						ProfileSingleDataView profile = queueProfiles.poll();
						if (profile == null) {
							break;
						} 
						else {
							try {
								doReactiveJob(profile);
							} catch (Exception e) {
								e.printStackTrace();
							}
						}
					}
				}
			}, TIME_TO_PROCESS, TIME_TO_PROCESS);	
		}
	}
	
	@Override
	protected void doReactiveJob(ProfileSingleDataView profile) {
		ProfileDataService.updateProfileSingleDataView(profile , false);
	}
	
	@Override
	public void enque(ProfileSingleDataView profile) {
		queueProfiles.add(profile);
	}
}
