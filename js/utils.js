(function () {
  const formatCurrency = (value) => {
    const numeric = Number(value) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(numeric);
  };

  const formatCompactNumber = (value) => {
    const num = Number(value) || 0;
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
  };

  const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));

  const initialsFromName = (name) => {
    if (!name) return 'NA';
    return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  };

  const statusClass = (status) => {
    const map = {
      Active: 'status-active',
      Completed: 'status-completed',
      Pending: 'status-pending',
      Processing: 'status-processing',
      Suspended: 'status-suspended',
      Cancelled: 'status-cancelled',
      'Low Stock': 'status-low',
      'High': 'status-active',
      'Medium': 'status-pending',
      'Low': 'status-suspended'
    };

    return map[status] || 'status-default';
  };

  const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon"><i class="fa-solid ${type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check'}"></i></div>
      <div class="toast-text">${escapeHtml(message)}</div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 20);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2600);
  };

  const confirmAction = (title, message, onConfirm) => {
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="modal-backdrop show">
        <div class="modal-dialog confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div class="modal-header">
            <h3 id="confirm-title">${escapeHtml(title)}</h3>
            <button class="icon-button close-modal" type="button" aria-label="Close dialog">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>${escapeHtml(message)}</p>
          </div>
          <div class="modal-actions">
            <button type="button" class="button secondary cancel-action">Cancel</button>
            <button type="button" class="button danger confirm-action-btn">Confirm</button>
          </div>
        </div>
      </div>
    `;

    modalRoot.querySelector('.cancel-action').addEventListener('click', () => modalRoot.innerHTML = '');
    modalRoot.querySelector('.close-modal').addEventListener('click', () => modalRoot.innerHTML = '');
    modalRoot.querySelector('.confirm-action-btn').addEventListener('click', () => {
      modalRoot.innerHTML = '';
      onConfirm && onConfirm();
    });
  };

  const openModal = (content) => {
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;
    modalRoot.innerHTML = content;
  };

  const closeModal = () => {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) modalRoot.innerHTML = '';
  };

  const paginate = (items, page, pageSize) => {
    const startIndex = (page - 1) * pageSize;
    return {
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
      totalItems: items.length,
      data: items.slice(startIndex, startIndex + pageSize)
    };
  };

  const buildPaginationMarkup = (totalPages, currentPage, onPageChange) => {
    const pages = [];
    for (let page = 1; page <= totalPages; page += 1) {
      pages.push(`<button type="button" class="pagination-btn ${page === currentPage ? 'active' : ''}" data-page="${page}">${page}</button>`);
    }

    return `
      <div class="pagination">
        <button type="button" class="pagination-btn" data-page="${Math.max(1, currentPage - 1)}">Prev</button>
        ${pages.join('')}
        <button type="button" class="pagination-btn" data-page="${Math.min(totalPages, currentPage + 1)}">Next</button>
      </div>
    `;
  };

  const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;

  const safeNumber = (value) => Number(value) || 0;

  window.novaAdminUtils = {
    formatCurrency,
    formatCompactNumber,
    escapeHtml,
    initialsFromName,
    statusClass,
    showToast,
    confirmAction,
    openModal,
    closeModal,
    paginate,
    buildPaginationMarkup,
    generateId,
    safeNumber
  };
})();
