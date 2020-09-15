package leotech.cdp.job.reactive;

import java.util.Queue;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ConcurrentLinkedQueue;

import leotech.cdp.dao.ProfileDaoUtil;
import leotech.cdp.dao.singleview.ProfileSingleDataView;
import leotech.cdp.service.ProfileDataService;

public class JobUpdateProfileSingleView extends ReactiveJob {

	private static Queue<String> queueProfileIds = new ConcurrentLinkedQueue<>();
	private static volatile JobUpdateProfileSingleView instance = null;
	private static volatile Timer timer = null;

	protected JobUpdateProfileSingleView() {
		initTimer();
	}
	
	@Override
	protected void initTimer() {
		if(timer != null) {
			timer = new Timer(true);
			timer.schedule(new TimerTask() {
				@Override
				public void run() {
					for (int i = 0; i < 100; i++) {
						String input = queueProfileIds.poll();
						if (input == null) {
							break;
						} 
						else {
							try {
								doReactiveJob(input);
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
	protected void doReactiveJob(String input) {
		ProfileSingleDataView profile = ProfileDaoUtil.getSingleViewById(input);
		ProfileDataService.updateProfileSingleDataView(profile , false);
	}
	
	@Override
	public JobUpdateProfileSingleView initAndGet() {
		if(instance == null) {
			instance = new JobUpdateProfileSingleView();
		}
		return instance;
	}
	
	@Override
	public void enque(String input) {
		queueProfileIds.add(input);
	}
	
	
}
