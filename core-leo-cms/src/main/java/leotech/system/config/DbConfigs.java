package leotech.system.config;


import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import rfx.core.util.CommonUtil;
import rfx.core.util.FileUtils;
import rfx.core.util.StringPool;

import java.io.IOException;
import java.io.Serializable;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;


public class DbConfigs implements Serializable {

    private static final long serialVersionUID = 6185084071488833500L;

    public static final int MAX_CONNECTIONS = 100;
    public static final int MIN_CONNECTIONS = 2;
    public static final long MAX_WAIT = 15000;

    public final static String MY_SQL = "mysql";
    public final static String SQL_SERVER = "sqlserver";
    public final static String ORACLE = "oracle";

    public static class SqlDbConfigsMap {

        private HashMap<String, DbConfigs> map;

        public SqlDbConfigsMap() {
        }

        public HashMap<String, DbConfigs> getMap() {
            if (map == null) {
                map = new HashMap<String, DbConfigs>(0);
            }
            return map;
        }

        public void setMap(HashMap<String, DbConfigs> map) {
            this.map = map;
        }
    }

    String dbId = StringPool.BLANK;
    private String username;
    private String password;
    private String database;
    private String host;
    private int port;
    private String dbdriver;
    private String dbdriverclasspath;
    private boolean enabled = true;


    static final Map<String, DbConfigs> sqlDbConfigsCache = new HashMap<String, DbConfigs>(6);
    static final Map<String, Driver> driversCache = new HashMap<String, Driver>();
    static String sqlDbConfigsJson = null;

    public static DbConfigs load(String dbId) {
        return loadFromFile(CommonUtil.getSqlDbConfigFile(), dbId.trim());
    }

    public static DbConfigs loadConfigs(String sqlDbConfigsJson, String dbId) {
        String k = dbId;
        if (!sqlDbConfigsCache.containsKey(k)) {
            DbConfigs configs = null;
            try {
                SqlDbConfigsMap map = new Gson().fromJson(sqlDbConfigsJson, SqlDbConfigsMap.class);
                configs = map.getMap().get(dbId);
            } catch (Exception e) {
                e.printStackTrace();
            }
            if (configs == null) {
                throw new IllegalArgumentException("CAN NOT LOAD SqlDbConfigs from JSON: " + sqlDbConfigsJson);
            }
            configs.setDbId(dbId);
            sqlDbConfigsCache.put(k, configs);
        }
        return sqlDbConfigsCache.get(k);
    }

    public static DbConfigs loadFromFile(String filePath, String dbId) {
        String k = dbId;
        if (sqlDbConfigsJson == null) {
            try {
                sqlDbConfigsJson = FileUtils.readFileAsString(filePath);
            } catch (IOException e) {
                throw new IllegalArgumentException("File is not found at " + filePath);
            }
        }
        if (!sqlDbConfigsCache.containsKey(k)) {
            DbConfigs configs = null;
            try {
                SqlDbConfigsMap map = new Gson().fromJson(sqlDbConfigsJson, SqlDbConfigsMap.class);
                configs = map.getMap().get(dbId);
            } catch (Exception e) {
                if (e instanceof JsonSyntaxException) {
                    System.err.println("Wrong JSON syntax in file " + filePath);
                } else {
                    e.printStackTrace();
                }
            }
            if (configs == null) {
                throw new IllegalArgumentException("CAN NOT LOAD SqlDbConfigs dbId " + dbId + " from " + filePath);
            }
            configs.setDbId(dbId);
            sqlDbConfigsCache.put(k, configs);
        }
        return sqlDbConfigsCache.get(k);
    }


    public String getConnectionUrl() {
        StringBuilder s = new StringBuilder();
        if (MY_SQL.equals(this.getDbdriver())) {
            s.append("jdbc:").append(MY_SQL).append("://");
            s.append(this.getHost());
            s.append(":").append(getPort()).append("/");
            s.append(this.getDatabase());
            s.append("?autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&noAccessToProcedureBodies=true");
        } else if (SQL_SERVER.equals(this.getDbdriver())) {
            s.append("jdbc:").append(SQL_SERVER).append("://");
            s.append(this.getHost());
            s.append(";databaseName=");
            s.append(this.getDatabase());
        } else if (ORACLE.equals(this.getDbdriver())) {
            System.setProperty("java.security.egd", "file:///dev/urandom");
            //"jdbc:oracle:thin:@IP:PORT:ORADEV1"
            s.append("jdbc:").append(ORACLE).append(":thin:@");
            s.append(this.getHost());
            s.append(":").append(this.getPort()).append(":");
            s.append(this.getDatabase());
        } else {
            throw new IllegalArgumentException("Currently, only support JDBC driver for MySQL, MSSQL Server and Oracle!");
        }
        return s.toString();
    }

    public Connection getConnection() throws SQLException {
        Connection dbConnection = null;
        try {
            Driver driver = driversCache.get(getDbdriverclasspath());
            String connectionUrl = getConnectionUrl();
            if (driver == null) {
                driver = (Driver) Class.forName(getDbdriverclasspath()).newInstance();
                driversCache.put(getDbdriverclasspath(), driver);
                DriverManager.registerDriver(driver);
            }
            dbConnection = DriverManager.getConnection(connectionUrl, getUsername(), getPassword());
        } catch (ClassNotFoundException e) {
            throw new IllegalArgumentException("Missing JDBC driver jar for " + this.getDbdriverclasspath());
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }

        return dbConnection;
    }


    public DbConfigs() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getDbdriver() {
        return dbdriver;
    }

    public void setDbdriver(String dbdriver) {
        this.dbdriver = dbdriver;
    }

    public String getDbdriverclasspath() {
        return dbdriverclasspath;
    }

    public void setDbdriverclasspath(String dbdriverclasspath) {
        this.dbdriverclasspath = dbdriverclasspath;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public String getDbId() {
        return dbId;
    }

    public void setDbId(String dbId) {
        this.dbId = dbId;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }


    @Override
    public String toString() {
        StringBuilder s = new StringBuilder();
        s.append(" ,Dbdriver: ").append(getDbdriver());
        s.append(" ,Dbdriverclasspath: ").append(getDbdriverclasspath());
        s.append(" ,Host: ").append(getHost());
        s.append(" ,Database: ").append(getDatabase());
        s.append(" ,Username: ").append(getUsername());
        s.append(" ,Password.length: ").append(getPassword().length());
        s.append(" ,ConnectionUrl: ").append(getConnectionUrl());
        return s.toString();
    }
}
