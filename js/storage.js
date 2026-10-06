(function () {
  const keys = {
    auth: 'novaadmin-auth',
    theme: 'novaadmin-theme',
    users: 'novaadmin-users',
    products: 'novaadmin-products',
    orders: 'novaadmin-orders',
    customers: 'novaadmin-customers',
    notifications: 'novaadmin-notifications',
    settings: 'novaadmin-settings',
    profile: 'novaadmin-profile'
  };

  function readValue(key, fallback) {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeValue(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  function seedDefaults() {
    if (!readValue(keys.auth, null)) {
      writeValue(keys.auth, false);
    }

    if (!readValue(keys.theme, null)) {
      writeValue(keys.theme, 'dark');
    }

    if (!readValue(keys.users, null)) {
      writeValue(keys.users, window.novaAdminData.users || []);
    }

    if (!readValue(keys.products, null)) {
      writeValue(keys.products, window.novaAdminData.products || []);
    }

    if (!readValue(keys.orders, null)) {
      writeValue(keys.orders, window.novaAdminData.orders || []);
    }

    if (!readValue(keys.customers, null)) {
      writeValue(keys.customers, window.novaAdminData.customers || []);
    }

    if (!readValue(keys.notifications, null)) {
      writeValue(keys.notifications, window.novaAdminData.notifications || []);
    }

    if (!readValue(keys.settings, null)) {
      writeValue(keys.settings, window.novaAdminData.settings || {});
    }

    if (!readValue(keys.profile, null)) {
      writeValue(keys.profile, window.novaAdminData.profile || {});
    }
  }

  function resetDemoData() {
    writeValue(keys.users, window.novaAdminData.users || []);
    writeValue(keys.products, window.novaAdminData.products || []);
    writeValue(keys.orders, window.novaAdminData.orders || []);
    writeValue(keys.customers, window.novaAdminData.customers || []);
    writeValue(keys.notifications, window.novaAdminData.notifications || []);
    writeValue(keys.settings, window.novaAdminData.settings || {});
    writeValue(keys.profile, window.novaAdminData.profile || {});
    return true;
  }

  const api = {
    keys,
    readValue,
    writeValue,
    seedDefaults,
    resetDemoData,
    getUsers: () => readValue(keys.users, window.novaAdminData.users || []),
    setUsers: (users) => writeValue(keys.users, users),
    getProducts: () => readValue(keys.products, window.novaAdminData.products || []),
    setProducts: (products) => writeValue(keys.products, products),
    getOrders: () => readValue(keys.orders, window.novaAdminData.orders || []),
    setOrders: (orders) => writeValue(keys.orders, orders),
    getCustomers: () => readValue(keys.customers, window.novaAdminData.customers || []),
    setCustomers: (customers) => writeValue(keys.customers, customers),
    getNotifications: () => readValue(keys.notifications, window.novaAdminData.notifications || []),
    setNotifications: (notifications) => writeValue(keys.notifications, notifications),
    getSettings: () => readValue(keys.settings, window.novaAdminData.settings || {}),
    setSettings: (settings) => writeValue(keys.settings, settings),
    getProfile: () => readValue(keys.profile, window.novaAdminData.profile || {}),
    setProfile: (profile) => writeValue(keys.profile, profile),
    getTheme: () => readValue(keys.theme, 'dark'),
    setTheme: (theme) => writeValue(keys.theme, theme),
    isAuthenticated: () => !!readValue(keys.auth, false),
    login: (user) => {
      writeValue(keys.auth, true);
      writeValue(keys.profile, user || window.novaAdminData.profile);
    },
    logout: () => writeValue(keys.auth, false),
    clearAll: () => {
      Object.keys(keys).forEach((key) => window.localStorage.removeItem(keys[key]));
      seedDefaults();
    }
  };

  window.novaAdminStorage = api;
  seedDefaults();
})();
