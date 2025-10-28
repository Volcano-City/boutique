// Category display name mapping
const categoryDisplayNames = {
    vehicles: 'Véhicules',
    motos: 'Motos',
    packs: 'Packs',
    vip: 'VIP',
    coins: 'Coins'
};

let allItems = {};
let currentCategory = 'vehicles';

// Fetch items from items.json
async function fetchItems() {
    try {
        const response = await fetch('items.json');
        allItems = await response.json();
        
        // Initialize the page
        generateCategories();
        renderGridItems(currentCategory);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// Generate category buttons dynamically
function generateCategories() {
    const categoryContainer = document.getElementById('category-container');
    categoryContainer.innerHTML = '';
    
    Object.keys(allItems).forEach((categoryKey) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.textContent = categoryDisplayNames[categoryKey] || categoryKey;
        categoryDiv.dataset.category = categoryKey;
        
        // Add active class to the first category
        if (categoryKey === currentCategory) {
            categoryDiv.classList.add('active');
        }
        
        // Add click event listener
        categoryDiv.addEventListener('click', () => {
            changeCategory(categoryKey);
        });
        
        categoryContainer.appendChild(categoryDiv);
    });
}

// Change category and update UI
function changeCategory(categoryKey) {
    currentCategory = categoryKey;
    
    // Update active state on category buttons
    document.querySelectorAll('.category').forEach(cat => {
        cat.classList.remove('active');
        if (cat.dataset.category === categoryKey) {
            cat.classList.add('active');
        }
    });
    
    // Update main title
    const mainTitle = document.getElementById('main-title');
    mainTitle.textContent = categoryDisplayNames[categoryKey] || categoryKey;
    
    // Trigger scale animation on app element
    const app = document.querySelector('.app');
    app.classList.remove('animate');
    // Force reflow to restart animation
    void app.offsetWidth;
    app.classList.add('animate');
    
    // Render grid items for selected category
    renderGridItems(categoryKey);
}

// Render grid items for a specific category
function renderGridItems(categoryKey) {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    
    const items = allItems[categoryKey] || [];
    
    items.forEach(item => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        
        gridItem.innerHTML = `
            <div class="grid-img" style="background: url('${item.url}') no-repeat center; background-size: cover;"></div>
            <div class="grid-item-title">${item.name}</div>
            <div class="grid-item-desc">${item.description}</div>
            <div class="grid-item-price">
                <i class="fa-regular fa-coins"></i>
                ${item.price}
            </div>
        `;
        
        gridContainer.appendChild(gridItem);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchItems();
    
    // Add Discord button click handler
    const discordLogo = document.querySelector('.dc-logo');
    if (discordLogo) {
        discordLogo.addEventListener('click', () => {
            window.open('https://discord.gg/QKVbjydGew', '_blank');
        });
        discordLogo.style.cursor = 'pointer';
    }
});
