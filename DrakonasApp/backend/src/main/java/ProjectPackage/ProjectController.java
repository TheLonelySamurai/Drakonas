package ProjectPackage;
import com.google.gson.Gson;
import org.eclipse.jetty.util.ajax.JSON;
import org.mindrot.jbcrypt.BCrypt;
import Database.Database;

import javax.servlet.http.Part;
import java.io.File;
import javax.servlet.MultipartConfigElement;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
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
import com.fasterxml.jackson.databind.ObjectMapper; // Example JSON library
public class ProjectController {
    public static void projectHandler(){
        ObjectMapper objectMapper = new ObjectMapper();
        post("/api/create-project",(req,res) -> {
            System.out.println("Project Creating");
            String project_name=req.queryParams("project_name");
            String project_data= req.queryParams("project_data");
            System.out.println("Name: "+ project_name);
            System.out.println("Data: "+ project_data);
            byte[] jsonBytes = project_data.getBytes(StandardCharsets.UTF_8);
            try (Connection conn = Database.connect();
                 PreparedStatement pstmt = conn.prepareStatement("INSERT INTO projects (project_name, project_data, create_date, last_modified) VALUES (?, ?, NOW(), NOW())")) {
                System.out.println("Info Stored");
                pstmt.setString(1, project_name);
                // Use setBinaryStream to efficiently handle large data
                System.out.println("Using Binary Stream For JSON");
                pstmt.setBinaryStream(2, new java.io.ByteArrayInputStream(jsonBytes), jsonBytes.length);
                pstmt.executeUpdate();
            }catch(Exception e){
                e.printStackTrace();
                res.status(500);
                return "Failed Try";
            }
            try(Connection conn = Database.connect();
                var stmt = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY)){
                ResultSet rs = stmt.executeQuery("SELECT project_id, project_name, last_modified FROM projects ORDER BY last_modified DESC");
                if (rs.next()){
                    req.session(true);
                    Map<String, Object> projectSession = new HashMap<>();
                    projectSession.put("projectId", rs.getString("project_id"));
                    projectSession.put("projectName", rs.getString("project_name"));
                    projectSession.put("projectLastModified", rs.getString("last_modified"));
                    req.session().attribute("project", projectSession);
                }
            }
            return "File uploaded: " + project_name;
        });
    }
}
