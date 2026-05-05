package ProjectPackage;
import com.google.gson.Gson;
import org.mindrot.jbcrypt.BCrypt;
import Database.Database;

import javax.servlet.http.Part;
import java.io.File;
import javax.servlet.MultipartConfigElement;
import java.io.InputStream;
import java.sql.Array;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.*;
import java.util.HashMap;
import java.util.Map;
import static org.example.Main.manualSessions;
import static spark.Spark.*;
public class ProjectController {
    public static void projectHandler(){
        File uploadDir=new File("temp");
        uploadDir.mkdirs();
        post("/api/create_project",(req,res)->{
            System.out.println("Project Created");
            String project_name=req.queryParams("project_name");
            Part project_data=req.raw().getPart("project_data");
            try (InputStream inputStream = project_data.getInputStream()) {
                // Database Connection and BLOB Insertion
                try (Connection conn = Database.connect();
                     PreparedStatement pstmt = conn.prepareStatement("INSERT INTO projects (project_name, project_data) VALUES (?, ?)")) {
                    System.out.println("Info Stored");
                    pstmt.setString(1, project_name);
                    // Use setBinaryStream to efficiently handle large data
                    pstmt.setBinaryStream(2, inputStream);
                    pstmt.executeUpdate();
                }catch(Exception e){
                    e.printStackTrace();
                    res.status(500);
                    return "Failed Second Try";
                }
            }catch(Exception e){
                e.printStackTrace();
                res.status(500);
                return "Failed First Try";
            }
            return "File uploaded: " + project_name;
        });
    }
}
