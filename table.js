let lastOpenedDeptKey = null;
let isTableManuallyClosed = false; 

function showTable(deptKey) {
  
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';
    document.getElementById('search-clear').style.display = 'none';
    document.getElementById('search-results').style.display = 'none';

    const dept = departments[deptKey];
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

    isTableManuallyClosed = false;
    lastOpenedDeptKey = deptKey;

    setTimeout(() => {
        const tableRect = table.getBoundingClientRect();
        const tableBottom = tableRect.bottom;
        const viewportHeight = window.innerHeight;
        const neededHeight = viewportHeight - tableBottom + 50;
        const minHeight = 150;
        const finalHeight = Math.max(minHeight, neededHeight);
        document.querySelector('.bottom-gradient').style.height = `${finalHeight}px`;
    }, 310);
}

function hideTable() {
    const table = document.getElementById('mod-table');
    if (table.classList.contains('visible')) {
        table.classList.remove('visible');
        setTimeout(() => {
            table.style.display = 'none';
            document.querySelector('.bottom-gradient').style.height = '150px';
        }, 300);
    }
}

document.getElementById('close-table').addEventListener('click', () => {
    isTableManuallyClosed = true;
    hideTable();
});

const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');

searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    searchClear.style.display = query.length > 0 ? 'block' : 'none';

    if (query.length < 3) {
        document.getElementById('search-results').style.display = 'none';
        return;
    }

    performSearch(query);
  
    hideTable();
});

searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.style.display = 'none';
    document.getElementById('search-results').style.display = 'none';

    if (!isTableManuallyClosed && lastOpenedDeptKey) {
        showTable(lastOpenedDeptKey);
    }
});

function performSearch(query) {
    const results = {};
    for (const [key, dept] of Object.entries(departments)) {
        const matches = dept.items.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        if (matches.length > 0) {
            results[key] = { name: dept.name, items: matches };
        }
    }

    const resultsDiv = document.getElementById('search-results');
    if (Object.keys(results).length === 0) {
        resultsDiv.innerHTML = '<h3>Ничего не найдено</h3>';
    } else {
        const sortedResults = order.filter(key => results[key]).map(key => [key, results[key]]);
        let html = '';
        for (const [key, dept] of sortedResults) {
            html += `<h3>${dept.name}</h3><table><thead><tr><th>Предмет</th><th>Цена</th></tr></thead><tbody>`;
            dept.items.forEach(item => {
                html += `<tr><td>${item.name}</td><td>${item.price}</td></tr>`;
            });
            html += `</tbody></table><br>`;
        }
        resultsDiv.innerHTML = html;
    }
    resultsDiv.style.display = 'block';
}
