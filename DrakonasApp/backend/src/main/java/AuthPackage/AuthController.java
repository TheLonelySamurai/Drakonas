package AuthPackage;
import com.google.gson.Gson;
import org.mindrot.jbcrypt.BCrypt;
import Database.Database;

import java.sql.Array;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.*;
import java.util.HashMap;
import java.util.Map;

import static org.example.Main.manualSessions;
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
                 PreparedStatement pstmt = conn.prepareStatement("SELECT user_password, id, user_email FROM users WHERE user_username = ?")) {
                pstmt.setString(1, username);
                ResultSet rs = pstmt.executeQuery();

                if (rs.next()){
                    String storedPassword=rs.getString("user_password");
                    if (BCrypt.checkpw(password,storedPassword)){
                        req.session(true);

                        Map<String, Object> userSession = new HashMap<>();
                        userSession.put("userId", rs.getString("id"));
                        userSession.put("username", username);
                        userSession.put("email", rs.getString("user_email"));
                        req.session().attribute("user", userSession);
                        // Create a response that includes the ID
                        Map<String, Object> response = new HashMap<>(userSession);
                        response.put("sessionId", req.session().id()); // Send ID to Electron
//                        ResponseCookie cookie = ResponseCookie.from("JSESSIONID", sessionId)
//                                .httpOnly(true)
//                                .sameSite("None")   // allows cross-origin
//                                .secure(false)      // localhost doesn't need HTTPS
//                                .path("/")
//                                .build();
//                        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
                        manualSessions.put(req.session().id(), userSession);
                        res.header("Set-Cookie", "JSESSIONID=" + req.session().id() + "; Path=/; HttpOnly; SameSite=Lax");
                        System.out.println((req.session().attribute("user")).toString());
                        res.type("application/json");
                        return new Gson().toJson(response);
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