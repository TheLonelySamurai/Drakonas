package ProjectPackage;
import com.google.gson.Gson;
import org.eclipse.jetty.util.ajax.JSON;
import org.example.Main;
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
import java.util.ArrayList;
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
                 PreparedStatement pstmt = conn.prepareStatement("INSERT INTO projects (project_name, project_data, create_date, last_modified) VALUES (?, ?, NOW(), NOW()) ")) {
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
                    // Create a response that includes the ID
                    Map<String, Object> response = new HashMap<>(projectSession);
                    response.put("sessionId", req.session().id());//Sends the ID to electron.
                    manualSessions.put(req.session().id(), projectSession);

                    res.header("Set-Cookie", "JSESSIONID=" + req.session().id() + "; Path=/; HttpOnly; SameSite=Lax");
                    res.type("application/json");
                    //Send the response that contains the ID as JSON
                    return new Gson().toJson(response);
                }
            }
            return "File uploaded: " + project_name;
        });
        //Gets the currently open project IF it is from the database or returns null. If null, the current project should not be currently within the database.
        get("/api/retrieve-current-project-info", (req, res) -> {
            System.out.println("CURRENT PROJECT IS BEING REQUESTED");
            res.type("application/json");
            String manualId = req.headers("X-Session-ID");
            Object projectData = null;

            // 1. Try to get user from the manual store using the header
            if (manualId != null) {
                projectData = Main.manualSessions.get(manualId);
            }

            // 2. Fallback: Try the standard session (in case cookies actually worked)
            if (projectData == null && req.session(false) != null) {
                projectData = req.session().attribute("project");
            }

            // 3. Return result or 401
            if (projectData == null) {
                res.status(401);
                return "null"; // Or new Gson().toJson(Map.of("error", "Unauthorized"))
            }

            return new Gson().toJson(projectData);
        });
        get("/api/load-project/:project_id",(req,res)->{
          String project_id = req.params(":project_id");
          System.out.println("Project_id = " + project_id);
          try(Connection conn = Database.connect();
              var stmt = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY)){
                  ResultSet rs = stmt.executeQuery("SELECT project_id, project_name, project_data, last_modified FROM projects WHERE project_id = "+project_id+" ");
                  System.out.println("Querying");
                  if(rs.next()){
                      System.out.println("In");
                      req.session(true);
                      Map<String, Object>projectSession=new HashMap<>();
                      projectSession.put("projectId",rs.getString("project_id"));
                      projectSession.put("projectName",rs.getString("project_name"));
                      projectSession.put("projectLastModified",rs.getString("last_modified"));
                      System.out.println("Project Data");
                      req.session().attribute("project",projectSession);
                      Map<String,Object> response=new HashMap<>(projectSession);
                      response.put("sessionId",req.session().id());
                      manualSessions.put(req.session().id(),projectSession);
                      System.out.println("With Manual Sessions");
                      res.header("Set-Cookie", "JSESSIONID=" + req.session().id() + "; Path=/; HttpOnly; SameSite=Lax");
                      res.type("application/json");
                      System.out.println("Configured");
                      byte[] bytes = rs.getBytes("project_data");
                      String jsonData=null;
                      if (bytes != null) {
                          jsonData = new String(bytes, StandardCharsets.UTF_8);
                      }
                      response.put("projectData",jsonData);
                      System.out.println("And sent project data");
                      return new Gson().toJson(response);
                  }
          } catch (Exception e) {
              e.printStackTrace();
              res.status(500);
              return "Failed Try";
          }
          return "Project Not Loaded";
        }
        );
        get("/api/load-projects",(req,res)->{
            String user_id=req.queryParams("user_id");
            ArrayList<Object> projects=new ArrayList<>();
            try (Connection conn=Database.connect();
                 var stmt = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY)){
                    ResultSet rs=stmt.executeQuery("SELECT project_id,project_name,project_data,last_modified FROM projects");
                    while(rs.next()){
                        Map<String,String> project= new HashMap<>();
                        project.put("project_id",rs.getString("project_id"));
                        project.put("project_name",rs.getString("project_name"));
                        project.put("last_modified",rs.getString("last_modified"));
                        projects.add(project);
                    }
                    Map<String,Object> response=new HashMap<>();
                    response.put("projects",projects);
                    return new Gson().toJson(response);
            }
        });
    }

}
