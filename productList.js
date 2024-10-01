const mobileMenu = document.getElementById('mobile-menu');
const nav = document.querySelector('.nav');

mobileMenu.addEventListener('click', () => {
    nav.classList.toggle('active');
});

const apiUrl = 'https://fakestoreapi.com/products';

const loader = document.getElementById('loader');
let productData = [];
let copyProductData = [];
let allProductData = [];
(function getProductData() {
    loader.style.display = 'flex';
    fetch(apiUrl).then(response => {
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Data not found');
            } else if (response.status === 500) {
                throw new Error('Server error');
            } else {
                throw new Error('Network response was not ok');
            }
        }
        return response.json();
    })
        .then(data => {
            copyProductData = [...data];
            allProductData = data;
            productData = data.slice(0, 10);
            copyProductData = [...data.slice(0, 10)];
            displayData(productData)
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            loader.style.display = 'none'; // Hide loader
        });
})();


function displayData(data) {
    const content = document.getElementById('content');
    content.innerHTML = '';
    if (data.length > 0) {
        document.getElementById('noData').style.display = 'block';
        document.getElementById('noDataTemplate').style.display = 'none';
        document.getElementById('productLen').textContent = `${data.length} Results`;
        document.getElementById('productLenMob').textContent = `${data.length} Results`;
        data.forEach(item => {
            const personDiv = document.createElement('div');
            personDiv.classList.add('grid-item');
            personDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style = "width:100%;height: 200px;">
                <p class="contant-width">${item.title}</p>
                        <p>$${item.price}</p>
                        <p  class="contant-width">${item.description}</p>
            `;
            content.appendChild(personDiv);
        });
    }
    else {
        document.getElementById('noData').style.display = 'none';
        document.getElementById('noDataTemplate').style.display = 'block';

    }

}

// Function to create checkboxes from JSON data

let categoryData = [
    { "id": 1, "name": "men's clothing", "isClicked": false },
    { "id": 2, "name": "jewelery", "isClicked": false },
    { "id": 3, "name": "electronics", "isClicked": false },
    { "id": 4, "name": "women's clothing", "isClicked": false }
];

function createCheckboxesCategory(data) {
    const container = document.getElementById('checkbox-container');
    container.innerHTML = ''; // Clear existing content

    data.forEach(category => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.innerHTML = `
            <label>
                <input type="checkbox" value="${category.id}" onclick="categoryCheckboxClicked(this)" ${category.isClicked ? 'checked' : ''} /> ${category.name}
            </label>
        `;
        container.appendChild(checkboxDiv); // Append checkbox to container
    });
}

function categoryCheckboxClicked(checkbox) {
    const isChecked = checkbox.checked;
    const id = checkbox.value;
    categoryData.map(person => {
        if (person.id == id) {
            person.isClicked = isChecked;
        }
    });
    getFilterData()
    console.log('checkBoxData:', categoryData);
}

createCheckboxesCategory(categoryData);

let priceRange = [
    { "id": 1, "name": "100$ and below", "isClicked": false, "min": 1, "max": 100 },
    { "id": 2, "name": "101$ - 400$", "isClicked": false, "min": 101, "max": 400 },
    { "id": 3, "name": "401$ - 700$", "isClicked": false, "min": 401, "max": 700 },
    { "id": 4, "name": "701$ and above", "isClicked": false, "min": 701, "max": 1000000 }
];

function createCheckboxesPricRang(data) {
    const container = document.getElementById('price-checkbox-container');
    container.innerHTML = ''; // Clear existing content

    data.forEach(priceRange => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.innerHTML = `
            <label>
                <input type="checkbox" value="${priceRange.id}" ${priceRange.isClicked ? 'checked' : ''} onclick="pricRangCheckboxClicked(this)" /> ${priceRange.name}
            </label>
        `;
        container.appendChild(checkboxDiv); // Append checkbox to container
    });
}

function pricRangCheckboxClicked(checkbox) {
    const isChecked = checkbox.checked;
    const id = checkbox.value;
    priceRange.map(person => {
        if (person.id == id) {
            person.isClicked = isChecked;
        }
    });
    getFilterData()
    console.log('checkBoxData:', priceRange);
}
createCheckboxesPricRang(priceRange)

function getFilterData() {
    let checkFilterPriceRange = priceRange.some((item) => item.isClicked === true);
    let checkCategory = categoryData.some((item) => item.isClicked == true);
    if (checkFilterPriceRange && checkCategory) {
        let priceData = copyProductData.filter((product) =>
            priceRange.some((selected) => (product.price >= selected.min && product.price <= selected.max && selected.isClicked === true))
        );
        productData = priceData.filter((product) =>
            categoryData.some((selected) => (selected.name === product.category && selected.isClicked === true))
        );
        sortingOptionsSelected(orderSelectedValue);
        return
    }
    if (checkFilterPriceRange) {
        productData = copyProductData.filter((product) =>
            priceRange.some((selected) => (product.price >= selected.min && product.price <= selected.max && selected.isClicked === true))
        );
        sortingOptionsSelected(orderSelectedValue);
        return
    }
    if (checkCategory) {
        productData = copyProductData.filter((product) =>
            categoryData.some((selected) => (selected.name === product.category && selected.isClicked === true))
        );
        sortingOptionsSelected(orderSelectedValue);
        return
    }
    if (checkFilterPriceRange == false && checkCategory == false) {
        productData = copyProductData;
        sortingOptionsSelected(orderSelectedValue);
    }
}

let orderSelectedValue = ''
const dropdown = document.getElementById('shortingDropdown');
dropdown.addEventListener('change', function () {
    const selectedValue = dropdown.value; // Get the selected value
    orderSelectedValue = selectedValue;
    sortingOptionsSelected()
});

function sortingOptionsSelected() {
    if (orderSelectedValue === 'Descending') {
        productData.sort((a, b) => (b.price - a.price));
        displayData(productData);
    }
    else if (orderSelectedValue === 'Ascending') {
        productData.sort((a, b) => a.price - b.price);
        displayData(productData);
    }
    else if (orderSelectedValue === '') {
        displayData(productData);

    }

}
let changeData = false
function filterProduct() {
    changeData = !changeData
    if (changeData) {
        orderSelectedValue = 'Ascending';
        sortingOptionsSelected()
    }
    else {
        orderSelectedValue = 'Descending';
        sortingOptionsSelected()
    }
    console.log(changeData)
}

availabilityData = [{ 'id': 1, 'name': 'Include out of stock', "isClicked": false }];

function createCheckboxAvailability(data) {
    const container = document.getElementById('availability-checkbox-container');
    container.innerHTML = ''; // Clear existing content

    data.forEach(availability => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.innerHTML = `
            <label>
                <input type="checkbox" value="${availability.id}" ${availability.isClicked ? 'checked' : ''} onclick="availabilityCheckboxClicked(this)" /> ${availability.name}
            </label>
        `;
        container.appendChild(checkboxDiv); // Append checkbox to container
    });
}

function availabilityCheckboxClicked(checkbox) {
    const isChecked = checkbox.checked;
    const id = checkbox.value;
    availabilityData.map(data => {
        if (data.id == id) {
            data.isClicked = isChecked;
        }
    });
    getAvaliableData()
}

createCheckboxAvailability(availabilityData)

function getAvaliableData() {
    if (availabilityData[0].isClicked) {
        productData = copyProductData;
        displayData(productData);

    } else {
        productData = copyProductData.filter((product) => product.rating.count >= 0);
        displayData(productData);

    }
    categoryData.map((item) => item.isClicked = false);
    priceRange.map((item) => item.isClicked = false);
    createCheckboxesPricRang(priceRange);
    createCheckboxesCategory(categoryData);
    createCheckboxesCategoryPopup(categoryData);
    createCheckboxesPricRangPopup(priceRange);
}

let userInput = '';
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function () {
    const filter = searchInput.value.toLowerCase();
    getSearchValue(filter);



});
function getSearchValue(userInput) {
    categoryData.map((item) => item.isClicked = false);
    priceRange.map((item) => item.isClicked = false);
    createCheckboxesPricRang(priceRange);
    createCheckboxesCategory(categoryData);
    if (userInput) {
        productData = copyProductData.filter((product) => product.title.toLowerCase().includes(userInput.toLowerCase()) || product.description.toLowerCase().includes(userInput.toLowerCase()));
        displayData(productData);
    } else {
        productData = copyProductData;
        displayData(productData);
    }
}

function loadMoreProduct() {
    productData = [];
    copyProductData = [];
    let remainingProduct = allProductData.slice(-10);
    productData = remainingProduct;
    copyProductData = [...remainingProduct];
    categoryData.map((item) => item.isClicked = false);
    priceRange.map((item) => item.isClicked = false);
    createCheckboxesPricRang(priceRange);
    createCheckboxesCategory(categoryData);
    displayData(remainingProduct);
}


// popup 


document.getElementById('open-popup').addEventListener('click', function () {
    document.getElementById('popup').style.display = 'block'; // Show the popup
    createCheckboxesCategoryPopup(categoryData);
    createCheckboxesPricRangPopup(priceRange);
    createCheckboxAvailabilityPopup(availabilityData);
});

document.getElementById('close-popup').addEventListener('click', function () {
    document.getElementById('popup').style.display = 'none'; // Hide the popup
});

document.getElementById('close-popup-btn').addEventListener('click', function () {
    document.getElementById('popup').style.display = 'none'; // Hide the popup
});

// Close the popup if the user clicks anywhere outside the popup content
window.addEventListener('click', function (event) {
    const popup = document.getElementById('popup');
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});

function createCheckboxesCategoryPopup(data) {
    const container = document.getElementById('checkbox-container-popup');
    container.innerHTML = ''; // Clear existing content

    data.forEach(category => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.innerHTML = `
            <label>
                <input type="checkbox" value="${category.id}" onclick="categoryCheckboxClicked(this)" ${category.isClicked ? 'checked' : ''} /> ${category.name}
            </label>
        `;
        container.appendChild(checkboxDiv); // Append checkbox to container
    });
}

function createCheckboxesPricRangPopup(data) {
    const container = document.getElementById('price-checkbox-container-popup');
    container.innerHTML = ''; // Clear existing content

    data.forEach(priceRange => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.innerHTML = `
            <label>
                <input type="checkbox" value="${priceRange.id}" ${priceRange.isClicked ? 'checked' : ''} onclick="pricRangCheckboxClicked(this)" /> ${priceRange.name}
            </label>
        `;
        container.appendChild(checkboxDiv); // Append checkbox to container
    });
}

function createCheckboxAvailabilityPopup(data) {
    const container = document.getElementById('availability-checkbox-container-popup');
    container.innerHTML = ''; // Clear existing content

    data.forEach(availability => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.innerHTML = `
            <label>
                <input type="checkbox" value="${availability.id}" ${availability.isClicked ? 'checked' : ''} onclick="availabilityCheckboxClicked(this)" /> ${availability.name}
            </label>
        `;
        container.appendChild(checkboxDiv); // Append checkbox to container
    });
}

function clearAll() {
    categoryData.map((item) => item.isClicked = false);
    priceRange.map((item) => item.isClicked = false);
    availabilityData.map((item) => item.isClicked = false);
    createCheckboxesCategoryPopup(categoryData);
    createCheckboxesPricRangPopup(priceRange);
    createCheckboxAvailabilityPopup(availabilityData);
    displayData(copyProductData);
}


