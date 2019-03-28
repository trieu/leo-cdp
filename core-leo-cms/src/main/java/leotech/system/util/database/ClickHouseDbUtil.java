package leotech.system.util.database;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

import ru.yandex.clickhouse.BalancedClickhouseDataSource;
import ru.yandex.clickhouse.settings.ClickHouseProperties;

public class ClickHouseDbUtil {

    private static final int TIME_TO_CHECK_NODE_ALIVE = 15;
    private static ClickHouseDbUtil dataSource;
    private static BalancedClickhouseDataSource multipleClickHouseDataSource;
    private static final String CONFIGS_PATH = "configs/sql-host-configs.properties";

    private ClickHouseDbUtil() {
	System.out.println("Create new singleton");
	InputStream input = null;
	try {
	    Properties prop = new Properties();
	    input = new FileInputStream(CONFIGS_PATH);
	    // load a properties file
	    prop.load(input);
	    ClickHouseProperties properties = new ClickHouseProperties(prop);
	    properties.setDatabase(prop.getProperty("database"));
	    multipleClickHouseDataSource = new BalancedClickhouseDataSource(prop.getProperty("url"), properties);

	    // Check datasource is alive or death
	    multipleClickHouseDataSource.scheduleActualization(TIME_TO_CHECK_NODE_ALIVE, TimeUnit.MINUTES);

	} catch (FileNotFoundException e) {
	    e.printStackTrace();
	} catch (IOException e) {
	    e.printStackTrace();
	} finally {
	    if (input != null) {
		try {
		    input.close();
		} catch (IOException e) {
		    System.out.println(e.getMessage());
		}
	    }
	}
    }

    public static ClickHouseDbUtil getInstance() {
	if (dataSource == null)
	    dataSource = new ClickHouseDbUtil();
	return dataSource;
    }

    public Connection getConnection() {
	Connection con = null;
	try {
	    con = multipleClickHouseDataSource.getConnection();
	} catch (SQLException e) {
	    e.printStackTrace();
	}
	return con;
    }
}
