package Database;

import java.sql.Connection;
import java.sql.DriverManager;

public class Database {
    String jdbcUrl = "jdbc:mysql:///drakonas?cloudSqlInstance=intrepid-alloy-448022-p1:us-central1:drakonas-db&socketFactory=com.google.cloud.sql.mysql.SocketFactory"
            + "&user=admin"
            + "&password=}B3_E2T.LcK<|nCR";
    private static final String URL = System.getenv("DB_URL");
    private static final String USER = System.getenv("DB_USER");
    private static final String PASSWORD = System.getenv("DB_PASSWORD");

    public static Connection connect() throws Exception {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}