/**
 * DBMS Car Rental Management System - Relational Database Simulation Engine (Indian Market Edition)
 * Manages 9 entities with LocalStorage persistence, foreign key relationships, and CRUD methods.
 */

const DB = {
  // Key names in LocalStorage
  STORAGE_KEYS: {
    CUSTOMERS: 'db_customers_in',
    VEHICLES: 'db_vehicles_in',
    RESERVATIONS: 'db_reservations_in',
    RENTALS: 'db_rentals_in',
    PAYMENTS: 'db_payments_in',
    MAINTENANCE: 'db_maintenance_in',
    EMPLOYEES: 'db_employees_in',
    BRANCHES: 'db_branches_in',
    FEEDBACK: 'db_feedback_in',
    CURRENT_USER: 'db_current_user_in'
  },

  // Initial Relational Seed Data - Indian Context
  seedData: {
    branches: [
      { BranchID: 'BR-101', BranchName: 'Hitec City Hub', City: 'Hyderabad', Phone: '+91-40-5550101', Email: 'hyderabad@drivehub.in', Address: 'Plot 42, Hitec City Main Road', Capacity: 60 },
      { BranchID: 'BR-102', BranchName: 'Indiranagar Depot', City: 'Bengaluru', Phone: '+91-80-5550102', Email: 'bengaluru@drivehub.in', Address: '100 Feet Road, Indiranagar', Capacity: 85 },
      { BranchID: 'BR-103', BranchName: 'T-Nagar Hub', City: 'Chennai', Phone: '+91-44-5550103', Email: 'chennai@drivehub.in', Address: 'Usman Road, T-Nagar', Capacity: 45 },
      { BranchID: 'BR-104', BranchName: 'MG Road Center', City: 'Kochi', Phone: '+91-484-5550104', Email: 'kochi@drivehub.in', Address: 'Near Metro Station, MG Road', Capacity: 35 },
      { BranchID: 'BR-105', BranchName: 'Andheri East Station', City: 'Mumbai', Phone: '+91-22-5550105', Email: 'mumbai@drivehub.in', Address: 'MIDC Central Road, Andheri East', Capacity: 75 },
      { BranchID: 'BR-106', BranchName: 'Connaught Place Depot', City: 'Delhi', Phone: '+91-11-5550106', Email: 'delhi@drivehub.in', Address: 'Block C, Connaught Place', Capacity: 50 }
    ],

    employees: [
      { EmployeeID: 'EMP-8001', Name: 'Vikram Reddy', Email: 'vikram.reddy@drivehub.in', Phone: '+91-98765-01001', Role: 'Manager', BranchID: 'BR-101', HireDate: '2022-03-15', Status: 'Active' },
      { EmployeeID: 'EMP-8002', Name: 'Sunita Rao', Email: 'sunita.rao@drivehub.in', Phone: '+91-98765-01002', Role: 'Service Agent', BranchID: 'BR-101', HireDate: '2023-01-10', Status: 'Active' },
      { EmployeeID: 'EMP-8003', Name: 'Manoj Patel', Email: 'manoj.patel@drivehub.in', Phone: '+91-98765-01003', Role: 'Inspector', BranchID: 'BR-102', HireDate: '2023-05-20', Status: 'Active' },
      { EmployeeID: 'EMP-8004', Name: 'Priya Menon', Email: 'priya.menon@drivehub.in', Phone: '+91-98765-01004', Role: 'Service Agent', BranchID: 'BR-104', HireDate: '2024-02-01', Status: 'Active' }
    ],

    customers: [
      { CustomerID: 'CUST-1001', Name: 'Rajesh Kumar', Email: 'rajesh.kumar@example.com', Phone: '+91-98490-12345', DLNumber: 'TS0920210048192', RegistrationDate: '2024-01-15', Status: 'Active' },
      { CustomerID: 'CUST-1002', Name: 'Ananya Sharma', Email: 'ananya.s@example.com', Phone: '+91-98801-67890', DLNumber: 'KA0120220094812', RegistrationDate: '2024-02-10', Status: 'Active' },
      { CustomerID: 'CUST-1003', Name: 'Sneha Nair', Email: 'sneha.nair@example.com', Phone: '+91-97452-11223', DLNumber: 'KL0720230018273', RegistrationDate: '2024-03-05', Status: 'Active' },
      { CustomerID: 'CUST-1004', Name: 'Rahul Verma', Email: 'rahul.verma@example.com', Phone: '+91-99102-33445', DLNumber: 'DL0320200084920', RegistrationDate: '2024-04-12', Status: 'Active' }
    ],

    vehicles: [
      { VehicleID: 'VEH-501', Make: 'Maruti Suzuki', Model: 'Swift VXi', Year: 2023, Category: 'Hatchback', RegistrationNo: 'TS09AB1234', DailyRate: 1250, FuelType: 'Petrol', Transmission: 'Manual', Status: 'Available', BranchID: 'BR-101', ImageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80' },
      { VehicleID: 'VEH-502', Make: 'Tata', Model: 'Nexon XZ+', Year: 2024, Category: 'Compact SUV', RegistrationNo: 'KA01MH5678', DailyRate: 1850, FuelType: 'Diesel', Transmission: 'Manual', Status: 'Rented', BranchID: 'BR-102', ImageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80' },
      { VehicleID: 'VEH-503', Make: 'Hyundai', Model: 'Creta SX', Year: 2024, Category: 'SUV', RegistrationNo: 'TS07CD4321', DailyRate: 2100, FuelType: 'Petrol', Transmission: 'Automatic', Status: 'Available', BranchID: 'BR-101', ImageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80' },
      { VehicleID: 'VEH-504', Make: 'Mahindra', Model: 'XUV700 AX7', Year: 2023, Category: 'Premium SUV', RegistrationNo: 'KA03XY8765', DailyRate: 2850, FuelType: 'Diesel', Transmission: 'Automatic', Status: 'Available', BranchID: 'BR-102', ImageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80' },
      { VehicleID: 'VEH-505', Make: 'Toyota', Model: 'Fortuner 4x4', Year: 2024, Category: 'Luxury SUV', RegistrationNo: 'MH02EF9988', DailyRate: 3950, FuelType: 'Diesel', Transmission: 'Automatic', Status: 'In Maintenance', BranchID: 'BR-105', ImageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=80' },
      { VehicleID: 'VEH-506', Make: 'Honda', Model: 'City VX', Year: 2023, Category: 'Sedan', RegistrationNo: 'TN09AZ7766', DailyRate: 1950, FuelType: 'Petrol', Transmission: 'Automatic', Status: 'Available', BranchID: 'BR-103', ImageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80' },
      { VehicleID: 'VEH-507', Make: 'Tata', Model: 'Tiago XZ', Year: 2023, Category: 'Hatchback', RegistrationNo: 'KL07BC1122', DailyRate: 1100, FuelType: 'CNG/Petrol', Transmission: 'Manual', Status: 'Available', BranchID: 'BR-104', ImageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80' },
      { VehicleID: 'VEH-508', Make: 'Kia', Model: 'Seltos GTX+', Year: 2024, Category: 'SUV', RegistrationNo: 'DL01QR5544', DailyRate: 2350, FuelType: 'Petrol', Transmission: 'Automatic', Status: 'Rented', BranchID: 'BR-106', ImageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80' },
      { VehicleID: 'VEH-509', Make: 'Tata', Model: 'Nexon EV Max', Year: 2024, Category: 'EV', RegistrationNo: 'TS09EV2024', DailyRate: 2200, FuelType: 'Electric', Transmission: 'Automatic', Status: 'Available', BranchID: 'BR-101', ImageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80' }
    ],

    reservations: [
      { ReservationID: 'RES-2001', CustomerID: 'CUST-1001', VehicleID: 'VEH-503', PickupBranchID: 'BR-101', DropoffBranchID: 'BR-101', StartDate: '2026-07-25', EndDate: '2026-07-28', TotalAmount: 6300, Status: 'Confirmed' },
      { ReservationID: 'RES-2002', CustomerID: 'CUST-1002', VehicleID: 'VEH-501', PickupBranchID: 'BR-101', DropoffBranchID: 'BR-102', StartDate: '2026-07-20', EndDate: '2026-07-23', TotalAmount: 3750, Status: 'Completed' },
      { ReservationID: 'RES-2003', CustomerID: 'CUST-1003', VehicleID: 'VEH-507', PickupBranchID: 'BR-104', DropoffBranchID: 'BR-104', StartDate: '2026-07-27', EndDate: '2026-07-30', TotalAmount: 3300, Status: 'Confirmed' },
      { ReservationID: 'RES-2004', CustomerID: 'CUST-1004', VehicleID: 'VEH-508', PickupBranchID: 'BR-106', DropoffBranchID: 'BR-106', StartDate: '2026-07-24', EndDate: '2026-07-29', TotalAmount: 11750, Status: 'Confirmed' }
    ],

    rentals: [
      { RentalID: 'RENT-3001', ReservationID: 'RES-2001', EmployeeID: 'EMP-8001', PickupDate: '2026-07-25 09:00', ReturnDate: null, InitialOdometer: 18450, FinalOdometer: null, InitialFuel: '100%', FinalFuel: null, ExtraCharges: 0, TotalPaid: 6300, Status: 'Active' },
      { RentalID: 'RENT-3002', ReservationID: 'RES-2002', EmployeeID: 'EMP-8002', PickupDate: '2026-07-20 10:00', ReturnDate: '2026-07-23 11:30', InitialOdometer: 32100, FinalOdometer: 32540, InitialFuel: '100%', FinalFuel: '100%', ExtraCharges: 0, TotalPaid: 3750, Status: 'Completed' },
      { RentalID: 'RENT-3003', ReservationID: 'RES-2004', EmployeeID: 'EMP-8004', PickupDate: '2026-07-24 14:00', ReturnDate: null, InitialOdometer: 12200, FinalOdometer: null, InitialFuel: '95%', FinalFuel: null, ExtraCharges: 0, TotalPaid: 11750, Status: 'Active' }
    ],

    payments: [
      { PaymentID: 'PAY-4001', ReservationID: 'RES-2001', CustomerID: 'CUST-1001', Amount: 6300, PaymentMethod: 'Google Pay', TransactionRef: 'UPI/9849012345/TXN9984', PaymentDate: '2026-07-25', PaymentStatus: 'Completed' },
      { PaymentID: 'PAY-4002', ReservationID: 'RES-2002', CustomerID: 'CUST-1002', Amount: 3750, PaymentMethod: 'PhonePe', TransactionRef: 'UPI/9880167890/TXN7739', PaymentDate: '2026-07-20', PaymentStatus: 'Completed' },
      { PaymentID: 'PAY-4003', ReservationID: 'RES-2003', CustomerID: 'CUST-1003', Amount: 3300, PaymentMethod: 'Paytm UPI', TransactionRef: 'UPI/9745211223/TXN4492', PaymentDate: '2026-07-26', PaymentStatus: 'Completed' },
      { PaymentID: 'PAY-4004', ReservationID: 'RES-2004', CustomerID: 'CUST-1004', Amount: 11750, PaymentMethod: 'Credit Card', TransactionRef: 'CC/HDFC/TXN11029', PaymentDate: '2026-07-24', PaymentStatus: 'Completed' }
    ],

    maintenance: [
      { MaintenanceID: 'MAIN-6001', VehicleID: 'VEH-505', ServiceDate: '2026-07-22', ServiceType: 'Scheduled 30,000 KM Service & Brake Pad Replacement', Cost: 14500, ServiceNotes: 'Replaced front synthetic brake pads, engine oil & oil filter.', MechanicName: 'Toyota Lanson Authorized Care', Status: 'In Progress' },
      { MaintenanceID: 'MAIN-6002', VehicleID: 'VEH-501', ServiceDate: '2026-06-15', ServiceType: 'Annual General Checkup & Wheel Balancing', Cost: 3800, ServiceNotes: 'Wheel alignment, tire rotation & AC filter cleaning completed.', MechanicName: 'Maruti Suzuki Arena Care', Status: 'Completed' }
    ],

    feedback: [
      { FeedbackID: 'FB-7001', CustomerID: 'CUST-1002', VehicleID: 'VEH-501', Rating: 5, Comments: 'The Swift was in top-notch condition and gave great mileage! Super easy pickup at Hitec City Hub.', FeedbackDate: '2026-07-23' },
      { FeedbackID: 'FB-7002', CustomerID: 'CUST-1001', VehicleID: 'VEH-503', Rating: 5, Comments: 'Automatic Creta was extremely comfortable for our family trip to Srisailam.', FeedbackDate: '2026-07-26' }
    ]
  },

  // Initialize Database state in LocalStorage
  init() {
    if (!localStorage.getItem(this.STORAGE_KEYS.CUSTOMERS)) {
      localStorage.setItem(this.STORAGE_KEYS.BRANCHES, JSON.stringify(this.seedData.branches));
      localStorage.setItem(this.STORAGE_KEYS.EMPLOYEES, JSON.stringify(this.seedData.employees));
      localStorage.setItem(this.STORAGE_KEYS.CUSTOMERS, JSON.stringify(this.seedData.customers));
      localStorage.setItem(this.STORAGE_KEYS.VEHICLES, JSON.stringify(this.seedData.vehicles));
      localStorage.setItem(this.STORAGE_KEYS.RESERVATIONS, JSON.stringify(this.seedData.reservations));
      localStorage.setItem(this.STORAGE_KEYS.RENTALS, JSON.stringify(this.seedData.rentals));
      localStorage.setItem(this.STORAGE_KEYS.PAYMENTS, JSON.stringify(this.seedData.payments));
      localStorage.setItem(this.STORAGE_KEYS.MAINTENANCE, JSON.stringify(this.seedData.maintenance));
      localStorage.setItem(this.STORAGE_KEYS.FEEDBACK, JSON.stringify(this.seedData.feedback));
      
      // Default session context
      localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify({
        role: 'Customer',
        id: 'CUST-1001',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@example.com'
      }));
    }
  },

  // Generic CRUD Read
  getAll(tableKey) {
    const data = localStorage.getItem(tableKey);
    return data ? JSON.parse(data) : [];
  },

  getById(tableKey, primaryKeyName, id) {
    const items = this.getAll(tableKey);
    return items.find(item => item[primaryKeyName] === id) || null;
  },

  // Generic CRUD Insert
  insert(tableKey, record) {
    const items = this.getAll(tableKey);
    items.unshift(record);
    localStorage.setItem(tableKey, JSON.stringify(items));
    return record;
  },

  // Generic CRUD Update
  update(tableKey, primaryKeyName, id, updatedFields) {
    const items = this.getAll(tableKey);
    const index = items.findIndex(item => item[primaryKeyName] === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedFields };
      localStorage.setItem(tableKey, JSON.stringify(items));
      return items[index];
    }
    return null;
  },

  // Generic CRUD Delete
  delete(tableKey, primaryKeyName, id) {
    let items = this.getAll(tableKey);
    items = items.filter(item => item[primaryKeyName] !== id);
    localStorage.setItem(tableKey, JSON.stringify(items));
    return true;
  },

  // Relational SQL JOIN Simulator
  getReservationsWithDetails() {
    const reservations = this.getAll(this.STORAGE_KEYS.RESERVATIONS);
    const customers = this.getAll(this.STORAGE_KEYS.CUSTOMERS);
    const vehicles = this.getAll(this.STORAGE_KEYS.VEHICLES);
    const branches = this.getAll(this.STORAGE_KEYS.BRANCHES);
    const rentals = this.getAll(this.STORAGE_KEYS.RENTALS);

    return reservations.map(res => {
      const customer = customers.find(c => c.CustomerID === res.CustomerID) || {};
      const vehicle = vehicles.find(v => v.VehicleID === res.VehicleID) || {};
      const pickupBranch = branches.find(b => b.BranchID === res.PickupBranchID) || {};
      const rental = rentals.find(r => r.ReservationID === res.ReservationID) || {};

      return {
        ...res,
        CustomerName: customer.Name || 'N/A',
        CustomerEmail: customer.Email || 'N/A',
        VehicleName: vehicle.Make ? `${vehicle.Make} ${vehicle.Model}` : 'N/A',
        VehicleRegistration: vehicle.RegistrationNo || 'N/A',
        DailyRate: vehicle.DailyRate || 0,
        PickupBranchName: pickupBranch.BranchName || 'N/A',
        RentalID: rental.RentalID || null,
        RentalStatus: rental.Status || null
      };
    });
  },

  getRentalsWithDetails() {
    const rentals = this.getAll(this.STORAGE_KEYS.RENTALS);
    const resWithDetails = this.getReservationsWithDetails();
    const employees = this.getAll(this.STORAGE_KEYS.EMPLOYEES);

    return rentals.map(rent => {
      const res = resWithDetails.find(r => r.ReservationID === rent.ReservationID) || {};
      const employee = employees.find(e => e.EmployeeID === rent.EmployeeID) || {};

      return {
        ...rent,
        CustomerID: res.CustomerID,
        CustomerName: res.CustomerName,
        VehicleID: res.VehicleID,
        VehicleName: res.VehicleName,
        VehicleRegistration: res.VehicleRegistration,
        PickupBranchName: res.PickupBranchName,
        EmployeeName: employee.Name || 'N/A'
      };
    });
  },

  // Current User Session Handler
  getCurrentUser() {
    const user = localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : { role: 'Customer', id: 'CUST-1001', name: 'Rajesh Kumar' };
  },

  setCurrentUser(userObj) {
    localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(userObj));
  }
};

// Initialize DB immediately on script load
DB.init();
