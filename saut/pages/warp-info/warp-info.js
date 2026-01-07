const departments = {
  vanilla: { name: "Vanilla", items: [
    { name: "Тростник | 64 шт", price: "6 Железных слитка" },
    { name: "Тростник | 64 шт", price: "6 Железных слитка" },
    { name: "Тростник | 64 шт", price: "6 Железных слитка" },
    { name: "Тростник | 64 шт", price: "6 Железных слитка" },
    { name: "Тростник | 64 шт", price: "6 Железных слитка" },
    { name: "Тростник | 64 шт", price: "6 Железных слитка" },
    { name: "Тростник | 64 шт", price: "6 Железных слитка" },
    { name: "Тростник | 64 шт", price: "6 Железных слитка" },
    { name: "Тростник | 64 шт", price: "6 Железных слитка" }
  ]},
  thaumcraft: { name: "Thaumcraft", items: [
    { name: "Ртуть | 4 шт", price: "12 Железных слитка" }
  ]},
};

let lastOpenedDeptKey = null;
let tableWasVisible = false;

document.addEventListener('DOMContentLoaded', () => {

  const modsList = document.getElementById('mods-list');
  if (modsList) {
    Object.entries(departments).forEach(([key, dept]) => {
      const div = document.createElement('div');
      div.className = 'mod-option';
      div.dataset.key = key;
      div.textContent = dept.name;
      div.addEventListener('click', (e) => {
        e.preventDefault();
        showTable(key);
        closeModal('mods-modal');
      });
      modsList.appendChild(div);
    });
  }

  document.getElementById('open-mods-modal')?.addEventListener('click', () => {
    showModal('mods-modal');
  });

  document.getElementById('mods-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'mods-modal') closeModal('mods-modal');
  });

  document.getElementById('close-table')?.addEventListener('click', () => {
    hideTable();
    tableWasVisible = false;
  });

  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  
  if (searchInput && searchClear) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      searchClear.style.display = query ? 'block' : 'none';

      if (query.length >= 1) {
        performSearch(query);
        hideTable();
      } else {
        document.getElementById('search-results').style.display = 'none';
        if (tableWasVisible && lastOpenedDeptKey) {
          showTable(lastOpenedDeptKey);
        }
      }
    });

    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.style.display = 'none';
      document.getElementById('search-results').style.display = 'none';
      if (tableWasVisible && lastOpenedDeptKey) {
        showTable(lastOpenedDeptKey);
      }
    });
  }
});

function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.style.opacity = '1';
      modal.style.pointerEvents = 'auto';
    }, 10);
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
      modal.style.pointerEvents = 'none';
    }, 300);
  }
}

function showTable(key) {
  const dept = departments[key];
  if (!dept) return;

  lastOpenedDeptKey = key;
  tableWasVisible = true;

  document.getElementById('table-title').textContent = dept.name;
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '';
  dept.items.forEach(item => {
    const row = tbody.insertRow();
    row.insertCell(0).textContent = item.name;
    row.insertCell(1).textContent = item.price;
  });

  const table = document.getElementById('mod-table');
  table.style.display = 'block';
  setTimeout(() => table.classList.add('visible'), 10);
}

function hideTable() {
  const table = document.getElementById('mod-table');
  if (table.classList.contains('visible')) {
    table.classList.remove('visible');
    setTimeout(() => table.style.display = 'none', 300);
  }
}

function performSearch(query) {
  const resultsDiv = document.getElementById('search-results');
  let html = '';
  for (const [key, dept] of Object.entries(departments)) {
    const matches = dept.items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    if (matches.length) {
      html += `<h3>${dept.name}</h3><table><tr><th>Предмет</th><th>Цена</th></tr>`;
      matches.forEach(item => {
        html += `<tr><td>${item.name}</td><td>${item.price}</td></tr>`;
      });
      html += `</table><br>`;
    }
  }
  resultsDiv.innerHTML = html || '<h3>Ничего не найдено</h3>';
  resultsDiv.style.display = 'block';
}
