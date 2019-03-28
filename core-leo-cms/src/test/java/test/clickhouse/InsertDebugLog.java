package test.clickhouse;

import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import ru.yandex.clickhouse.ClickHouseDataSource;

public class InsertDebugLog {

  
    private static final String DB_USER = "";
    private static final String DB_PASSWORD = "";
    private static final DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy-HH:mm:ss");

    public static void main(String[] argv) {

	try {
	    System.out.println("Record is inserted OK !");
	    for (int i = 0; i < 100; i++) {
		 insertRecordIntoDbUserTable();
	    }
	    System.out.println("Record is inserted OK !");

	} catch (SQLException e) {

	    System.out.println(e.getMessage());

	}

    }

    private static void insertRecordIntoDbUserTable() throws SQLException {
	java.util.Date today = new java.util.Date();
	Connection dbConnection = null;
	PreparedStatement statement = null;

	String insertTableSQL = "INSERT INTO debuglog(creationDate,formatedDate,`source`,`type`,log) VALUES (?,?,?,?,?)";

	try {
	    dbConnection = getDBConnection();
	    statement = dbConnection.prepareStatement(insertTableSQL);
	    statement.setDate(1, new Date(today.getTime()));
	    statement.setString(2, dateFormat.format(today));
	    statement.setString(3, "test");
	    statement.setInt(4, 1);
	    statement.setString(5, "test data");

	    // execute insert SQL stetement
	    statement.executeUpdate();

	    System.out.println("Record is inserted OK !");

	} catch (Exception e) {

	    System.out.println(e.getMessage());

	    e.printStackTrace();
	} finally {

	    if (statement != null) {
		statement.close();
	    }

	    if (dbConnection != null) {
		dbConnection.close();
	    }

	}

    }
    
    private static final String DB_DRIVER = "ru.yandex.clickhouse.ClickHouseDriver";
    private static final String DB_CONNECTION = "jdbc:clickhouse://61.28.231.67:8123/hd_ad_log";
    static ClickHouseDataSource dataSource = new ClickHouseDataSource(DB_CONNECTION);
    static {
	try {
	    Class.forName(DB_DRIVER);
	} catch (ClassNotFoundException e) {
	    System.out.println(e.getMessage());

	}
    }
    
    private static Connection getDBConnection() {
	Connection dbConnection = null;
	try {
	    dbConnection = dataSource.getConnection();
	    return dbConnection;
	} catch (SQLException e) {
	    System.out.println(e.getMessage());
	}
	return dbConnection;

    }

   

}
