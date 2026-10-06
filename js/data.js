(function () {
  const demoUsers = [
    { id: 1, name: 'Alicia Morgan', email: 'alicia@novadash.io', role: 'Admin', status: 'Active', joined: '2023-01-18', lastSeen: '2 hours ago' },
    { id: 2, name: 'Samuel Reed', email: 'samuel@novadash.io', role: 'Manager', status: 'Active', joined: '2022-11-06', lastSeen: '12 minutes ago' },
    { id: 3, name: 'Priya Shah', email: 'priya@novadash.io', role: 'User', status: 'Pending', joined: '2024-03-02', lastSeen: '1 day ago' },
    { id: 4, name: 'Darius Lee', email: 'darius@northstar.co', role: 'User', status: 'Suspended', joined: '2021-09-15', lastSeen: '3 weeks ago' },
    { id: 5, name: 'Maya Chen', email: 'maya@brightwork.io', role: 'Manager', status: 'Active', joined: '2023-06-21', lastSeen: '42 minutes ago' },
    { id: 6, name: 'Lucas Brown', email: 'lucas@frostlane.io', role: 'User', status: 'Active', joined: '2024-02-11', lastSeen: '5 hours ago' },
    { id: 7, name: 'Naomi Patel', email: 'naomi@meridianlabs.ai', role: 'User', status: 'Pending', joined: '2024-01-04', lastSeen: 'Yesterday' },
    { id: 8, name: 'Oliver Scott', email: 'oliver@skylinehq.com', role: 'Admin', status: 'Active', joined: '2022-05-10', lastSeen: 'Now' }
  ];

  const demoProducts = [
    { id: 1, name: 'Nova Pro Suite', sku: 'NPS-2041', category: 'Software', price: 249, stock: 82, status: 'Active', image: 'NP' },
    { id: 2, name: 'Pulse CRM', sku: 'PCR-4412', category: 'CRM', price: 189, stock: 43, status: 'Low Stock', image: 'PC' },
    { id: 3, name: 'Northstar Analytics', sku: 'NTA-9910', category: 'Analytics', price: 329, stock: 12, status: 'Active', image: 'NA' },
    { id: 4, name: 'Helio Commerce', sku: 'HLC-2450', category: 'E-commerce', price: 410, stock: 70, status: 'Active', image: 'HC' },
    { id: 5, name: 'Orbit Inventory', sku: 'ORI-7194', category: 'Inventory', price: 260, stock: 9, status: 'Low Stock', image: 'OI' },
    { id: 6, name: 'Signal Board', sku: 'SIG-5518', category: 'Project', price: 139, stock: 156, status: 'Active', image: 'SB' }
  ];

  const demoOrders = [
    { id: 'INV-1048', customer: 'Alicia Morgan', product: 'Nova Pro Suite', date: '2026-10-01', amount: 2490, payment: 'Visa ••• 8942', status: 'Completed' },
    { id: 'INV-1049', customer: 'Maya Chen', product: 'Pulse CRM', date: '2026-10-02', amount: 1680, payment: 'PayPal', status: 'Pending' },
    { id: 'INV-1050', customer: 'Oliver Scott', product: 'Helio Commerce', date: '2026-10-03', amount: 3240, payment: 'Bank Transfer', status: 'Processing' },
    { id: 'INV-1051', customer: 'Samuel Reed', product: 'Orbit Inventory', date: '2026-10-04', amount: 780, payment: 'Mastercard ••• 0124', status: 'Completed' },
    { id: 'INV-1052', customer: 'Priya Shah', product: 'Signal Board', date: '2026-10-05', amount: 620, payment: 'Visa ••• 7743', status: 'Cancelled' },
    { id: 'INV-1053', customer: 'Lucas Brown', product: 'Northstar Analytics', date: '2026-10-05', amount: 1980, payment: 'Amex ••• 3001', status: 'Pending' },
    { id: 'INV-1054', customer: 'Naomi Patel', product: 'Pulse CRM', date: '2026-10-06', amount: 1340, payment: 'PayPal', status: 'Processing' }
  ];

  const demoCustomers = [
    { id: 1, name: 'Harper Williams', company: 'Harbor Labs', email: 'harper@harborlabs.com', segment: 'Enterprise', health: 'High', value: '$42.3K', lastOrder: '2026-09-28' },
    { id: 2, name: 'Leo Martinez', company: 'Summit Works', email: 'leo@summitworks.io', segment: 'SMB', health: 'Medium', value: '$18.5K', lastOrder: '2026-09-24' },
    { id: 3, name: 'Grace Kim', company: 'Bramble Studio', email: 'grace@bramble.studio', segment: 'Agency', health: 'High', value: '$28.1K', lastOrder: '2026-09-21' },
    { id: 4, name: 'Victor Hughes', company: 'Northpeak', email: 'victor@northpeak.co', segment: 'Startup', health: 'Low', value: '$7.4K', lastOrder: '2026-08-15' },
    { id: 5, name: 'Elena Petrov', company: 'Atlas Digital', email: 'elena@atlasdigital.ai', segment: 'Enterprise', health: 'High', value: '$53.8K', lastOrder: '2026-09-29' }
  ];

  const demoNotifications = [
    { id: 1, type: 'Order', title: 'New enterprise order received', message: 'A new order has been placed for Helio Commerce by Northpeak.', time: '2 min ago', unread: true },
    { id: 2, type: 'User', title: 'New team member invited', message: 'Priya Shah was added to the operations workspace.', time: '19 min ago', unread: true },
    { id: 3, type: 'System', title: 'Backup completed successfully', message: 'The nightly backup finished without errors.', time: '3 hours ago', unread: false },
    { id: 4, type: 'Security', title: 'Two-factor setup reminder', message: 'Three admins still have not enabled MFA.', time: '1 day ago', unread: true },
    { id: 5, type: 'Payment', title: 'Payout batch scheduled', message: 'The weekly payouts are scheduled for Friday.', time: '2 days ago', unread: false }
  ];

  const demoReports = [
    { id: 'sales', title: 'Sales Report', description: 'Performance overview for the current sales cycle.', updated: 'Updated 2 hours ago' },
    { id: 'revenue', title: 'Revenue Report', description: 'Revenue and margins by product channel.', updated: 'Updated today' },
    { id: 'customer', title: 'Customer Report', description: 'Retention, churn, and customer health snapshots.', updated: 'Updated 5 hours ago' },
    { id: 'product', title: 'Product Report', description: 'Stock movement, demand, and margin trends.', updated: 'Updated yesterday' },
    { id: 'performance', title: 'Performance Report', description: 'Team and operational efficiency analysis.', updated: 'Updated 1 day ago' }
  ];

  const dashboardMetrics = [
    { label: 'Total Revenue', value: '$128,430', delta: '+12.8%', positive: true, text: 'vs last month' },
    { label: 'Total Orders', value: '2,846', delta: '+8.4%', positive: true, text: 'vs last month' },
    { label: 'Customers', value: '18,324', delta: '+4.1%', positive: true, text: 'vs last month' },
    { label: 'Conversion Rate', value: '6.42%', delta: '-1.3%', positive: false, text: 'vs last month' }
  ];

  const defaultSettings = {
    companyName: 'NovaAdmin',
    contactEmail: 'hello@novadash.io',
    timezone: 'UTC-05:00',
    language: 'English',
    currency: 'USD',
    enableDarkMode: true,
    compactSidebar: false,
    emailAlerts: true,
    pushAlerts: true,
    activityTracking: true,
    twoFactorRequired: true,
    billingPlan: 'Scale',
    paymentStatus: 'Active'
  };

  const userProfile = {
    name: 'Alicia Morgan',
    email: 'admin@example.com',
    role: 'Product Lead',
    location: 'New York, USA',
    joined: 'March 31, 2022',
    avatar: 'AM'
  };

  window.novaAdminData = {
    users: demoUsers,
    products: demoProducts,
    orders: demoOrders,
    customers: demoCustomers,
    notifications: demoNotifications,
    reports: demoReports,
    metrics: dashboardMetrics,
    settings: defaultSettings,
    profile: userProfile,
    adminCredentials: {
      email: 'admin@example.com',
      password: 'admin123'
    }
  };
})();
