/**
 * DBMS Car Rental Management System - Core Application Script (Indian Market Edition)
 * Handles navigation rendering, role switching, modals, toast messages, and currency formatting in INR (₹).
 */

document.addEventListener('DOMContentLoaded', () => {
  App.initNavbar();
  App.initRoleSwitcher();
});

const App = {
  // Render Universal Navigation Bar
  initNavbar() {
    const navContainer = document.getElementById('navbar-mount');
    if (!navContainer) return;

    const currentUser = DB.getCurrentUser();
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    let linksHTML = '';

    // Customer Navigation Links
    if (currentUser.role === 'Customer') {
      linksHTML = `
        <li><a href="index.html" class="nav-link ${currentPage === 'index.html' ? 'active' : ''}"><i class="fa-solid fa-house"></i> Home</a></li>
        <li><a href="search-cars.html" class="nav-link ${currentPage === 'search-cars.html' || currentPage === 'vehicle-details.html' ? 'active' : ''}"><i class="fa-solid fa-car"></i> Search Cars</a></li>
        <li><a href="customer-dashboard.html" class="nav-link ${currentPage === 'customer-dashboard.html' ? 'active' : ''}"><i class="fa-solid fa-gauge-high"></i> My Dashboard</a></li>
        <li><a href="rental-history.html" class="nav-link ${currentPage === 'rental-history.html' ? 'active' : ''}"><i class="fa-solid fa-clock-rotate-left"></i> My Rentals</a></li>
        <li><a href="feedback.html" class="nav-link ${currentPage === 'feedback.html' ? 'active' : ''}"><i class="fa-solid fa-star"></i> Feedback</a></li>
      `;
    } 
    // Employee Navigation Links
    else if (currentUser.role === 'Employee') {
      linksHTML = `
        <li><a href="employee-dashboard.html" class="nav-link ${currentPage === 'employee-dashboard.html' ? 'active' : ''}"><i class="fa-solid fa-clipboard-user"></i> Staff Desk</a></li>
        <li><a href="vehicle-pickup-return.html" class="nav-link ${currentPage === 'vehicle-pickup-return.html' ? 'active' : ''}"><i class="fa-solid fa-key"></i> Pickup & Return</a></li>
        <li><a href="maintenance.html" class="nav-link ${currentPage === 'maintenance.html' ? 'active' : ''}"><i class="fa-solid fa-wrench"></i> Maintenance</a></li>
        <li><a href="search-cars.html" class="nav-link ${currentPage === 'search-cars.html' ? 'active' : ''}"><i class="fa-solid fa-car"></i> Fleet Catalog</a></li>
      `;
    }
    // Administrator Navigation Links
    else if (currentUser.role === 'Administrator') {
      linksHTML = `
        <li><a href="admin-dashboard.html" class="nav-link ${currentPage === 'admin-dashboard.html' ? 'active' : ''}"><i class="fa-solid fa-chart-line"></i> Admin Dashboard</a></li>
        <li><a href="admin-manage.html" class="nav-link ${currentPage === 'admin-manage.html' ? 'active' : ''}"><i class="fa-solid fa-database"></i> Manage DB Tables</a></li>
        <li><a href="reports.html" class="nav-link ${currentPage === 'reports.html' ? 'active' : ''}"><i class="fa-solid fa-indian-rupee-sign"></i> Reports & Analytics</a></li>
        <li><a href="search-cars.html" class="nav-link ${currentPage === 'search-cars.html' ? 'active' : ''}"><i class="fa-solid fa-car"></i> Fleet Inventory</a></li>
      `;
    }

    const navbarContent = `
      <nav class="top-nav">
        <div class="nav-container">
          <a href="index.html" class="brand-logo">
            <i class="fa-solid fa-car-side"></i> DriveHub <span class="brand-tag">INDIA DBMS</span>
          </a>

          <ul class="nav-links">
            ${linksHTML}
          </ul>

          <div class="role-switcher-container">
            <span class="role-switcher-label">Role:</span>
            <select id="role-select-input" class="role-select">
              <option value="Customer" ${currentUser.role === 'Customer' ? 'selected' : ''}>Customer</option>
              <option value="Employee" ${currentUser.role === 'Employee' ? 'selected' : ''}>Employee</option>
              <option value="Administrator" ${currentUser.role === 'Administrator' ? 'selected' : ''}>Administrator</option>
            </select>
          </div>
        </div>
      </nav>
    `;

    navContainer.innerHTML = navbarContent;
  },

  // Role Switcher Event Listener
  initRoleSwitcher() {
    document.addEventListener('change', (e) => {
      if (e.target && e.target.id === 'role-select-input') {
        const selectedRole = e.target.value;
        let userId = 'CUST-1001';
        let userName = 'Rajesh Kumar';

        if (selectedRole === 'Employee') {
          userId = 'EMP-8001';
          userName = 'Vikram Reddy (Staff)';
        } else if (selectedRole === 'Administrator') {
          userId = 'ADM-001';
          userName = 'System Admin';
        }

        DB.setCurrentUser({
          role: selectedRole,
          id: userId,
          name: userName
        });

        App.showToast(`Switched portal view context to ${selectedRole}`, 'info');

        setTimeout(() => {
          if (selectedRole === 'Customer') window.location.href = 'index.html';
          else if (selectedRole === 'Employee') window.location.href = 'employee-dashboard.html';
          else if (selectedRole === 'Administrator') window.location.href = 'admin-dashboard.html';
        }, 300);
      }
    });
  },

  // Toast Notification Helper
  showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-exclamation-circle';
    if (type === 'info') iconClass = 'fa-info-circle';

    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // Modal Helpers
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  },

  // URL Query Parameter Extractor
  getParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  // Indian Currency Formatter (₹)
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  },

  formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  }
};
