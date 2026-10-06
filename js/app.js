(function () {
  const appState = {
    route: 'dashboard',
    globalSearch: '',
    settingsTab: 'general'
  };

  function getCurrentUser() {
    const profile = window.novaAdminStorage.getProfile();
    return {
      name: profile.name || 'Alicia Morgan',
      email: profile.email || 'admin@example.com',
      role: profile.role || 'Product Lead',
      avatar: profile.avatar || 'AM'
    };
  }

  function applyTheme(theme) {
    const resolved = theme === 'light' ? 'light' : 'dark';
    document.body.classList.toggle('theme-light', resolved === 'light');
    document.body.classList.toggle('theme-dark', resolved !== 'light');
    const icon = document.getElementById('theme-toggle');
    if (icon) {
      icon.innerHTML = resolved === 'light' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    }
    window.novaAdminStorage.setTheme(resolved);
  }

  function updateHeaderUser() {
    const user = getCurrentUser();
    const sidebarName = document.getElementById('sidebar-user-name');
    const userLabels = document.querySelector('.user-menu .user-labels strong');
    const userEmail = document.querySelector('.user-menu .user-labels span');
    const avatars = document.querySelectorAll('.user-avatar');

    if (sidebarName) sidebarName.textContent = user.name;
    if (userLabels) userLabels.textContent = user.name;
    if (userEmail) userEmail.textContent = user.email;

    avatars.forEach((avatar) => {
      avatar.textContent = user.avatar || 'AM';
    });
  }

  function getRouteFromHash() {
    const hash = window.location.hash || '#/dashboard';
    const route = hash.replace(/^#\/?/, '').split('?')[0] || 'dashboard';
    return route;
  }

  function setActiveNav(route) {
    document.querySelectorAll('.nav-item').forEach((item) => {
      const isActive = item.dataset.route === route;
      item.classList.toggle('active', isActive);
    });
  }

  function renderDashboardPage() {
    const users = window.novaAdminStorage.getUsers();
    const products = window.novaAdminStorage.getProducts();
    const orders = window.novaAdminStorage.getOrders();
    const metrics = [
      { label: 'Total Revenue', value: '$128,430', delta: '+12.8%', positive: true, text: 'vs last month', icon: 'fa-dollar-sign' },
      { label: 'Total Orders', value: '2,846', delta: '+8.4%', positive: true, text: 'vs last month', icon: 'fa-cart-shopping' },
      { label: 'Customers', value: '18,324', delta: '+4.1%', positive: true, text: 'vs last month', icon: 'fa-user-group' },
      { label: 'Conversion Rate', value: '6.42%', delta: '-1.3%', positive: false, text: 'vs last month', icon: 'fa-chart-simple' }
    ];

    const recentOrders = orders.slice(0, 5);
    const topProducts = products.slice(0, 5);
    const trendLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const revenueSeries = [14, 18, 17, 22, 21, 27, 29, 34];
    const expenseSeries = [9, 13, 12, 16, 15, 17, 18, 20];
    const salesSeries = [12, 15, 14, 18, 22, 20, 27, 26];
    const categoryData = [35, 28, 22, 15];
    const categoryLabels = ['Software', 'CRM', 'Analytics', 'E-commerce'];
    const colors = ['#6d5efc', '#8b5cf6', '#60a5fa', '#34d399'];

    const metricCards = metrics.map((metric) => `
      <article class="card metric-card">
        <div class="metric-header">
          <span class="metric-label">${metric.label}</span>
          <span class="metric-icon"><i class="fa-solid ${metric.icon}"></i></span>
        </div>
        <div class="metric-value">${metric.value}</div>
        <div class="metric-meta">
          <span class="delta-badge ${metric.positive ? 'delta-positive' : 'delta-negative'}">
            <i class="fa-solid ${metric.positive ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
            ${metric.delta}
          </span>
          <small>${metric.text}</small>
        </div>
      </article>
    `).join('');

    const orderRows = recentOrders.map((order) => `
      <tr>
        <td>${order.id}</td>
        <td>${order.customer}</td>
        <td>${order.product}</td>
        <td>${order.date}</td>
        <td>${window.novaAdminUtils.formatCurrency(order.amount)}</td>
        <td><span class="status-pill ${window.novaAdminUtils.statusClass(order.status)}">${order.status}</span></td>
      </tr>
    `).join('');

    const productRows = topProducts.map((product) => `
      <tr>
        <td>
          <div class="product-cell">
            <span class="product-avatar">${product.image}</span>
            <span>${product.name}</span>
          </div>
        </td>
        <td>${product.category}</td>
        <td>${window.novaAdminUtils.formatCurrency(product.price)}</td>
        <td>${product.stock}</td>
        <td><span class="status-pill ${window.novaAdminUtils.statusClass(product.status)}">${product.status}</span></td>
      </tr>
    `).join('');

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Welcome back. Here's what's happening today.</p>
        </div>
        <div class="page-actions">
          <button type="button" class="button secondary"><i class="fa-solid fa-calendar-days"></i> This month</button>
          <button type="button" class="button primary"><i class="fa-solid fa-filter"></i> Export</button>
        </div>
      </div>
      <section class="kpi-grid">${metricCards}</section>

      <div class="dashboard-grid">
        <div class="panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">Revenue Overview</h2>
              <div class="panel-subtitle">Monthly performance</div>
            </div>
          </div>
          <div class="chart-wrap">
            <div class="chart-box"><canvas id="revenueOverviewChart"></canvas></div>
          </div>
        </div>

        <div class="side-panel">
          <div class="panel">
            <div class="panel-header">
              <div>
                <h3 class="panel-title">Revenue by Category</h3>
                <div class="panel-subtitle">Current mix</div>
              </div>
            </div>
            <div class="chart-wrap pie-chart-wrap">
              <div class="chart-box" style="height:220px;"><canvas id="categoryBreakdownChart"></canvas></div>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="panel">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">Sales Overview</h3>
              <div class="panel-subtitle">This year</div>
            </div>
          </div>
          <div class="chart-wrap">
            <div class="chart-box"><canvas id="salesOverviewChart"></canvas></div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">Top Products</h3>
              <div class="panel-subtitle">Best sellers</div>
            </div>
          </div>
          <div class="table-shell">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>${productRows}</tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="panel">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">Recent Orders</h3>
              <div class="panel-subtitle">Latest transactions</div>
            </div>
          </div>
          <div class="table-shell">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>${orderRows}</tbody>
            </table>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">Recent Activity</h3>
              <div class="panel-subtitle">Operations stream</div>
            </div>
          </div>
          <div class="timeline">
            <div class="timeline-item">
              <h4>New customer onboarded</h4>
              <p>Northpeak activated a premium workspace and paid the annual plan.</p>
            </div>
            <div class="timeline-item">
              <h4>Inventory alert</h4>
              <p>Orbit Inventory reached its low-stock threshold for 3 SKUs.</p>
            </div>
            <div class="timeline-item">
              <h4>Performance spike</h4>
              <p>Revenue from SaaS subscriptions exceeded the target by 9.4%.</p>
            </div>
            <div class="timeline-item">
              <h4>Security update</h4>
              <p>Two-factor authentication reminders were sent to inactive admins.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderUsersPage() {
    const users = window.novaAdminStorage.getUsers();
    const searchTerm = appState.globalSearch.trim().toLowerCase();
    const filtered = users.filter((user) => {
      if (!searchTerm) return true;
      return [user.name, user.email, user.role, user.status].join(' ').toLowerCase().includes(searchTerm);
    });

    const rows = filtered.map((user) => `
      <tr class="${user.id ? 'selected' : ''}">
        <td class="checkbox-cell"><input type="checkbox" data-action="select-user" data-id="${user.id}" /></td>
        <td>
          <div class="product-cell">
            <span class="user-avatar small">${window.novaAdminUtils.initialsFromName(user.name)}</span>
            <span>${user.name}</span>
          </div>
        </td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td><span class="status-pill ${window.novaAdminUtils.statusClass(user.status)}">${user.status}</span></td>
        <td>${user.joined}</td>
        <td>
          <div class="action-group">
            <button type="button" class="table-button" data-action="edit-user" data-id="${user.id}" aria-label="Edit user"><i class="fa-solid fa-pen"></i></button>
            <button type="button" class="table-button" data-action="delete-user" data-id="${user.id}" aria-label="Delete user"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Users</h1>
          <p class="page-subtitle">Manage access, permissions, and team activity.</p>
        </div>
        <button type="button" class="button primary" data-action="add-user"><i class="fa-solid fa-user-plus"></i> Add user</button>
      </div>

      <div class="card section-card">
        <div class="table-actions">
          <div class="filters-bar">
            <div class="field-group">
              <label>Status</label>
              <select data-filter="status">
                <option value="all">All statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div class="field-group">
              <label>Role</label>
              <select data-filter="role">
                <option value="all">All roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </select>
            </div>
          </div>
          <div class="bulk-actions">
            <button type="button" class="button secondary" data-action="select-all-users">Select all</button>
            <button type="button" class="button secondary" data-action="bulk-status-user">Bulk status</button>
          </div>
        </div>

        <div class="table-shell">
          <table class="data-table usermanagement-table">
            <thead>
              <tr>
                <th class="checkbox-cell"><input type="checkbox" id="select-all-checkbox" /></th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>${rows || '<tr><td colspan="7"><div class="empty-state">No users match your filter.</div></td></tr>'}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderProductsPage() {
    const products = window.novaAdminStorage.getProducts();
    const searchTerm = appState.globalSearch.trim().toLowerCase();
    const filtered = products.filter((product) => {
      if (!searchTerm) return true;
      return [product.name, product.category, product.sku].join(' ').toLowerCase().includes(searchTerm);
    });

    const rows = filtered.map((product) => `
      <tr>
        <td>
          <div class="product-cell">
            <span class="product-avatar">${product.image}</span>
            <span>${product.name}</span>
          </div>
        </td>
        <td>${product.sku}</td>
        <td>${product.category}</td>
        <td>${window.novaAdminUtils.formatCurrency(product.price)}</td>
        <td>${product.stock}</td>
        <td><span class="status-pill ${window.novaAdminUtils.statusClass(product.status)}">${product.status}</span></td>
        <td>
          <div class="action-group">
            <button type="button" class="table-button" data-action="edit-product" data-id="${product.id}"><i class="fa-solid fa-pen"></i></button>
            <button type="button" class="table-button" data-action="delete-product" data-id="${product.id}"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Products</h1>
          <p class="page-subtitle">Track pricing, availability, and product performance.</p>
        </div>
        <button type="button" class="button primary" data-action="add-product"><i class="fa-solid fa-plus"></i> Add product</button>
      </div>

      <div class="card section-card">
        <div class="table-actions">
          <div class="filters-bar">
            <div class="field-group">
              <label>Category</label>
              <select data-filter="product-category">
                <option value="all">All categories</option>
                <option value="Software">Software</option>
                <option value="CRM">CRM</option>
                <option value="Analytics">Analytics</option>
                <option value="Inventory">Inventory</option>
                <option value="E-commerce">E-commerce</option>
              </select>
            </div>
            <div class="field-group">
              <label>Status</label>
              <select data-filter="product-status">
                <option value="all">All statuses</option>
                <option value="Active">Active</option>
                <option value="Low Stock">Low Stock</option>
              </select>
            </div>
          </div>
        </div>

        <div class="table-shell">
          <table class="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>${rows || '<tr><td colspan="7"><div class="empty-state">No products match your criteria.</div></td></tr>'}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderOrdersPage() {
    const orders = window.novaAdminStorage.getOrders();
    const searchTerm = appState.globalSearch.trim().toLowerCase();
    const filtered = orders.filter((order) => {
      if (!searchTerm) return true;
      return [order.id, order.customer, order.product].join(' ').toLowerCase().includes(searchTerm);
    });

    const rows = filtered.map((order) => `
      <tr>
        <td>${order.id}</td>
        <td>${order.customer}</td>
        <td>${order.product}</td>
        <td>${order.date}</td>
        <td>${window.novaAdminUtils.formatCurrency(order.amount)}</td>
        <td>${order.payment}</td>
        <td><span class="status-pill ${window.novaAdminUtils.statusClass(order.status)}">${order.status}</span></td>
        <td>
          <div class="action-group">
            <button type="button" class="table-button" data-action="view-order" data-id="${order.id}"><i class="fa-solid fa-eye"></i></button>
          </div>
        </td>
      </tr>
    `).join('');

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Orders</h1>
          <p class="page-subtitle">Review order flow, payment status, and fulfillment progress.</p>
        </div>
      </div>

      <div class="card section-card">
        <div class="filters-bar">
          <div class="field-group">
            <label>Payment</label>
            <select data-filter="payment-method">
              <option value="all">All payment methods</option>
              <option value="PayPal">PayPal</option>
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
              <option value="Amex">Amex</option>
            </select>
          </div>
          <div class="field-group">
            <label>Status</label>
            <select data-filter="order-status">
              <option value="all">All statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div class="table-shell">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>${rows || '<tr><td colspan="8"><div class="empty-state">No orders match your filters.</div></td></tr>'}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderCustomersPage() {
    const customers = window.novaAdminStorage.getCustomers();
    const rows = customers.map((customer) => `
      <tr>
        <td>${customer.name}</td>
        <td>${customer.company}</td>
        <td>${customer.email}</td>
        <td>${customer.segment}</td>
        <td><span class="status-pill ${window.novaAdminUtils.statusClass(customer.health)}">${customer.health}</span></td>
        <td>${customer.value}</td>
        <td>${customer.lastOrder}</td>
        <td>
          <div class="action-group">
            <button type="button" class="table-button" data-action="view-customer" data-id="${customer.id}"><i class="fa-solid fa-user"></i></button>
          </div>
        </td>
      </tr>
    `).join('');

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Customers</h1>
          <p class="page-subtitle">Track client relationships, growth, and retention health.</p>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-item"><h4>Total Customers</h4><strong>12.8K</strong><span class="delta-badge delta-positive"><i class="fa-solid fa-arrow-up"></i> +9.4%</span></div>
        <div class="summary-item"><h4>Active Accounts</h4><strong>9.4K</strong><span class="delta-badge delta-positive"><i class="fa-solid fa-arrow-up"></i> +7.1%</span></div>
        <div class="summary-item"><h4>Expansion Rate</h4><strong>22.3%</strong><span class="delta-badge delta-positive"><i class="fa-solid fa-arrow-up"></i> +2.4%</span></div>
        <div class="summary-item"><h4>Churn</h4><strong>1.8%</strong><span class="delta-badge delta-negative"><i class="fa-solid fa-arrow-down"></i> -0.6%</span></div>
      </div>

      <div class="card section-card">
        <div class="table-shell">
          <table class="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Company</th>
                <th>Email</th>
                <th>Segment</th>
                <th>Health</th>
                <th>Value</th>
                <th>Last order</th>
                <th>Profile</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderAnalyticsPage() {
    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Analytics</h1>
          <p class="page-subtitle">Measure performance, revenue trends, and conversion quality.</p>
        </div>
        <div class="page-actions">
          <button type="button" class="button secondary"><i class="fa-solid fa-calendar-days"></i> Last 30 days</button>
          <button type="button" class="button primary"><i class="fa-solid fa-sliders"></i> Filter</button>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-item"><h4>Revenue</h4><strong>$321.2K</strong><span class="delta-badge delta-positive"><i class="fa-solid fa-arrow-up"></i> +18.2%</span></div>
        <div class="summary-item"><h4>Orders</h4><strong>4,980</strong><span class="delta-badge delta-positive"><i class="fa-solid fa-arrow-up"></i> +12.6%</span></div>
        <div class="summary-item"><h4>Customers</h4><strong>2,184</strong><span class="delta-badge delta-positive"><i class="fa-solid fa-arrow-up"></i> +8.9%</span></div>
        <div class="summary-item"><h4>Conversion</h4><strong>6.8%</strong><span class="delta-badge delta-negative"><i class="fa-solid fa-arrow-down"></i> -0.7%</span></div>
      </div>

      <div class="dashboard-grid">
        <div class="panel">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">Revenue trend</h3>
              <div class="panel-subtitle">Quarterly performance</div>
            </div>
          </div>
          <div class="chart-wrap"><div class="chart-box"><canvas id="revenueTrendChart"></canvas></div></div>
        </div>
        <div class="panel">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">Customer growth</h3>
              <div class="panel-subtitle">Monthly active users</div>
            </div>
          </div>
          <div class="chart-wrap"><div class="chart-box"><canvas id="customerGrowthChart"></canvas></div></div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="panel">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">Orders by month</h3>
              <div class="panel-subtitle">Execution timeline</div>
            </div>
          </div>
          <div class="chart-wrap"><div class="chart-box"><canvas id="monthOrdersChart"></canvas></div></div>
        </div>
        <div class="panel">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">Sales by category</h3>
              <div class="panel-subtitle">Segment contribution</div>
            </div>
          </div>
          <div class="chart-wrap"><div class="chart-box"><canvas id="salesCategoryChart"></canvas></div></div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <div>
            <h3 class="panel-title">Traffic sources</h3>
            <div class="panel-subtitle">Acquisition mix</div>
          </div>
        </div>
        <div class="chart-wrap"><div class="chart-box"><canvas id="trafficChart"></canvas></div></div>
      </div>
    `;
  }

  function renderReportsPage() {
    const reports = window.novaAdminData.reports || [];
    const cards = reports.map((report) => `
      <div class="card metric-card">
        <div class="metric-header">
          <span class="metric-label">${report.title}</span>
          <span class="metric-icon"><i class="fa-solid fa-file-lines"></i></span>
        </div>
        <div class="metric-value" style="font-size:1rem; letter-spacing:0;">${report.description}</div>
        <div class="metric-meta">
          <small>${report.updated}</small>
          <div class="action-group">
            <button type="button" class="button secondary" data-action="view-report" data-id="${report.id}">View</button>
            <button type="button" class="button primary" data-action="export-report" data-id="${report.id}">Export</button>
          </div>
        </div>
      </div>
    `).join('');

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Reports</h1>
          <p class="page-subtitle">Structured business intelligence and export-ready reports.</p>
        </div>
      </div>

      <section class="kpi-grid">${cards}</section>
    `;
  }

  function renderNotificationsPage() {
    const notifications = window.novaAdminStorage.getNotifications();
    const rows = notifications.map((notification) => `
      <div class="card metric-card" style="padding:16px 18px;">
        <div class="metric-header">
          <div>
            <span class="badge" style="background: rgba(109,94,252,0.12); color: var(--color-primary);">${notification.type}</span>
          </div>
          <div class="action-group">
            ${notification.unread ? '<button class="button secondary" type="button" data-action="mark-read" data-id="'+notification.id+'">Mark as read</button>' : ''}
            <button class="table-button" type="button" data-action="delete-notification" data-id="'+notification.id+'"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
        <h3 style="margin: 10px 0 6px;">${notification.title}</h3>
        <p style="margin:0; color: var(--color-text-soft);">${notification.message}</p>
        <div class="metric-meta" style="margin-top:12px;">
          <small>${notification.time}</small>
          ${notification.unread ? '<span class="status-pill status-pending">Unread</span>' : '<span class="status-pill status-active">Read</span>'}
        </div>
      </div>
    `).join('');

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Notifications</h1>
          <p class="page-subtitle">Track system, security, payment, and user alerts.</p>
        </div>
        <div class="page-actions">
          <button type="button" class="button secondary" data-action="mark-all-read">Mark all as read</button>
        </div>
      </div>
      <div class="filters-bar">
        <div class="field-group">
          <label>Type</label>
          <select data-filter="notification-type">
            <option value="all">All</option>
            <option value="Order">Order</option>
            <option value="User">User</option>
            <option value="System">System</option>
            <option value="Security">Security</option>
            <option value="Payment">Payment</option>
          </select>
        </div>
      </div>
      <section class="kpi-grid" style="grid-template-columns: repeat(2, minmax(0, 1fr));">${rows || '<div class="empty-state">No notifications available.</div>'}</section>
    `;
  }

  function renderSettingsPage() {
    const settings = window.novaAdminStorage.getSettings();
    const activeTab = appState.settingsTab || 'general';

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Settings</h1>
          <p class="page-subtitle">Customize your workspace and business preferences.</p>
        </div>
      </div>

      <div class="tabs">
        <button type="button" class="tab-button ${activeTab === 'general' ? 'active' : ''}" data-tab="general">General</button>
        <button type="button" class="tab-button ${activeTab === 'appearance' ? 'active' : ''}" data-tab="appearance">Appearance</button>
        <button type="button" class="tab-button ${activeTab === 'notifications' ? 'active' : ''}" data-tab="notifications">Notifications</button>
        <button type="button" class="tab-button ${activeTab === 'security' ? 'active' : ''}" data-tab="security">Security</button>
        <button type="button" class="tab-button ${activeTab === 'billing' ? 'active' : ''}" data-tab="billing">Billing</button>
      </div>

      <form id="settings-form" class="section-card">
        ${activeTab === 'general' ? `
          <div class="form-grid">
            <div class="field-group">
              <label>Company name</label>
              <input name="companyName" value="${settings.companyName || 'NovaAdmin'}" />
            </div>
            <div class="field-group">
              <label>Contact email</label>
              <input name="contactEmail" value="${settings.contactEmail || 'hello@novadash.io'}" />
            </div>
            <div class="field-group">
              <label>Timezone</label>
              <select name="timezone">
                <option ${settings.timezone === 'UTC-05:00' ? 'selected' : ''}>UTC-05:00</option>
                <option ${settings.timezone === 'UTC+00:00' ? 'selected' : ''}>UTC+00:00</option>
                <option ${settings.timezone === 'UTC+01:00' ? 'selected' : ''}>UTC+01:00</option>
              </select>
            </div>
            <div class="field-group">
              <label>Language</label>
              <select name="language">
                <option ${settings.language === 'English' ? 'selected' : ''}>English</option>
                <option ${settings.language === 'Spanish' ? 'selected' : ''}>Spanish</option>
                <option ${settings.language === 'French' ? 'selected' : ''}>French</option>
              </select>
            </div>
            <div class="field-group">
              <label>Currency</label>
              <select name="currency">
                <option ${settings.currency === 'USD' ? 'selected' : ''}>USD</option>
                <option ${settings.currency === 'EUR' ? 'selected' : ''}>EUR</option>
                <option ${settings.currency === 'GBP' ? 'selected' : ''}>GBP</option>
              </select>
            </div>
          </div>
        ` : ''}

        ${activeTab === 'appearance' ? `
          <div class="form-grid">
            <div class="field-group">
              <label>Theme</label>
              <select name="themeMode">
                <option value="dark" ${settings.enableDarkMode ? 'selected' : ''}>Dark</option>
                <option value="light" ${!settings.enableDarkMode ? 'selected' : ''}>Light</option>
              </select>
            </div>
            <div class="field-group">
              <label>Sidebar density</label>
              <select name="compactSidebar">
                <option value="false" ${!settings.compactSidebar ? 'selected' : ''}>Comfortable</option>
                <option value="true" ${settings.compactSidebar ? 'selected' : ''}>Compact</option>
              </select>
            </div>
          </div>
        ` : ''}

        ${activeTab === 'notifications' ? `
          <div class="form-grid">
            <label class="checkbox-wrap"><input type="checkbox" name="emailAlerts" ${settings.emailAlerts ? 'checked' : ''} /> <span>Email alerts</span></label>
            <label class="checkbox-wrap"><input type="checkbox" name="pushAlerts" ${settings.pushAlerts ? 'checked' : ''} /> <span>Push alerts</span></label>
            <label class="checkbox-wrap"><input type="checkbox" name="activityTracking" ${settings.activityTracking ? 'checked' : ''} /> <span>Activity tracking</span></label>
          </div>
        ` : ''}

        ${activeTab === 'security' ? `
          <div class="form-grid">
            <label class="checkbox-wrap"><input type="checkbox" name="twoFactorRequired" ${settings.twoFactorRequired ? 'checked' : ''} /> <span>Require two-factor authentication</span></label>
            <div class="field-group">
              <label>Session timeout</label>
              <select>
                <option>15 minutes</option>
                <option selected>30 minutes</option>
                <option>1 hour</option>
              </select>
            </div>
          </div>
        ` : ''}

        ${activeTab === 'billing' ? `
          <div class="form-grid">
            <div class="field-group">
              <label>Billing plan</label>
              <select name="billingPlan">
                <option ${settings.billingPlan === 'Scale' ? 'selected' : ''}>Scale</option>
                <option ${settings.billingPlan === 'Pro' ? 'selected' : ''}>Pro</option>
                <option ${settings.billingPlan === 'Enterprise' ? 'selected' : ''}>Enterprise</option>
              </select>
            </div>
            <div class="field-group">
              <label>Payment status</label>
              <select name="paymentStatus">
                <option ${settings.paymentStatus === 'Active' ? 'selected' : ''}>Active</option>
                <option ${settings.paymentStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                <option ${settings.paymentStatus === 'Past due' ? 'selected' : ''}>Past due</option>
              </select>
            </div>
          </div>
        ` : ''}

        <div class="modal-actions" style="justify-content:flex-start; margin-top:18px;">
          <button type="button" class="button secondary" data-action="reset-demo-data">Reset demo data</button>
          <button type="button" class="button primary" data-action="save-settings">Save changes</button>
        </div>
      </form>
    `;
  }

  function renderProfilePage() {
    const user = getCurrentUser();
    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Profile</h1>
          <p class="page-subtitle">Your workspace identity and security settings.</p>
        </div>
      </div>

      <div class="profile-layout">
        <aside class="profile-card">
          <div class="profile-hero">
            <div class="profile-avatar">${user.avatar}</div>
            <div>
              <h3>${user.name}</h3>
              <p>${user.role}</p>
            </div>
            <button type="button" class="button secondary">Edit photo</button>
          </div>
          <div class="profile-meta">
            <div>
              <label>Email</label>
              <strong>${user.email}</strong>
            </div>
            <div>
              <label>Location</label>
              <strong>New York, USA</strong>
            </div>
            <div>
              <label>Joined</label>
              <strong>March 31, 2022</strong>
            </div>
            <div>
              <label>Product</label>
              <strong>NovaAdmin</strong>
            </div>
          </div>
        </aside>

        <div class="section-card">
          <div class="group-header">
            <h3>Personal information</h3>
          </div>
          <div class="form-grid">
            <div class="field-group"><label>Name</label><input value="${user.name}" /></div>
            <div class="field-group"><label>Email</label><input value="${user.email}" /></div>
            <div class="field-group"><label>Role</label><input value="${user.role}" /></div>
            <div class="field-group"><label>Location</label><input value="New York, USA" /></div>
          </div>

          <div class="group-header" style="margin-top: 22px;">
            <h3>Password</h3>
          </div>
          <div class="form-grid">
            <div class="field-group"><label>Current password</label><input type="password" value="********" /></div>
            <div class="field-group"><label>New password</label><input type="password" placeholder="New password" /></div>
          </div>

          <div class="group-header" style="margin-top: 22px;">
            <h3>Activity</h3>
          </div>
          <div class="activity-list">
            <div class="activity-item">
              <span class="activity-dot"></span>
              <div><strong>Updated profile</strong><p>Profile details changed 3 hours ago.</p></div>
            </div>
            <div class="activity-item">
              <span class="activity-dot" style="background: var(--color-success);"></span>
              <div><strong>Security check passed</strong><p> MFA verification completed successfully.</p></div>
            </div>
            <div class="activity-item">
              <span class="activity-dot" style="background: var(--color-info);"></span>
              <div><strong>Workspace login</strong><p>Signed in from New York, USA yesterday.</p></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderRoute() {
    const route = getRouteFromHash();
    appState.route = route;
    setActiveNav(route);

    const main = document.getElementById('main-content');
    if (!main) return;

    const rendererMap = {
      dashboard: renderDashboardPage,
      users: renderUsersPage,
      products: renderProductsPage,
      orders: renderOrdersPage,
      customers: renderCustomersPage,
      analytics: renderAnalyticsPage,
      reports: renderReportsPage,
      notifications: renderNotificationsPage,
      settings: renderSettingsPage,
      profile: renderProfilePage
    };

    const page = rendererMap[route] || (() => '<div class="empty-state">Page not found.</div>');
    main.innerHTML = page();

    if (route === 'dashboard') {
      window.novaAdminCharts.renderLineChart('revenueOverviewChart', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], [14, 18, 17, 22, 21, 27, 29, 34], [9, 13, 12, 16, 15, 17, 18, 20]);
      window.novaAdminCharts.renderBarChart('salesOverviewChart', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], [12, 15, 14, 18, 22, 20, 27, 26], '#8b5cf6');
      window.novaAdminCharts.renderDoughnutChart('categoryBreakdownChart', ['Software', 'CRM', 'Analytics', 'E-commerce'], [35, 28, 22, 15], ['#6d5efc', '#8b5cf6', '#60a5fa', '#34d399']);
    }

    if (route === 'analytics') {
      window.novaAdminCharts.renderLineChart('revenueTrendChart', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], [23, 26, 24, 31, 28, 35, 38, 42], [17, 19, 18, 22, 20, 26, 24, 28]);
      window.novaAdminCharts.renderBarChart('customerGrowthChart', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], [11, 13, 17, 15, 18, 21, 25, 27], '#38bdf8');
      window.novaAdminCharts.renderBarChart('monthOrdersChart', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], [420, 460, 510, 540, 620, 680, 710, 770], '#34d399');
      window.novaAdminCharts.renderDoughnutChart('salesCategoryChart', ['Software', 'CRM', 'Analytics', 'E-commerce'], [44, 27, 18, 11], ['#6d5efc', '#22c55e', '#38bdf8', '#fbbf24']);
      window.novaAdminCharts.renderRadarChart('trafficChart', ['Organic', 'Paid', 'Referral', 'Direct', 'Social', 'Email'], [75, 62, 54, 84, 60, 70]);
    }

    updateHeaderUser();
  }

  function renderUserModal(user = null) {
    const modalContent = `
      <div class="modal-backdrop show">
        <div class="modal-dialog" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3>${user ? 'Edit User' : 'Add User'}</h3>
            <button class="icon-button close-modal" type="button" aria-label="Close dialog"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <form id="user-form" class="modal-body">
            <div class="form-grid">
              <div class="field-group">
                <label>Name</label>
                <input name="name" value="${user ? user.name : ''}" required />
              </div>
              <div class="field-group">
                <label>Email</label>
                <input type="email" name="email" value="${user ? user.email : ''}" required />
              </div>
              <div class="field-group">
                <label>Role</label>
                <select name="role">
                  <option value="Admin" ${user && user.role === 'Admin' ? 'selected' : ''}>Admin</option>
                  <option value="Manager" ${user && user.role === 'Manager' ? 'selected' : ''}>Manager</option>
                  <option value="User" ${user && user.role === 'User' ? 'selected' : ''}>User</option>
                </select>
              </div>
              <div class="field-group">
                <label>Status</label>
                <select name="status">
                  <option value="Active" ${user && user.status === 'Active' ? 'selected' : ''}>Active</option>
                  <option value="Pending" ${user && user.status === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option value="Suspended" ${user && user.status === 'Suspended' ? 'selected' : ''}>Suspended</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="button secondary close-modal">Cancel</button>
              <button type="submit" class="button primary">${user ? 'Save changes' : 'Create user'}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    window.novaAdminUtils.openModal(modalContent);

    const modal = document.getElementById('modal-root');
    modal.querySelectorAll('.close-modal').forEach((button) => {
      button.addEventListener('click', () => window.novaAdminUtils.closeModal());
    });

    const form = document.getElementById('user-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const nextUser = {
        id: user ? user.id : Date.now(),
        name: formData.get('name').toString().trim(),
        email: formData.get('email').toString().trim(),
        role: formData.get('role'),
        status: formData.get('status'),
        joined: user ? user.joined : new Date().toISOString().slice(0, 10),
        lastSeen: 'Now'
      };

      const users = window.novaAdminStorage.getUsers();
      const targetIndex = users.findIndex((item) => item.id === nextUser.id);
      if (targetIndex >= 0) {
        users[targetIndex] = { ...users[targetIndex], ...nextUser };
      } else {
        users.unshift(nextUser);
      }

      window.novaAdminStorage.setUsers(users);
      window.novaAdminUtils.closeModal();
      renderRoute();
      window.novaAdminUtils.showToast(user ? 'User updated.' : 'User created.', 'success');
    });
  }

  function renderProductModal(product = null) {
    const modalContent = `
      <div class="modal-backdrop show">
        <div class="modal-dialog" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3>${product ? 'Edit Product' : 'Add Product'}</h3>
            <button class="icon-button close-modal" type="button" aria-label="Close dialog"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <form id="product-form" class="modal-body">
            <div class="form-grid">
              <div class="field-group">
                <label>Product name</label>
                <input name="name" value="${product ? product.name : ''}" required />
              </div>
              <div class="field-group">
                <label>SKU</label>
                <input name="sku" value="${product ? product.sku : ''}" required />
              </div>
              <div class="field-group">
                <label>Category</label>
                <select name="category">
                  <option value="Software" ${product && product.category === 'Software' ? 'selected' : ''}>Software</option>
                  <option value="CRM" ${product && product.category === 'CRM' ? 'selected' : ''}>CRM</option>
                  <option value="Analytics" ${product && product.category === 'Analytics' ? 'selected' : ''}>Analytics</option>
                  <option value="Inventory" ${product && product.category === 'Inventory' ? 'selected' : ''}>Inventory</option>
                  <option value="E-commerce" ${product && product.category === 'E-commerce' ? 'selected' : ''}>E-commerce</option>
                </select>
              </div>
              <div class="field-group">
                <label>Status</label>
                <select name="status">
                  <option value="Active" ${product && product.status === 'Active' ? 'selected' : ''}>Active</option>
                  <option value="Low Stock" ${product && product.status === 'Low Stock' ? 'selected' : ''}>Low Stock</option>
                </select>
              </div>
              <div class="field-group">
                <label>Price</label>
                <input type="number" min="0" name="price" value="${product ? product.price : 0}" required />
              </div>
              <div class="field-group">
                <label>Stock</label>
                <input type="number" min="0" name="stock" value="${product ? product.stock : 0}" required />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="button secondary close-modal">Cancel</button>
              <button type="submit" class="button primary">${product ? 'Save Product' : 'Create Product'}</button>
            </div>
          </form>
        </div>
      </div>
    `;

    window.novaAdminUtils.openModal(modalContent);
    const modal = document.getElementById('modal-root');
    modal.querySelectorAll('.close-modal').forEach((button) => button.addEventListener('click', () => window.novaAdminUtils.closeModal()));

    const form = document.getElementById('product-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const nextProduct = {
        id: product ? product.id : Date.now(),
        name: formData.get('name').toString().trim(),
        sku: formData.get('sku').toString().trim(),
        category: formData.get('category'),
        price: window.novaAdminUtils.safeNumber(formData.get('price')),
        stock: window.novaAdminUtils.safeNumber(formData.get('stock')),
        status: formData.get('status'),
        image: (formData.get('name').toString().trim().split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()) || 'NP'
      };

      const products = window.novaAdminStorage.getProducts();
      const targetIndex = products.findIndex((item) => item.id === nextProduct.id);
      if (targetIndex >= 0) {
        products[targetIndex] = { ...products[targetIndex], ...nextProduct };
      } else {
        products.unshift(nextProduct);
      }

      window.novaAdminStorage.setProducts(products);
      window.novaAdminUtils.closeModal();
      renderRoute();
      window.novaAdminUtils.showToast(product ? 'Product updated.' : 'Product created.', 'success');
    });
  }

  function handleStandardAction(action, id) {
    const users = window.novaAdminStorage.getUsers();
    const products = window.novaAdminStorage.getProducts();
    const notifications = window.novaAdminStorage.getNotifications();

    switch (action) {
      case 'add-user':
        renderUserModal();
        break;
      case 'edit-user': {
        const user = users.find((item) => item.id === Number(id));
        if (user) renderUserModal(user);
        break;
      }
      case 'delete-user': {
        const user = users.find((item) => item.id === Number(id));
        if (!user) return;
        window.novaAdminUtils.confirmAction('Delete user', `Remove ${user.name} from the workspace?`, () => {
          const updated = users.filter((item) => item.id !== Number(id));
          window.novaAdminStorage.setUsers(updated);
          renderRoute();
          window.novaAdminUtils.showToast('User deleted.', 'success');
        });
        break;
      }
      case 'add-product':
        renderProductModal();
        break;
      case 'edit-product': {
        const product = products.find((item) => item.id === Number(id));
        if (product) renderProductModal(product);
        break;
      }
      case 'delete-product': {
        const product = products.find((item) => item.id === Number(id));
        if (!product) return;
        window.novaAdminUtils.confirmAction('Delete product', `Delete ${product.name}?`, () => {
          const updated = products.filter((item) => item.id !== Number(id));
          window.novaAdminStorage.setProducts(updated);
          renderRoute();
          window.novaAdminUtils.showToast('Product deleted.', 'success');
        });
        break;
      }
      case 'view-order': {
        const order = window.novaAdminStorage.getOrders().find((item) => item.id === id);
        if (!order) return;
        window.novaAdminUtils.openModal(`
          <div class="modal-backdrop show">
            <div class="modal-dialog small" role="dialog" aria-modal="true">
              <div class="modal-header">
                <h3>${order.id}</h3>
                <button class="icon-button close-modal" type="button"><i class="fa-solid fa-xmark"></i></button>
              </div>
              <div class="modal-body">
                <div class="form-grid">
                  <div class="field-group"><label>Customer</label><input value="${order.customer}" /></div>
                  <div class="field-group"><label>Product</label><input value="${order.product}" /></div>
                  <div class="field-group"><label>Date</label><input value="${order.date}" /></div>
                  <div class="field-group"><label>Amount</label><input value="${window.novaAdminUtils.formatCurrency(order.amount)}" /></div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="button primary close-modal">Close</button>
              </div>
            </div>
          </div>
        `);
        document.querySelectorAll('.close-modal').forEach((button) => button.addEventListener('click', () => window.novaAdminUtils.closeModal()));
        break;
      }
      case 'view-customer': {
        const customer = window.novaAdminStorage.getCustomers().find((item) => item.id === Number(id));
        if (!customer) return;
        window.novaAdminUtils.openModal(`
          <div class="modal-backdrop show">
            <div class="modal-dialog" role="dialog" aria-modal="true">
              <div class="modal-header">
                <h3>${customer.name}</h3>
                <button class="icon-button close-modal" type="button"><i class="fa-solid fa-xmark"></i></button>
              </div>
              <div class="modal-body">
                <div class="form-grid">
                  <div class="field-group"><label>Company</label><input value="${customer.company}" /></div>
                  <div class="field-group"><label>Email</label><input value="${customer.email}" /></div>
                  <div class="field-group"><label>Health</label><input value="${customer.health}" /></div>
                  <div class="field-group"><label>Value</label><input value="${customer.value}" /></div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="button primary close-modal">Close</button>
              </div>
            </div>
          </div>
        `);
        document.querySelectorAll('.close-modal').forEach((button) => button.addEventListener('click', () => window.novaAdminUtils.closeModal()));
        break;
      }
      case 'view-report': {
        const report = (window.novaAdminData.reports || []).find((item) => item.id === id);
        if (!report) return;
        window.novaAdminUtils.showToast(`Previewing ${report.title}.`, 'success');
        break;
      }
      case 'export-report': {
        const report = (window.novaAdminData.reports || []).find((item) => item.id === id);
        if (!report) return;
        const rows = [
          ['Title', 'Description', 'Updated'],
          [report.title, report.description, report.updated]
        ];
        const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `${report.title.toLowerCase().replace(/\s+/g, '-')}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        window.novaAdminUtils.showToast('Report exported as CSV.', 'success');
        break;
      }
      case 'mark-read': {
        const updated = notifications.map((item) => item.id === Number(id) ? { ...item, unread: false } : item);
        window.novaAdminStorage.setNotifications(updated);
        renderRoute();
        window.novaAdminUtils.showToast('Notification marked as read.', 'success');
        break;
      }
      case 'delete-notification': {
        const updated = notifications.filter((item) => item.id !== Number(id));
        window.novaAdminStorage.setNotifications(updated);
        renderRoute();
        break;
      }
      case 'mark-all-read': {
        const updated = notifications.map((item) => ({ ...item, unread: false }));
        window.novaAdminStorage.setNotifications(updated);
        renderRoute();
        window.novaAdminUtils.showToast('All notifications marked as read.', 'success');
        break;
      }
      case 'select-all-users': {
        document.querySelectorAll('#select-all-checkbox, [data-action="select-user"]').forEach((box) => {
          if (box.matches('#select-all-checkbox')) {
            box.checked = !box.checked;
          } else {
            box.checked = true;
          }
        });
        break;
      }
      case 'bulk-status-user': {
        const activeBoxes = Array.from(document.querySelectorAll('[data-action="select-user"]:checked'));
        if (!activeBoxes.length) {
          window.novaAdminUtils.showToast('Select at least one user first.', 'error');
          break;
        }
        const selectedIds = activeBoxes.map((box) => Number(box.dataset.id));
        const updatedUsers = users.map((user) => selectedIds.includes(user.id) ? { ...user, status: 'Active' } : user);
        window.novaAdminStorage.setUsers(updatedUsers);
        renderRoute();
        window.novaAdminUtils.showToast('Selected users activated.', 'success');
        break;
      }
      case 'save-settings': {
        const settings = window.novaAdminStorage.getSettings();
        const form = document.getElementById('settings-form');
        if (!form) return;
        const formData = new FormData(form);
        const nextSettings = { ...settings };
        if (formData.has('companyName')) nextSettings.companyName = formData.get('companyName');
        if (formData.has('contactEmail')) nextSettings.contactEmail = formData.get('contactEmail');
        if (formData.has('timezone')) nextSettings.timezone = formData.get('timezone');
        if (formData.has('language')) nextSettings.language = formData.get('language');
        if (formData.has('currency')) nextSettings.currency = formData.get('currency');
        if (formData.has('themeMode')) nextSettings.enableDarkMode = formData.get('themeMode') === 'dark';
        if (formData.has('compactSidebar')) nextSettings.compactSidebar = formData.get('compactSidebar') === 'true';
        if (formData.has('emailAlerts')) nextSettings.emailAlerts = formData.get('emailAlerts') !== null;
        if (formData.has('pushAlerts')) nextSettings.pushAlerts = formData.get('pushAlerts') !== null;
        if (formData.has('activityTracking')) nextSettings.activityTracking = formData.get('activityTracking') !== null;
        if (formData.has('twoFactorRequired')) nextSettings.twoFactorRequired = formData.get('twoFactorRequired') !== null;
        if (formData.has('billingPlan')) nextSettings.billingPlan = formData.get('billingPlan');
        if (formData.has('paymentStatus')) nextSettings.paymentStatus = formData.get('paymentStatus');
        window.novaAdminStorage.setSettings(nextSettings);
        if (nextSettings.enableDarkMode) {
          applyTheme('dark');
        } else {
          applyTheme('light');
        }
        window.novaAdminUtils.showToast('Settings saved.', 'success');
        break;
      }
      case 'reset-demo-data': {
        window.novaAdminStorage.resetDemoData();
        renderRoute();
        window.novaAdminUtils.showToast('Demo data restored.', 'success');
        break;
      }
      default:
        break;
    }
  }

  function bindGlobalEvents() {
    document.addEventListener('submit', (event) => {
      const form = event.target;
      if (!(form instanceof HTMLElement)) return;
      if (form.id === 'settings-form') {
        event.preventDefault();
        handleStandardAction('save-settings');
      }
    });

    document.addEventListener('click', (event) => {
      const target = event.target.closest('[data-action]');
      if (!target) return;
      const { action, id } = target.dataset;
      handleStandardAction(action, id);
    });

    document.addEventListener('click', (event) => {
      const button = event.target.closest('.nav-item');
      if (button) {
        const route = button.dataset.route;
        if (route) {
          window.location.hash = '#/' + route;
        }
      }
    });

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('#user-menu-button');
      if (trigger) {
        const menu = document.getElementById('user-menu-dropdown');
        if (menu) menu.classList.toggle('hidden');
      }
      if (!event.target.closest('#user-menu-dropdown') && !event.target.closest('#user-menu-button')) {
        const menu = document.getElementById('user-menu-dropdown');
        if (menu) menu.classList.add('hidden');
      }
    });

    document.addEventListener('click', (event) => {
      const logoutTrigger = event.target.closest('#logout-btn, #sidebar-logout-btn');
      if (!logoutTrigger) return;
      window.novaAdminStorage.logout();
      window.location.href = 'login.html';
    });

    document.addEventListener('click', (event) => {
      const tab = event.target.closest('[data-tab]');
      if (!tab) return;
      appState.settingsTab = tab.dataset.tab;
      renderRoute();
    });

    document.addEventListener('change', (event) => {
      const filter = event.target.dataset.filter;
      if (!filter) return;
      const selectValue = event.target.value;
      if (filter === 'status' || filter === 'role') {
        const filteredUsers = window.novaAdminStorage.getUsers().filter((user) => {
          const matchesStatus = filter === 'status' ? selectValue === 'all' || user.status === selectValue : true;
          const matchesRole = filter === 'role' ? selectValue === 'all' || user.role === selectValue : true;
          return matchesStatus && matchesRole;
        });
        const tableBody = document.querySelector('.usermanagement-table tbody');
        if (!tableBody) return;
        tableBody.innerHTML = filteredUsers.map((user) => `
          <tr>
            <td class="checkbox-cell"><input type="checkbox" data-action="select-user" data-id="${user.id}" /></td>
            <td><div class="product-cell"><span class="user-avatar small">${window.novaAdminUtils.initialsFromName(user.name)}</span><span>${user.name}</span></div></td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><span class="status-pill ${window.novaAdminUtils.statusClass(user.status)}">${user.status}</span></td>
            <td>${user.joined}</td>
            <td><div class="action-group"><button type="button" class="table-button" data-action="edit-user" data-id="${user.id}"><i class="fa-solid fa-pen"></i></button><button type="button" class="table-button" data-action="delete-user" data-id="${user.id}"><i class="fa-solid fa-trash"></i></button></div></td>
          </tr>
        `).join('') || '<tr><td colspan="7"><div class="empty-state">No users match your filter.</div></td></tr>';
      }
    });

    document.addEventListener('input', (event) => {
      if (event.target.id === 'global-search') {
        appState.globalSearch = event.target.value;
        renderRoute();
      }
    });

    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      const nextTheme = document.body.classList.contains('theme-light') ? 'dark' : 'light';
      applyTheme(nextTheme);
    });

    document.getElementById('sidebar-toggle')?.addEventListener('click', function () {
      document.getElementById('sidebar').classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
      if (window.innerWidth <= 960 && document.getElementById('sidebar') && !event.target.closest('.sidebar') && !event.target.closest('#sidebar-toggle')) {
        document.getElementById('sidebar').classList.remove('open');
      }
    });

    document.querySelectorAll('.nav-item').forEach((link) => {
      link.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('open');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.novaAdminStorage.isAuthenticated()) {
      window.location.href = 'login.html';
      return;
    }

    const initialTheme = window.novaAdminStorage.getTheme();
    applyTheme(initialTheme);
    bindGlobalEvents();
    updateHeaderUser();
    renderRoute();

    window.addEventListener('hashchange', renderRoute);
  });
})();
