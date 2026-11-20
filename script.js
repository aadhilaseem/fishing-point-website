// ==========================================================================
// Fishing Point - Mobile-First High Performance Interactivity
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSearch();
    registerServiceWorker();
});

// WhatsApp Store Phone Number (Fishing Point - Pappan)
const STORE_WHATSAPP_NUMBER = "919567330366";

// --- 1. Service Worker for Instant Caching ---
function registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch(() => {});
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
    
    // Update button active styles across all category buttons
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

// --- 4. Synchronized Live Search (Desktop & Mobile) ---
function initSearch() {
    const inputs = [
        document.getElementById('gearSearch'),
        document.getElementById('gearSearchDesktop'),
        document.getElementById('gearSearchMobile')
    ].filter(Boolean);

    let debounceTimer;

    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const val = e.target.value;
            // Sync all other search fields
            inputs.forEach(other => {
                if (other !== e.target) other.value = val;
            });

            debounceTimer = setTimeout(() => {
                applyFilters();
            }, 50);
        });
    });
}

function applyFilters() {
    const searchEl = document.getElementById('gearSearch') || document.getElementById('gearSearchDesktop');
    const query = searchEl ? searchEl.value.toLowerCase().trim() : '';
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

// --- 5. Direct WhatsApp Order Generator ---
function orderViaWhatsApp(productName, price) {
    const message = `Hello Fishing Point! 🎣\n\nI want to enquire about/order this gear:\n*Product:* ${productName}\n*Price Reference:* ${price}\n\nCould you please let me know stock availability at your Alappuzha shop (Near Iron Bridge) and delivery options?`;
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
}
