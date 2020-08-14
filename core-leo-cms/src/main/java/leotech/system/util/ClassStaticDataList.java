package leotech.system.util;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.HashMap;
import java.util.Map;

import rfx.core.util.StringUtil;

public class ClassStaticDataList {
	
	public static Map<Integer, String> getIntegerMap(Class<?> clazz){
		Map<Integer, String> options = null;
		try {
			Field[] fields = clazz.getDeclaredFields();
			options = new HashMap<>(fields.length);
			for (Field f : fields) {
			    if (Modifier.isStatic(f.getModifiers())) {
			        String name = f.getName();
			        Object value = f.get(clazz);
			        options.put(StringUtil.safeParseInt(value), name);
			    }
			}
		}  catch (Exception e) {
			e.printStackTrace();
		}
		if(options == null) {
			return new HashMap<Integer, String>(0);
		}
		return options;
	}

	
}
