package leotech.system.model;

import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;

public class SystemOption {
    
    @DocumentField(Type.KEY)
    private String key;

    long id;
    String name;
    String value;
    boolean autoload;
    
    public SystemOption(long id, String name, String value, boolean autoload) {
	super();
	this.id = id;
	this.name = name;
	this.value = value;
	this.autoload = autoload;
    }
    
    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getValue() {
        return value;
    }
    public void setValue(String value) {
        this.value = value;
    }
    public boolean isAutoload() {
        return autoload;
    }
    public void setAutoload(boolean autoload) {
        this.autoload = autoload;
    }
    
    
}
