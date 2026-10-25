
import java.io.IOException;
import java.sql.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/api/employees")
public class EmployeeServlet extends HttpServlet {

    
protected void doGet(HttpServletRequest req,
                     HttpServletResponse res) throws IOException {
    res.setContentType("application/json");
    res.setCharacterEncoding("UTF-8");

    String table = req.getParameter("table");
    boolean isBranch = "branch".equalsIgnoreCase(table);

    String sql = isBranch
        ? "SELECT branchid, branchname, city FROM branch"
        : "SELECT employeeid, name, email, phone, role, branchid, status FROM employee";

    try (Connection con = DBConnection.getConnection();
         Statement st = con.createStatement();
         ResultSet rs = st.executeQuery(sql)) {

        StringBuilder json = new StringBuilder("[");

        while (rs.next()) {
            if (json.length() > 1) json.append(",");

            if (isBranch) {
                json.append("{")
                    .append("\"branchid\":").append(rs.getInt("branchid")).append(",")
                    .append("\"branchname\":\"").append(escape(rs.getString("branchname"))).append("\",")
                    .append("\"city\":\"").append(escape(rs.getString("city"))).append("\"")
                    .append("}");
            } else {
                json.append("{")
                    .append("\"employeeid\":").append(rs.getInt("employeeid")).append(",")
                    .append("\"name\":\"").append(escape(rs.getString("name"))).append("\",")
                    .append("\"email\":\"").append(escape(rs.getString("email"))).append("\",")
                    .append("\"phone\":\"").append(escape(rs.getString("phone"))).append("\",")
                    .append("\"role\":\"").append(escape(rs.getString("role"))).append("\",")
                    .append("\"branchid\":").append(rs.getInt("branchid")).append(",")
                    .append("\"status\":\"").append(escape(rs.getString("status"))).append("\"")
                    .append("}");
            }
        }

        res.getWriter().print(json.append("]"));

    } catch (SQLException e) {
        e.printStackTrace();
        res.setStatus(500);
        res.getWriter().print("{\"error\":\"Database query failed\"}");
    }
}


    protected void doPost(HttpServletRequest req,
                          HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        res.setCharacterEncoding("UTF-8");

        String name = req.getParameter("name");
        String email = req.getParameter("email");
        String phone = req.getParameter("phone");
        String role = req.getParameter("role");
        String branch = req.getParameter("branchid");

        if (name == null || email == null || role == null || branch == null
                || name.isBlank() || email.isBlank() || role.isBlank()) {
            res.setStatus(400);
            res.getWriter().print(
                "{\"error\":\"name, email, role and branchid are required\"}");
            return;
        }

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(
                 "INSERT INTO employee (name,email,phone,role,branchid) VALUES (?,?,?,?,?) RETURNING employeeid")) {

            ps.setString(1, name.trim());
            ps.setString(2, email.trim());
            ps.setString(3, phone);
            ps.setString(4, role);
            ps.setInt(5, Integer.parseInt(branch));

            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                res.setStatus(201);
                res.getWriter().print(
                    "{\"message\":\"Employee created\",\"employeeid\":"
                    + rs.getInt(1) + "}");
            }

        } catch (SQLException | NumberFormatException e) {
            e.printStackTrace();
            res.setStatus(500);
            String message = e.getMessage() == null
                ? "Unknown database error" : e.getMessage();
            res.getWriter().print("{\"error\":\"" + escape(message) + "\"}");
        }
    }

    private String escape(String value) {
        if (value == null) return "";
        return value.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r");
    }
}
