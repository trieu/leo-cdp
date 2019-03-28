package leotech.system.util;

import java.util.Calendar;
import java.util.Date;

public class AdTimeUtil {
	public static boolean isPeakTime(){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		int hour = calendar.get(Calendar.HOUR_OF_DAY);		
		if( (hour >=18 && hour <=23) || (hour >=0 && hour<=3) ){
			return true;
		}
		return false;
	}
	
	public static boolean isInTigerEventLive(){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		int hour = calendar.get(Calendar.HOUR_OF_DAY);		
		if( hour >=18 && hour <=22 ){
			return true;
		}
		return false;
	}
	
	public static boolean isMidNight(){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		int hour = calendar.get(Calendar.HOUR_OF_DAY);		
		if(hour >=0 && hour <=7){
			return true;
		}
		return false;
	}
	
	
}
