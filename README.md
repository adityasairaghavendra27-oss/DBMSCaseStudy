# DriveHub India

**A Database-Driven Car Rental Management System**

DriveHub India is a car-rental management project built to organize the core data and workflows involved in renting vehicles. It combines a web interface with a Java Servlet backend and a PostgreSQL relational database. The project is being developed as a DBMS project, with an emphasis on relational database design, CRUD operations, and connecting a web application to a database.

> **Project status:** Local development and database integration are in progress. Public deployment is planned; the application should not be considered publicly deployed until a live URL has been added and tested.

---

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Current Implementation](#current-implementation)
- [Database Design](#database-design)
- [Backend API](#backend-api)
- [Run Locally](#run-locally)
- [Configuration and Security](#configuration-and-security)
- [Deployment Plan](#deployment-plan)
- [Repository Structure](#repository-structure)
- [Testing Checklist](#testing-checklist)
- [Known Limitations and Next Steps](#known-limitations-and-next-steps)
- [Contributors](#contributors)

## Overview

DriveHub India is designed to provide a centralized system for managing car-rental information. Its database models the main entities involved in a rental business: customers, vehicles, branches, employees, reservations, rentals, payments, maintenance records, and customer feedback.

The project demonstrates how a browser-based frontend communicates with Java Servlets, which execute SQL queries against PostgreSQL through JDBC.

### Project goals

- Design a relational database for a car-rental workflow.
- Connect a Java web application to PostgreSQL using JDBC.
- Expose backend endpoints for reading and creating records.
- Provide management interfaces for key business records.
- Prepare the application for eventual access through a public URL.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Java Servlets |
| Web/application server | Apache Tomcat 9 |
| Database | PostgreSQL |
| Database connectivity | JDBC |
| Database administration | pgAdmin |
| Development environment | Visual Studio Code |
| Version control | Git and GitHub |
| Planned hosting | Render for the web application and a hosted PostgreSQL provider such as Supabase |

The existing servlet code uses the `javax.servlet` API and is intended for **Tomcat 9**. Moving to Tomcat 10 or newer would require migrating servlet imports and checking compatibility.

## Current Implementation

The project has been developed around a local Tomcat and PostgreSQL setup.

### Confirmed project components

- A frontend website for DriveHub India.
- A Java Servlet backend running locally on Apache Tomcat 9.
- A PostgreSQL database named `drivehub`.
- JDBC connectivity using the PostgreSQL driver.
- A generic data endpoint that reads records from an allowlisted set of database tables.
- A separate employee endpoint at `/api/employees`.
- An `admin-manage.html` management page with interfaces for vehicles, customers, employees, and branches.
- Backend POST handlers for several business entities.

### Implementation status

Not every endpoint or interface has been fully tested end-to-end. Update/delete operations and all management-page integrations must be verified before the application is described as production-ready. Public hosting and hosted-database configuration are still planned.

## Database Design

The database is named `drivehub` and contains nine main tables:

| Table | Purpose |
|---|---|
| `branch` | Stores branch/location information. |
| `employee` | Stores employee information. |
| `customer` | Stores customer information. |
| `vehicle` | Stores vehicle information. |
| `reservation` | Stores customer vehicle-reservation details. |
| `rental` | Stores rental and pickup/return information. |
| `payment` | Stores rental payment records. |
| `maintenance` | Stores vehicle servicing and maintenance records. |
| `feedback` | Stores customer ratings and comments. |

These tables form the core data model for the car-rental workflow. Document primary keys, foreign keys, constraints, and relationships against the final SQL schema.

### Recommended schema file

Export or prepare the final database schema as `schema.sql` and add it to the repository. It should include the table definitions and constraints needed to recreate the database, but must not contain real user passwords or production credentials.

## Backend API

The routes below reflect the current project structure. Verify each route against the latest source before relying on it.

### Generic table data endpoint

**Base route:** `/api/data`

| Method | Purpose |
|---|---|
| `GET` | Reads records from an allowed table using the `table` query parameter. |
| `POST` | Handles create operations for supported entities. |
| `PUT` | Update support is not yet confirmed as implemented. |
| `DELETE` | Delete support is not yet confirmed as implemented. |

Example local request:

```http
GET http://localhost:8080/DriveHubIndia/api/data?table=vehicle
```

Other allowed table names include `branch`, `customer`, `reservation`, `rental`, `payment`, `maintenance`, and `feedback`.

The backend uses an allowlist of table names for the generic endpoint. Keep this validation in place; never accept an arbitrary table name directly from a request.

### Employee endpoint

**Base route:** `/api/employees`

This route is used by the frontend to load employee records and submit employee creation requests. Confirm the exact supported methods and request fields in `EmployeeServlet.java`.

### Example local endpoint URLs

```text
http://localhost:8080/DriveHubIndia/api/data?table=vehicle
http://localhost:8080/DriveHubIndia/api/data?table=customer
http://localhost:8080/DriveHubIndia/api/data?table=branch
http://localhost:8080/DriveHubIndia/api/data?table=reservation
http://localhost:8080/DriveHubIndia/api/employees
```

A successful GET request may return an empty JSON array (`[]`) if the corresponding table has no records.

## Run Locally

These instructions describe the existing local setup. Paths may differ on another computer.

### Prerequisites

- A JDK compatible with the project.
- Apache Tomcat 9.
- PostgreSQL.
- pgAdmin (optional, for database administration).
- PostgreSQL JDBC driver.
- A browser and an editor such as Visual Studio Code.

### 1. Create the database

Create a PostgreSQL database named `drivehub` and execute the project's final schema SQL to create its tables.

The current local development database has been configured on port `5433`. PostgreSQL installations may use a different port, so check your server configuration.

### 2. Configure the database connection

The current local configuration has used a JDBC URL in this form:

```text
jdbc:postgresql://localhost:5433/drivehub
```

The database username and password must match your local PostgreSQL setup. Before sharing the repository or deploying the application, move credentials out of source code and into environment variables or another private configuration mechanism.

### 3. Deploy the web application to Tomcat

Place the built web application in Tomcat's `webapps` directory. The existing local deployment has used the context path `DriveHubIndia`.

Start Tomcat from its `bin` directory:

```bat
catalina.bat run
```

Stop the foreground server with `Ctrl+C`.

### 4. Open the website

```text
http://localhost:8080/DriveHubIndia/
```

### 5. Test a backend endpoint

```text
http://localhost:8080/DriveHubIndia/api/data?table=vehicle
```

If the endpoint returns JSON, the request reached the servlet. An empty array means the table currently has no rows; it does not by itself prove that create, update, or delete operations work.

## Configuration and Security

Before publishing the application:

- **Remove credentials from source code.** Use environment variables for the database URL, username, and password.
- **Do not commit secrets.** Check staged files and repository history before pushing to GitHub.
- **Use SSL for hosted database connections** when required by the database provider.
- **Validate request input.** Validate IDs, numeric fields, dates, required values, and allowed status values on the server.
- **Use parameterized SQL.** Use `PreparedStatement` for user-supplied values.
- **Restrict database access.** Use a dedicated database role with only the permissions the application needs, rather than a superuser account.
- **Avoid exposing stack traces or credentials** in HTTP responses or public logs.
- **Test authorization.** An administrative page should not be treated as secure merely because it is named `admin-manage.html`. Add server-side authentication and authorization before using real customer or business data.
- **Use HTTPS** for the public website.

## Deployment Plan

The goal is to make DriveHub India accessible through a public URL while retaining the Java Servlet and PostgreSQL architecture.

Planned approach:

1. Push the project source and a safe setup guide to GitHub.
2. Prepare a Docker image containing the web application and a compatible Tomcat 9 runtime.
3. Create a hosted PostgreSQL database with a provider such as Supabase.
4. Configure the hosted database connection through environment variables and the provider's connection settings.
5. Deploy the container as a web service, for example on Render.
6. Configure the service port and database environment variables.
7. Test the public website and API endpoints.
8. Add the verified live URL to this README.

Free hosting plans can have limitations such as sleeping services, paused databases, storage limits, or expiration policies. Review the providers' current terms before relying on a free service for a demonstration.

**No public URL is listed here because deployment has not yet been verified.**

## Repository Structure

The exact folder layout should reflect the files committed to GitHub. A typical layout may look like this:

```text
DriveHubIndia/
├── index.html
├── admin-manage.html
├── ... other frontend pages ...
├── css/                         # If stylesheets are organized separately
├── js/                          # If JavaScript is organized separately
├── WEB-INF/
│   ├── web.xml                  # If used by the application
│   ├── classes/
│   │   ├── DBConnection.java
│   │   ├── DatabaseServlet.java
│   │   └── EmployeeServlet.java
│   └── lib/
│       └── postgresql-*.jar
├── schema.sql                   # Add the final schema export
├── Dockerfile                   # Add for container deployment
├── .gitignore
└── README.md
```

This is an illustrative structure, not a verified listing of every file in the repository. Keep the actual layout consistent with the committed files and the build/deployment process.

## Testing Checklist

Before presenting the project as complete, test the following:

- [ ] The database schema can be created from a clean PostgreSQL database.
- [ ] Tomcat starts without deployment or compilation errors.
- [ ] The home page and frontend assets load correctly.
- [ ] Vehicle and customer lists load from PostgreSQL.
- [ ] Employee and branch lists load from PostgreSQL.
- [ ] Create operations insert the expected records.
- [ ] Invalid input produces a clear error instead of a server crash.
- [ ] Update and delete operations work, or are clearly marked as unsupported.
- [ ] Reservation, rental, payment, maintenance, and feedback workflows are tested.
- [ ] Foreign-key constraints and related-record deletion are handled correctly.
- [ ] Credentials are not present in the GitHub repository.
- [ ] The hosted application can connect to the hosted database.
- [ ] The public URL and API endpoints work from a different device or network.
- [ ] Authentication and authorization protect administrative operations before real data is used.

## Known Limitations and Next Steps

The project is still being prepared for public deployment. Priority next steps:

1. Review and finalize `DBConnection.java` so local and hosted environments can be configured safely.
2. Fix and test remaining servlet issues, including the reservation SQL statement.
3. Implement and test update/delete handlers if those operations are required by the frontend.
4. Verify that all frontend forms use the correct API routes and request formats.
5. Export the final database schema to `schema.sql`.
6. Add a `.gitignore` and remove secrets or local-only files from the repository.
7. Add a Tomcat 9-compatible `Dockerfile`.
8. Deploy and verify the hosted application and database.
9. Update this README with the real live URL, screenshots, and verified setup details.

## Contributors

Add the project contributors and their roles here.

- **Project:** DriveHub India
- **Type:** Database Management Systems (DBMS) project
- **Purpose:** Demonstrate a relational database-backed car-rental management application

---

*DriveHub India is an academic project. Do not use it to store real customer or payment information until authentication, authorization, validation, and deployment security have been reviewed and tested.*
