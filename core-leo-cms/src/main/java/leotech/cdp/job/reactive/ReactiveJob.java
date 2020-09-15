package leotech.cdp.job.reactive;

public abstract class ReactiveJob {
	
	protected static final int TIME_TO_PROCESS = 8000;//milisecs

	abstract protected void initTimer();
	
	abstract protected void doReactiveJob(String input);
	
	abstract public ReactiveJob initAndGet();
	
	abstract public void enque(String input);
}
