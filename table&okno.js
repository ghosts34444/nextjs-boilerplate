 // Модальное окно выбора отдела (без заголовка)
        const modsList = document.getElementById('mods-list');
        const order = [
            'vanilla', 'thaumcraft', 'appliedenergistics2', 'ic2', 'thermal', 'blood',
            'botania', 'minefactory', 'dc', 'avaritia', 'tanker', 'stradania',
            'ender', 'lolienergistics', 'lolimagically', 'divine', 'galactic', 'trade'
        ];
        order.forEach(key => {
            const dept = departments[key];
            if (!dept) return;
            const div = document.createElement('a');
            div.href = '#';
            div.className = 'mod-option';
            div.dataset.key = key;
            const icon = document.createElement('div');
            icon.className = 'mod-icon';
            icon.textContent = dept.name.charAt(0);
            const text = document.createTextNode(dept.name);
            div.appendChild(icon);
            div.appendChild(text);
            div.addEventListener('click', (e) => {
                e.preventDefault();
                showTable(key);
                closeModal('mods-modal');
            });
            modsList.appendChild(div);
        });

// Модальные окна
function showModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.style.opacity = '1';
                modal.style.pointerEvents = 'auto';
            }, 10);
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
                modal.style.pointerEvents = 'none';
            }, 300);
        }

        document.getElementById('open-mods-modal').addEventListener('click', () => showModal('mods-modal'));
        document.getElementById('mods-modal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('mods-modal')) closeModal('mods-modal');
        });
//таюлица
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
