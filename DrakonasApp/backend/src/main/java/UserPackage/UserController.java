package UserPackage;

import java.io.File;
import java.io.InputStream;
import java.util.*;
import com.google.gson.Gson;
import org.example.Main;
import org.mindrot.jbcrypt.BCrypt;
import Database.Database;

import javax.servlet.http.Part;
import java.sql.Array;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.*;

import static spark.Spark.*;
public class UserController {
    public static void retrieve(){

        get("/api/retrieve-user", (req, res) -> {
            System.out.println("USER IS BEING REQUESTED");
            res.type("application/json");
            String manualId = req.headers("X-Session-ID");
            Object userData = null;

            // 1. Try to get user from the manual store using the header
            if (manualId != null) {
                userData = Main.manualSessions.get(manualId);
            }

            // 2. Fallback: Try the standard session (in case cookies actually worked)
            if (userData == null && req.session(false) != null) {
                userData = req.session().attribute("user");
            }

            // 3. Return result or 401
            if (userData == null) {
                res.status(401);
                return "null"; // Or new Gson().toJson(Map.of("error", "Unauthorized"))
            }

            return new Gson().toJson(userData);
        });
    }
}
