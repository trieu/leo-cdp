package leotech.system.util.database;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arangodb.ArangoCursor;
import com.arangodb.ArangoDBException;
import com.arangodb.ArangoDatabase;

/**
 * utility class For Database query data with ArangoDB
 * 
 * @author tantrieuf31
 * @since 2019
 *
 * @param <T>
 */
public class ArangoDbQuery<T> {

	public static abstract class CallbackQuery<T> {
		abstract public T apply(T obj);
	}

	ArangoDatabase arangoDatabase;
	String aql;
	Map<String, Object> bindVars;
	Class<T> type;
	CallbackQuery<T> callback = null;
	
	
	public ArangoDbQuery(ArangoDatabase db, String aql, Class<T> type) {
		setRequiredData(db, aql, new HashMap<>(0), type);
	}
	
	public ArangoDbQuery(ArangoDatabase db, String aql,  Map<String, Object> bindVars) {
		setRequiredData(db, aql, bindVars, null);
	}
	
	public ArangoDbQuery(ArangoDatabase db, String aql, Class<T> type, CallbackQuery<T> callback) {
		setRequiredData(db, aql, new HashMap<>(0), type);
		this.callback = callback;
	}

	public ArangoDbQuery(ArangoDatabase db, String aql, Map<String, Object> bindVars, Class<T> type) {
		setRequiredData(db, aql, bindVars, type);
	}

	public ArangoDbQuery(ArangoDatabase db, String aql, Map<String, Object> bindVars, Class<T> type, CallbackQuery<T> callback) {
		setRequiredData(db, aql, bindVars, type);
		this.callback = callback;
	}

	void setRequiredData(ArangoDatabase db, String aql, Map<String, Object> bindVars, Class<T> type) {
		this.arangoDatabase = db;
		this.aql = aql;
		this.bindVars = bindVars;
		this.type = type;
	}

	public List<T> getResultsAsList() {
		ArangoCursor<T> cursor = null;
		List<T> list = new ArrayList<>();
		try {
			cursor = arangoDatabase.query(aql, bindVars, null, type);
			while (cursor.hasNext()) {
				T obj = cursor.next();
				if (callback != null && obj != null) {
					callback.apply(obj);
				}
				list.add(obj);
			}
		} catch (ArangoDBException e) {
			// TODO error log
			e.printStackTrace();
		} finally {
			if (cursor != null) {
				try {
					cursor.close();
				} catch (IOException e) {
				}
			}
		}
		return list;
	}

	public T getResultsAsObject() {
		ArangoCursor<T> cursor = null;
		T obj = null;
		try {
			cursor = arangoDatabase.query(aql, bindVars, null, type);
			if (cursor.hasNext()) {
				obj = cursor.first();
				if (callback != null && obj != null) {
					obj = callback.apply(obj);
				}
			}
		} catch (ArangoDBException e) {
			// TODO error log
			e.printStackTrace();
		} finally {
			if (cursor != null) {
				try {
					cursor.close();
				} catch (IOException e) {
				}
			}
		}
		return obj;
	}
	
	public void update() {
		try {
			arangoDatabase.query(aql, bindVars, null);
		} catch (ArangoDBException e) {
			// TODO error log
			e.printStackTrace();
		} 
	}

}
