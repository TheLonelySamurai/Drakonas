package org.example;

import static spark.Spark.*;

import AuthPackage.AuthController;
import Database.Database;
import UserPackage.UserController;
import com.google.gson.Gson;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class Main {
    // A simple thread-safe map to hold user data by Session ID
    public static Map<String, Object> manualSessions = new ConcurrentHashMap<>();

    public static void main(String[] args) throws Exception {

        port(38451);

        before((req, res) -> {
            // Replace * with your actual Electron origin if possible (e.g., http://localhost:3000)
            res.header("Access-Control-Allow-Origin", "http://localhost:3000");
            res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
            res.header("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With");
            res.header("Access-Control-Allow-Credentials", "true"); // CRITICAL for sessions
        });

        options("/*", (req, res) -> {
            String accessControlRequestHeaders = req.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                res.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }
            String accessControlRequestMethod = req.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                res.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }
            return "OK";
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
        UserController.retrieve();
        after((req, res) -> {
            // Only modify the cookie if a session exists
            if (req.session(false) != null) {
                String sessionId = req.session().id();
                // Overwrite the header to ensure there is only ONE clean version
                res.header("Set-Cookie", "JSESSIONID=" + sessionId + "; Path=/; HttpOnly; SameSite=Lax");
            }
        });

    }

}