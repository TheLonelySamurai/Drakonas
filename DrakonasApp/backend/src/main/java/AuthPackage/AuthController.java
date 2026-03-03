package AuthPackage;
import org.mindrot.jbcrypt.BCrypt;
import Database.Database;
import java.sql.Connection;
import java.sql.Driver;

import static spark.Spark.*;

public class AuthController {

    public static void register() {


        post("/api/signup", (req, res) -> {

            String username = req.queryParams("username");
            String password = req.queryParams("password");

            if (username == null || password == null) {
                res.status(400);
                return "Missing fields";
            }

            String hashed = BCrypt.hashpw(password, BCrypt.gensalt());

            try (Connection conn = Database.connect();
                 var stmt = conn.prepareStatement(
                         "INSERT INTO users(username, password) VALUES (?, ?)")) {

                stmt.setString(1, username);
                stmt.setString(2, hashed);
                stmt.executeUpdate();

                return "User created";

            } catch (Exception e) {
                e.printStackTrace();
                res.status(500);
                return "Registration failed";
            }
        });
        post("/api/login", (req, res) ->{

            String username = req.queryParams("username");
            String password = req.queryParams("password");

            if (username == null || password == null){
                res.status(400);
                return "Missing fields";
            }

            try (Connection conn = Database.connect();
                 var stmt = conn.prepareStatement(
                         "SELECT password FROM users WHERE username == ?")) {
                stmt.setString(1, username);
                var rs = stmt.executeQuery();
                String storedPassword = rs.getString("password");
                if (rs.next()){
                    if (BCrypt.checkpw(password,storedPassword)){
                        return "Successful Login";
                    }
                }

                res.status(401);
                return "Incorrect Credentials";


            } catch (Exception e) {
                e.printStackTrace();
                res.status(500);
                return "Registration failed";
            }

        });
    }
}