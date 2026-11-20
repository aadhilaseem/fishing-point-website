// ==========================================================================
// Fishing Point - Performance-Optimized Client-Side Script
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSearch();
    registerServiceWorker();
});

// WhatsApp Store Phone Number (Fishing Point - Pappan)
const STORE_WHATSAPP_NUMBER = "919567330366";

// --- 1. Instant Cache Service Worker Registration ---
function registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(() => console.log('⚡ Fishing Point Fast-Cache Ready'))
                .catch(() => {});
        });
    }
}

// --- 2. Mobile Drawer Navigation ---
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');

    if (!menuBtn || !menu) return;

    menuBtn.addEventListener('click', () => {
        const isHidden = menu.classList.contains('hidden');
        if (isHidden) {
            menu.classList.remove('hidden');
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-xmark');
        } else {
            menu.classList.add('hidden');
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        }
    });
}

function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    if (menu) menu.classList.add('hidden');
    if (menuIcon) {
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
    }
}

// --- 3. Instant Product Category Filtering ---
let currentCategory = 'all';

function filterCategory(category) {
    currentCategory = category;
    
    // Update button active styles across both desktop & mobile category bars
    const filterButtons = document.querySelectorAll('.cat-filter-btn');
    for (let i = 0; i < filterButtons.length; i++) {
        const btn = filterButtons[i];
        if (btn.getAttribute('data-cat') === category) {
            btn.classList.add('active-filter');
            btn.classList.remove('bg-white', 'text-slate-700');
        } else {
            btn.classList.remove('active-filter');
            btn.classList.add('bg-white', 'text-slate-700');
        }
    }

    applyFilters();
}

// --- 4. High-Performance Debounced Live Search ---
function initSearch() {
    const desktopSearch = document.getElementById('gearSearch');
    const mobileSearch = document.getElementById('mobileSearch');
    let debounceTimer;

    const handleSearch = (e) => {
        clearTimeout(debounceTimer);
        const val = e.target.value;
        if (desktopSearch && e.target !== desktopSearch) desktopSearch.value = val;
        if (mobileSearch && e.target !== mobileSearch) mobileSearch.value = val;

        debounceTimer = setTimeout(() => {
            applyFilters();
        }, 60); // 60ms debounce for 60fps responsiveness
    };

    if (desktopSearch) desktopSearch.addEventListener('input', handleSearch);
    if (mobileSearch) mobileSearch.addEventListener('input', handleSearch);
}

function applyFilters() {
    const desktopSearch = document.getElementById('gearSearch');
    const query = desktopSearch ? desktopSearch.value.toLowerCase().trim() : '';
    const products = document.querySelectorAll('.product-item');
    const noResults = document.getElementById('noResults');
    let visibleCount = 0;

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const cat = product.getAttribute('data-category');
        const name = product.getAttribute('data-name').toLowerCase();

        const matchesCategory = (currentCategory === 'all' || cat === currentCategory);
        const matchesQuery = (query === '' || name.indexOf(query) !== -1);

        if (matchesCategory && matchesQuery) {
            product.classList.remove('hidden');
            visibleCount++;
        } else {
            product.classList.add('hidden');
        }
    }

    if (noResults) {
        if (visibleCount === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    }
}

// --- 5. Direct WhatsApp Order Generator with Product Specs ---
function orderViaWhatsApp(productName, price) {
    const message = `Hello Fishing Point! 🎣\n\nI want to enquire about/order this item:\n*Product:* ${productName}\n*Price Reference:* ${price}\n\nCould you please let me know current stock availability at your Kochi shop and delivery options?`;
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
}
