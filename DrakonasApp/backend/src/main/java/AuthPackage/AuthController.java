package AuthPackage;
import org.mindrot.jbcrypt.BCrypt;
import Database.Database;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.*;

import static spark.Spark.*;

public class AuthController {

    public static void register() {


        post("/api/signup", (req, res) -> {

            String name=req.queryParams("name");
            String email=req.queryParams("email");
            String username = req.queryParams("username");
            String password = req.queryParams("password");

            if (username == null || password == null) {
                res.status(400);
                return "Missing fields";
            }

            String hashed = BCrypt.hashpw(password, BCrypt.gensalt());

            try (Connection conn = Database.connect();
                 var stmt = conn.prepareStatement(
                         "INSERT INTO users(user_name,user_email,user_username, user_password) VALUES (?,?,?,?)")) {

                stmt.setString(1,name);
                stmt.setString(2,email);
                stmt.setString(3, username);
                stmt.setString(4, hashed);
                stmt.executeUpdate();

                return "User created";

            } catch (Exception e) {
                e.printStackTrace();
                res.status(500);
                return "Registration failed"+username+" "+name+" "+password+" "+email;
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
                 var stmt = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY)) {

                ResultSet rs = stmt.executeQuery("SELECT user_password FROM users WHERE user_username = '" + username + "'");

                if (rs.next()){
                    String storedPassword=rs.getString("user_password");
                    if (BCrypt.checkpw(password,storedPassword)){
                        return "Successful Login";
                    }
                    else{
                        res.status(401);
                        return "Incorrect Password";
                    }
                }

                res.status(401);
                return "Incorrect Username";


            } catch (Exception e) {
                System.out.println(e.getMessage());
                e.printStackTrace();
                res.status(500);
                return "Login failed";
            }

        });
    }
}