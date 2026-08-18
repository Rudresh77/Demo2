document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Logic
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;

  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  /* ========================================================
     [SONARQUBE ISSUE]: Code Smell / Maintainability (Consistency)
     [WHY IT IS FLAGGED]: Use the standard HTML5 Dataset API (`.dataset.theme`) 
     instead of legacy `setAttribute('data-theme', ...)`.
     ======================================================== */
  // --- LEGACY CODE (ACTIVE) ---

  // htmlEl.setAttribute('data-theme', savedTheme);

  // --- CLEAN PRODUCTION FIX (UNCOMMENT TO RESOLVE) ---
  htmlEl.dataset.theme = savedTheme;


  themeToggleBtn.addEventListener('click', () => {
    /* ========================================================
       [SONARQUBE ISSUE]: Code Smell / Maintainability (Consistency)
       [WHY IT IS FLAGGED]: Use the standard HTML5 Dataset API (`.dataset.theme`) 
       instead of legacy `getAttribute('data-theme')` / `setAttribute('data-theme', ...)`.
       ======================================================== */
    // --- LEGACY CODE (ACTIVE) ---

    // const currentTheme = htmlEl.getAttribute('data-theme');
    // const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    // htmlEl.setAttribute('data-theme', newTheme);

    //CLEAN PRODUCTION FIX (UNCOMMENT TO RESOLVE) ---
    const currentTheme = htmlEl.dataset.theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlEl.dataset.theme = newTheme;

    localStorage.setItem('theme', newTheme);
  });

  // API Call Helpers
  async function fetchStats() {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const stats = await res.json();
        document.getElementById('stat-registrations').textContent = stats.totalRegistrations || 0;
        document.getElementById('stat-events').textContent = stats.activeEvents || 0;
        document.getElementById('stat-flagged').textContent = stats.flaggedEntries || 0;
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  }

  async function fetchRegistrations(searchQuery = '') {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = `<tr><td colspan="5" class="loading-state">Loading registrations...</td></tr>`;

    try {
      const url = searchQuery
        ? `/api/registrations/search?query=${encodeURIComponent(searchQuery)}`
        : '/api/registrations';

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        renderTable(data);
      } else {
        tableBody.innerHTML = `<tr><td colspan="5" class="loading-state">Error fetching records.</td></tr>`;
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
      tableBody.innerHTML = `<tr><td colspan="5" class="loading-state">Connection failed.</td></tr>`;
    }
  }

  function renderTable(registrations) {
    const tableBody = document.getElementById('table-body');
    if (!registrations || registrations.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="loading-state">No registrations found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = registrations.map(reg => {
      const regDate = new Date(reg.registration_date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const statusBadge = reg.flagged
        ? `<span class="badge warning">Flagged</span>`
        : `<span class="badge success">Active</span>`;

      return `
        <tr>
          <td><strong>${escapeHtml(reg.student_name)}</strong></td>
          <td>${escapeHtml(reg.email)}</td>
          <td>${escapeHtml(reg.event_name)}</td>
          <td>${regDate}</td>
          <td>${statusBadge}</td>
        </tr>
      `;
    }).join('');
  }

  /* ========================================================
     [SONARQUBE ISSUE]: Code Smell / Maintainability (Function Nesting)
     [WHY IT IS FLAGGED]: Move function 'escapeHtml' to the outer scope. 
     Nested utility declarations re-allocate memory on every event trigger.
     ======================================================== */
  // --- LEGACY CODE (ACTIVE) ---
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g,
      // tag => ({
      //   '&': '&amp;',
      //   '<': '&lt;',
      //   '>': '&gt;',
      //   "'": '&#39;',
      //   '"': '&quot;'
      // }[tag] || tag)
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag])
    );
  }
  /* --- CLEAN PRODUCTION FIX (UNCOMMENT TO RESOLVE) ---
  // (Move the escapeHtml function definition to the top-level outer scope of the file, outside of the DOMContentLoaded listener)
  */

  // Handle Search Input
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  const executeSearch = () => {
    const query = searchInput.value.trim();
    fetchRegistrations(query);
  };

  searchBtn.addEventListener('click', executeSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  });

  // Handle Form Submission
  const form = document.getElementById('registration-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const student_name = document.getElementById('student_name').value;
    const email = document.getElementById('email').value;
    const event_name = document.getElementById('event_name').value;
    const registration_date = document.getElementById('registration_date').value;
    const flagged = document.getElementById('flagged').checked;

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_name,
          email,
          event_name,
          registration_date,
          flagged
        })
      });

      if (res.ok) {
        form.reset();
        // Set date input to today
        setDefaultDate();
        // Refresh Table & Statistics
        fetchRegistrations();
        fetchStats();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to register student. Connection failed.');
    }
  });

  function setDefaultDate() {
    const dateInput = document.getElementById('registration_date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }

  // Initial Load
  setDefaultDate();
  fetchStats();
  fetchRegistrations();
});
