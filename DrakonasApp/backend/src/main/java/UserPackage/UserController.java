package UserPackage;
import com.google.gson.Gson;
import org.mindrot.jbcrypt.BCrypt;
import Database.Database;

import java.sql.Array;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.*;

import static spark.Spark.*;
public class UserController {
    public static void retrieve(){

        get ("/api/retrieve-user", (req, res ) ->{
            res.type("application/json");
            req.session(true);
            var user = req.session().attribute("user");
            return new Gson().toJson(user);
        });
    }
}
