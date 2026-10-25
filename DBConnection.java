
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException(
                "PostgreSQL driver JAR not found. Check WEB-INF/lib.", e
            );
        }

        return DriverManager.getConnection(
            "jdbc:postgresql://localhost:5433/drivehub",
            "postgres",
            "postgres"
        );
    }
}
