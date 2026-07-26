/**
 * DBMS Car Rental Management System - Chart.js Analytics Script (Indian Edition)
 * Generates SQL Aggregation charts for Revenue, Fleet Utilization, and Category Performance.
 */

const Charts = {
  // Render Monthly Revenue Trend Line Chart
  renderRevenueChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Monthly Revenue (₹)',
          data: [185000, 220000, 265000, 240000, 310000, 380000, 425000],
          borderColor: '#1e40af',
          backgroundColor: 'rgba(30, 64, 175, 0.08)',
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#3b82f6'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => '₹' + (value / 1000) + 'k'
            }
          }
        }
      }
    });
  },

  // Render Vehicle Category Distribution Pie Chart
  renderCategoryChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const vehicles = DB.getAll(DB.STORAGE_KEYS.VEHICLES);
    const categoryCounts = {};

    vehicles.forEach(v => {
      categoryCounts[v.Category] = (categoryCounts[v.Category] || 0) + 1;
    });

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(categoryCounts),
        datasets: [{
          data: Object.values(categoryCounts),
          backgroundColor: ['#1e40af', '#3b82f6', '#0284c7', '#16a34a', '#d97706', '#8b5cf6'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  },

  // Render Branch Performance Bar Chart
  renderBranchChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Hyderabad (Hitec)', 'Bengaluru (Indiranagar)', 'Chennai (T-Nagar)', 'Kochi (MG Road)', 'Mumbai (Andheri)', 'Delhi (CP)'],
        datasets: [{
          label: 'Total Bookings',
          data: [64, 82, 45, 31, 58, 40],
          backgroundColor: '#3b82f6',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
};
