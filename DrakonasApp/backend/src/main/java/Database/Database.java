package Database;

import java.sql.Connection;
import java.sql.DriverManager;

public class Database {

    private static final String URL = System.getenv("DRAKONAS_DB_URL");
    private static final String USER = System.getenv("DRAKONAS_DB_USER");
    private static final String PASSWORD = System.getenv("DRAKONAS_DB_PASSWORD");

    public static Connection connect() throws Exception {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}