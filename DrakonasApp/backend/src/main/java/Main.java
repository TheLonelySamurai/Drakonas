import static spark.Spark.*;

import AuthPackage.AuthController;
import Database.Database;
import com.google.gson.Gson;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class Main {

    public static void main(String[] args) throws Exception {

        port(38451);

        before((req, res) -> {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "*");
            res.header("Access-Control-Allow-Headers", "*");
        });
        get ("/api/test", (req, res ) ->{
            res.type("application/json");
            return new Gson().toJson("Backend Connected");
        });
        get("/api/dbtest", (req, res) -> {

            try (Connection conn = Database.connect();
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery("SELECT COUNT(*) AS total FROM users")) {

                if (rs.next()) {
                    return "Users in DB: " + rs.getInt("total");
                }

            } catch (Exception e) {
                e.printStackTrace();
                return "Database.Database error: " + e.getMessage();
            }

            return "No result";
        });
        AuthController.register();
    }

}