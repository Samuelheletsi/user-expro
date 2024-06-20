document.addEventListener("DOMContentLoaded", function load() {
    fetch('http://localhost:5500/getAll') // Adjust the PORT to your backend's port
        .then(response => response.json())
        .then(data => loadHTML(data['data']));
});

document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        deleteRowById(event.target.dataset.id);
    }

    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
    }
});

const updateBtn = document.querySelector('#update-row-btn');

function deleteRowById(id) {
    fetch(`http://localhost:5500/delete/${id}`, { // Adjust the PORT to your backend's port
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
}

function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;

    document.querySelector('#update-name-input').dataset.id = id;
}

updateBtn.onclick = function() {
    const updateNameInput = document.querySelector('#update-name-input');
    const updateImageInput = document.querySelector('#update-image-input');
    const updatePriceInput = document.querySelector('#update-price-input');
    const updateDescripInput = document.querySelector('#update-descrip-input');
    const updateSpecInput = document.querySelector('#update-spec-input');

    const id = updateNameInput.dataset.id;
    const name = updateNameInput.value;
    const image = updateImageInput.value;
    const price = updatePriceInput.value;
    const descrip = updateDescripInput.value;
    const spec = updateSpecInput.value;

    if (!id) {
        console.error('No id value found.');
        return;
    }

    fetch('http://localhost:5500/update', { // Adjust the PORT to your backend's port
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            name: name,
            image: image,
            price: price,
            descrip: descrip,
            spec: spec
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    })
    .catch(error => {
        console.error('Error updating data:', error);
    });
};

function insertRowIntoTable(data) {
    console.log(data);

    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml += `<td><button class="delete-row-btn" data-id="${data.id}">Delete</button></td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id="${data.id}">Edit</button></td>`;
    tableHtml += '</tr>';

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

function loadHTML(data) {
    const table = document.querySelector("table tbody");

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='9'>No Data!</td></tr>";
        return;
    }

    let tableHtml = "";
    data.forEach(function({
        id,
        name,
        image,
        date_added,
        price,
        descrip,
        spec
    }) {
       tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td >${image}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td>${price}</td>`;
        tableHtml += `<td>${descrip}</td>`;  
        tableHtml += `<td>${spec}</td>`;   
        tableHtml += `<td><button class="delete-row-btn" data-id="${id}">Delete</button></td>`;  
        tableHtml += `<td><button class="edit-row-btn" data-id="${id}">Edit</button></td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}
