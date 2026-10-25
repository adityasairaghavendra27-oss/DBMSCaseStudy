
import java.io.IOException;
import java.sql.*;
import java.util.Set;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet({"/api/data", "/api/table"})
public class DatabaseServlet extends HttpServlet {

    private static final Set<String> ALLOWED_TABLES = Set.of(
        "branch", "employee", "customer", "vehicle",
        "reservation", "rental", "payment",
        "maintenance", "feedback"
    );

    private String getTable(HttpServletRequest req) {
        String table = req.getParameter("table");
        if (table == null || !ALLOWED_TABLES.contains(table)) {
            return null;
        }
        return table;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        res.setContentType("application/json");
        res.setCharacterEncoding("UTF-8");

        String table = getTable(req);
        if (table == null) {
            res.setStatus(400);
            res.getWriter().print("{\"error\":\"Invalid table name\"}");
            return;
        }

        try (Connection con = DBConnection.getConnection();
             Statement st = con.createStatement();
             ResultSet rs = st.executeQuery("SELECT * FROM " + table)) {

            ResultSetMetaData meta = rs.getMetaData();
            int columns = meta.getColumnCount();
            StringBuilder json = new StringBuilder("[");

            while (rs.next()) {
                if (json.length() > 1) json.append(",");
                json.append("{");

                for (int i = 1; i <= columns; i++) {
                    if (i > 1) json.append(",");
                    json.append("\"")
                        .append(escape(meta.getColumnLabel(i)))
                        .append("\":");

                    Object value = rs.getObject(i);
                    if (value == null) {
                        json.append("null");
                    } else if (value instanceof Number ||
                               value instanceof Boolean) {
                        json.append(value);
                    } else {
                        json.append("\"")
                            .append(escape(value.toString()))
                            .append("\"");
                    }
                }
                json.append("}");
            }

            res.getWriter().print(json.append("]"));
        } catch (SQLException e) {
            res.setStatus(500);
            res.getWriter().print("{\"error\":\"Database query failed\"}");
            e.printStackTrace();
        }
    }

    private String escape(String value) {
        return value.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r");
    }
    

@Override
protected void doPost(HttpServletRequest req, HttpServletResponse res)
        throws IOException {
    res.setContentType("application/json");
    res.setCharacterEncoding("UTF-8");

    String table = getTable(req);

    if (table == null) {
        res.setStatus(400);
        res.getWriter().print("{\"error\":\"Invalid table name\"}");
        return;
    }

    String sql;

    if ("vehicle".equals(table)) {
        sql = "INSERT INTO vehicle " +
            "(make, model, year, category, registrationno, dailyrate, " +
            "fueltype, transmission, status, branchid) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING vehicleid";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, req.getParameter("make"));
            ps.setString(2, req.getParameter("model"));
            ps.setInt(3, Integer.parseInt(req.getParameter("year")));
            ps.setString(4, req.getParameter("category"));
            ps.setString(5, req.getParameter("registrationno"));
            ps.setBigDecimal(6,
                new java.math.BigDecimal(req.getParameter("dailyrate")));
            ps.setString(7, req.getParameter("fueltype"));
            ps.setString(8, req.getParameter("transmission"));
            ps.setString(9, "Available");
            ps.setInt(10, Integer.parseInt(req.getParameter("branchid")));

            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                res.setStatus(201);
                res.getWriter().print(
                    "{\"message\":\"Vehicle created\",\"vehicleid\":" +
                    rs.getInt(1) + "}");
            }
        } catch (SQLException | NumberFormatException ex) {
            sendError(res, ex);
        }
        return;
    }

    if ("customer".equals(table)) {
        sql = "INSERT INTO customer (name, email, phone, dlnumber) " +
              "VALUES (?, ?, ?, ?) RETURNING customerid";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            String name = req.getParameter("name");
            String email = req.getParameter("email");
            String phone = req.getParameter("phone");
            String license = req.getParameter("dlnumber");

            if (name == null || name.isBlank() ||
                email == null || email.isBlank() ||
                license == null || license.isBlank()) {
                res.setStatus(400);
                res.getWriter().print(
                    "{\"error\":\"Name, email and driving license are required\"}");
                return;
            }

            ps.setString(1, name.trim());
            ps.setString(2, email.trim());
            ps.setString(3, phone);
            ps.setString(4, license.trim());

            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                res.setStatus(201);
                res.getWriter().print(
                    "{\"message\":\"Customer created\",\"customerid\":" +
                    rs.getInt(1) + "}");
            }
        } catch (SQLException ex) {
            sendError(res, ex);
        }
        return;
    }
    if ("branch".equals(table)) {
    String branchName = req.getParameter("branchname");
    String city = req.getParameter("city");

    if (branchName == null || branchName.isBlank()
            || city == null || city.isBlank()) {
        res.setStatus(400);
        res.getWriter().print(
            "{\"error\":\"Branch name and city are required\"}");
        return;
    }

    String branchSql =
        "INSERT INTO branch (branchname, city) VALUES (?, ?) RETURNING branchid";

    try (Connection con = DBConnection.getConnection();
         PreparedStatement ps = con.prepareStatement(branchSql)) {

        ps.setString(1, branchName.trim());
        ps.setString(2, city.trim());

        try (ResultSet rs = ps.executeQuery()) {
            rs.next();
            res.setStatus(201);
            res.getWriter().print(
                "{\"message\":\"Branch created\",\"branchid\":"
                + rs.getInt(1) + "}");
        }
    } catch (SQLException ex) {
        sendError(res, ex);
    }
    return;
}

if ("reservation".equals(table)) {
    String customerId = req.getParameter("customerid");
    String vehicleId = req.getParameter("vehicleid");
    String pickupBranchId = req.getParameter("pickupbranchid");
    String dropoffBranchId = req.getParameter("dropoffbranchid");
    String startDate = req.getParameter("startdate");
    String endDate = req.getParameter("enddate");
    String totalAmount = req.getParameter("totalamount");
    String status = req.getParameter("status");

    String reservationSql = "INSERT INTO reservation " +
        "(customerid, vehicleid, pickupbranchid, dropoffbranchid, " +
        "startdate, enddate, totalamount, status) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING reservationid";

    try (Connection con = DBConnection.getConnection();
         PreparedStatement ps = con.prepareStatement(reservationSql)) {

        ps.setInt(1, Integer.parseInt(customerId));
        ps.setInt(2, Integer.parseInt(vehicleId));
        ps.setInt(3, Integer.parseInt(pickupBranchId));
        ps.setInt(4, Integer.parseInt(dropoffBranchId));
        ps.setDate(5, java.sql.Date.valueOf(startDate));
        ps.setDate(6, java.sql.Date.valueOf(endDate));
        ps.setBigDecimal(7, new java.math.BigDecimal(totalAmount));
        ps.setString(8,
            status == null || status.isBlank() ? "Pending" : status);

        try (ResultSet rs = ps.executeQuery()) {
            rs.next();
            res.setStatus(201);
            res.getWriter().print(
                "{\"message\":\"Reservation created\",\"reservationid\":"
                + rs.getInt(1) + "}");
        }
    } catch (Exception ex) {
        sendError(res, ex);
    }
    return;
}

if ("rental".equals(table)) {
    String reservationId = req.getParameter("reservationid");
    String employeeId = req.getParameter("employeeid");
    String pickupDate = req.getParameter("pickupdate");
    String returnDate = req.getParameter("returndate");

    String initialOdometer = req.getParameter("initialodometer");
    String finalOdometer = req.getParameter("finalodometer");
    String initialFuel = req.getParameter("initialfuel");
    String finalFuel = req.getParameter("finalfuel");
    String extraCharges = req.getParameter("extracharges");
    String totalPaid = req.getParameter("totalpaid");
    String status = req.getParameter("status");

    String rentalSql =
        "INSERT INTO rental " +
        "(reservationid, employeeid, pickupdate, returndate, " +
        "initialodometer, finalodometer, initialfuel, finalfuel, " +
        "extracharges, totalpaid, status) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING rentalid";

    try (Connection con = DBConnection.getConnection();
         PreparedStatement ps = con.prepareStatement(rentalSql)) {

        ps.setInt(1, Integer.parseInt(reservationId));
        ps.setInt(2, Integer.parseInt(employeeId));
        ps.setTimestamp(3, Timestamp.valueOf(pickupDate.replace("T", " ") +
            (pickupDate.length() == 16 ? ":00" : "")));

        if (returnDate == null || returnDate.isBlank()) {
            ps.setNull(4, Types.TIMESTAMP);
        } else {
            ps.setTimestamp(4, Timestamp.valueOf(
                returnDate.replace("T", " ") +
                (returnDate.length() == 16 ? ":00" : "")));
        }

        if (initialOdometer == null || initialOdometer.isBlank()) {
            ps.setNull(5, Types.INTEGER);
        } else {
            ps.setInt(5, Integer.parseInt(initialOdometer));
        }

        if (finalOdometer == null || finalOdometer.isBlank()) {
            ps.setNull(6, Types.INTEGER);
        } else {
            ps.setInt(6, Integer.parseInt(finalOdometer));
        }

        ps.setBigDecimal(7, initialFuel == null || initialFuel.isBlank()
            ? null : new java.math.BigDecimal(initialFuel));

        ps.setBigDecimal(8, finalFuel == null || finalFuel.isBlank()
            ? null : new java.math.BigDecimal(finalFuel));

        ps.setBigDecimal(9, extraCharges == null || extraCharges.isBlank()
            ? java.math.BigDecimal.ZERO : new java.math.BigDecimal(extraCharges));

        ps.setBigDecimal(10, totalPaid == null || totalPaid.isBlank()
            ? java.math.BigDecimal.ZERO : new java.math.BigDecimal(totalPaid));

        ps.setString(11,
            status == null || status.isBlank() ? "Active" : status);

        try (ResultSet rs = ps.executeQuery()) {
            rs.next();
            res.setStatus(201);
            res.getWriter().print(
                "{\"message\":\"Rental created\",\"rentalid\":" +
                rs.getInt(1) + "}");
        }
    } catch (Exception ex) {
        sendError(res, ex);
    }
    return;
}

if ("payment".equals(table)) {
    String rentalId = req.getParameter("rentalid");
    String customerId = req.getParameter("customerid");
    String amount = req.getParameter("amount");
    String paymentMethod = req.getParameter("paymentmethod");
    String transactionRef = req.getParameter("transactionref");
    String paymentStatus = req.getParameter("paymentstatus");

    if (rentalId == null || customerId == null ||
        amount == null || paymentMethod == null ||
        paymentMethod.isBlank()) {
        res.setStatus(400);
        res.getWriter().print(
            "{\"error\":\"Rental, customer, amount and payment method are required\"}");
        return;
    }

    String paymentSql =
        "INSERT INTO payment " +
        "(rentalid, customerid, amount, paymentmethod, " +
        "transactionref, paymentstatus) " +
        "VALUES (?, ?, ?, ?, ?, ?) RETURNING paymentid";

    try (Connection con = DBConnection.getConnection();
         PreparedStatement ps = con.prepareStatement(paymentSql)) {

        ps.setInt(1, Integer.parseInt(rentalId));
        ps.setInt(2, Integer.parseInt(customerId));
        ps.setBigDecimal(3, new java.math.BigDecimal(amount));
        ps.setString(4, paymentMethod.trim());

        if (transactionRef == null || transactionRef.isBlank()) {
            ps.setNull(5, Types.VARCHAR);
        } else {
            ps.setString(5, transactionRef.trim());
        }

        ps.setString(6,
            paymentStatus == null || paymentStatus.isBlank()
                ? "Pending" : paymentStatus.trim());

        try (ResultSet rs = ps.executeQuery()) {
            rs.next();
            res.setStatus(201);
            res.getWriter().print(
                "{\"message\":\"Payment created\",\"paymentid\":" +
                rs.getInt(1) + "}");
        }
    } catch (Exception ex) {
        sendError(res, ex);
    }
    return;
}

if ("maintenance".equals(table)) {
    String vehicleId = req.getParameter("vehicleid");
    String serviceDate = req.getParameter("servicedate");
    String serviceType = req.getParameter("servicetype");
    String cost = req.getParameter("cost");
    String serviceNotes = req.getParameter("servicenotes");
    String status = req.getParameter("status");
    String mechanicName = req.getParameter("mechanicname");

    if (vehicleId == null || serviceDate == null ||
        serviceType == null || serviceType.isBlank()) {
        res.setStatus(400);
        res.getWriter().print(
            "{\"error\":\"Vehicle, service date and service type are required\"}");
        return;
    }

    String maintenanceSql =
        "INSERT INTO maintenance " +
        "(vehicleid, servicedate, servicetype, cost, " +
        "servicenotes, status, mechanicname) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING maintenanceid";

    try (Connection con = DBConnection.getConnection();
         PreparedStatement ps = con.prepareStatement(maintenanceSql)) {

        ps.setInt(1, Integer.parseInt(vehicleId));
        ps.setDate(2, java.sql.Date.valueOf(serviceDate));
        ps.setString(3, serviceType.trim());

        if (cost == null || cost.isBlank()) {
            ps.setNull(4, Types.NUMERIC);
        } else {
            ps.setBigDecimal(4, new java.math.BigDecimal(cost));
        }

        if (serviceNotes == null || serviceNotes.isBlank()) {
            ps.setNull(5, Types.VARCHAR);
        } else {
            ps.setString(5, serviceNotes.trim());
        }

        ps.setString(6,
            status == null || status.isBlank() ? "Scheduled" : status);

        if (mechanicName == null || mechanicName.isBlank()) {
            ps.setNull(7, Types.VARCHAR);
        } else {
            ps.setString(7, mechanicName.trim());
        }

        try (ResultSet rs = ps.executeQuery()) {
            rs.next();
            res.setStatus(201);
            res.getWriter().print(
                "{\"message\":\"Maintenance created\",\"maintenanceid\":" +
                rs.getInt(1) + "}");
        }
    } catch (Exception ex) {
        sendError(res, ex);
    }
    return;
}

if ("feedback".equals(table)) {
    String customerId = req.getParameter("customerid");
    String rentalId = req.getParameter("rentalid");
    String rating = req.getParameter("rating");
    String comments = req.getParameter("comments");

    if (customerId == null || rentalId == null || rating == null) {
        res.setStatus(400);
        res.getWriter().print(
            "{\"error\":\"Customer, rental and rating are required\"}");
        return;
    }

    String feedbackSql =
        "INSERT INTO feedback (customerid, rentalid, rating, comments) " +
        "VALUES (?, ?, ?, ?) RETURNING feedbackid";

    try (Connection con = DBConnection.getConnection();
         PreparedStatement ps = con.prepareStatement(feedbackSql)) {

        int ratingValue = Integer.parseInt(rating);

        if (ratingValue < 1 || ratingValue > 5) {
            res.setStatus(400);
            res.getWriter().print(
                "{\"error\":\"Rating must be between 1 and 5\"}");
            return;
        }

        ps.setInt(1, Integer.parseInt(customerId));
        ps.setInt(2, Integer.parseInt(rentalId));
        ps.setInt(3, ratingValue);

        if (comments == null || comments.isBlank()) {
            ps.setNull(4, Types.VARCHAR);
        } else {
            ps.setString(4, comments.trim());
        }

        try (ResultSet rs = ps.executeQuery()) {
            rs.next();
            res.setStatus(201);
            res.getWriter().print(
                "{\"message\":\"Feedback created\",\"feedbackid\":" +
                rs.getInt(1) + "}");
        }
    } catch (Exception ex) {
        sendError(res, ex);
    }
    return;
}




    res.setStatus(400);
    res.getWriter().print(
        "{\"error\":\"POST is not yet supported for this table\"}");
}

private void sendError(HttpServletResponse res, Exception ex)
        throws IOException {
    ex.printStackTrace();
    res.setStatus(500);
    String message = ex.getMessage() == null
        ? "Insert failed" : ex.getMessage();
    res.getWriter().print("{\"error\":\"" + escape(message) + "\"}");
}


}
