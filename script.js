// ==========================================================================
// Fishing Point - High-Performance E-Commerce Interactivity
// Clean, Fast, Robust Brand & Category Filtering
// ==========================================================================

const STORE_WHATSAPP_NUMBER = "919567330366";

let activeCategory = 'All';
let activeBrand = 'All';

document.addEventListener('DOMContentLoaded', () => {
    initSearch();
    registerServiceWorker();
});

// 1. Service Worker for Offline Speed
function registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch(() => {});
        });
    }
}

// 2. Category Filter
function filterByCategory(category) {
    activeCategory = category;
    
    // Update category tabs style
    const tabs = document.querySelectorAll('.cat-tab');
    tabs.forEach(tab => {
        if (tab.getAttribute('data-cat') === category) {
            tab.className = "cat-tab active-cat-tab px-3.5 py-1.5 rounded-xl border border-slate-900 bg-slate-900 text-white font-bold whitespace-nowrap shadow-xs";
        } else {
            tab.className = "cat-tab px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 whitespace-nowrap";
        }
    });

    applyFilters();
}

// 3. Brand Filter
function filterByBrand(brand) {
    activeBrand = brand;
    
    // Update brand chips style
    const chips = document.querySelectorAll('.brand-chip');
    chips.forEach(chip => {
        if (chip.getAttribute('data-brand') === brand) {
            chip.className = "brand-chip active-brand-chip px-3 py-1 rounded-lg border border-slate-900 bg-slate-900 text-white font-bold whitespace-nowrap shadow-xs";
        } else {
            chip.className = "brand-chip px-3 py-1 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 whitespace-nowrap";
        }
    });

    applyFilters();

    // If triggered from Shop by Brand section, smoothly scroll down to the catalog
    const catalogEl = document.getElementById('tackleCatalog');
    if (catalogEl && window.scrollY < catalogEl.offsetTop - 100) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
}

// 4. Reset All Filters
function resetAllFilters() {
    activeCategory = 'All';
    activeBrand = 'All';
    
    const searchDesk = document.getElementById('gearSearch');
    const searchMob = document.getElementById('gearSearchMobile');
    if (searchDesk) searchDesk.value = '';
    if (searchMob) searchMob.value = '';

    filterByCategory('All');
    filterByBrand('All');
}

// 5. Unified Filter Application
function applyFilters() {
    const searchDesk = document.getElementById('gearSearch');
    const searchMob = document.getElementById('gearSearchMobile');
    const query = ((searchDesk && searchDesk.value) || (searchMob && searchMob.value) || '').toLowerCase().trim();

    const items = document.querySelectorAll('.product-item');
    const noResults = document.getElementById('noResults');
    const filterBadge = document.getElementById('activeFilterBadge');

    let visibleCount = 0;

    items.forEach(item => {
        const itemBrand = item.getAttribute('data-brand');
        const itemCat = item.getAttribute('data-category');
        const itemName = (item.getAttribute('data-name') || '').toLowerCase();

        const matchBrand = (activeBrand === 'All' || itemBrand === activeBrand);
        const matchCat = (activeCategory === 'All' || itemCat === activeCategory);
        const matchQuery = (query === '' || itemName.includes(query) || itemBrand.toLowerCase().includes(query));

        if (matchBrand && matchCat && matchQuery) {
            item.classList.remove('hidden');
            visibleCount++;
        } else {
            item.classList.add('hidden');
        }
    });

    // Update Filter Indicator Badge
    if (filterBadge) {
        let label = 'Showing: ';
        if (activeBrand === 'All' && activeCategory === 'All' && !query) {
            label += `All Products (${visibleCount})`;
        } else {
            const parts = [];
            if (activeBrand !== 'All') parts.push(`Brand: ${activeBrand}`);
            if (activeCategory !== 'All') parts.push(`Category: ${activeCategory}`);
            if (query) parts.push(`Search: "${query}"`);
            label += `${parts.join(' • ')} (${visibleCount})`;
        }
        filterBadge.textContent = label;
    }

    if (noResults) {
        if (visibleCount === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    }
}

// 6. Synchronized Live Search
function initSearch() {
    const searchDesk = document.getElementById('gearSearch');
    const searchMob = document.getElementById('gearSearchMobile');
    const inputs = [searchDesk, searchMob].filter(Boolean);

    let debounceTimer;

    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const val = e.target.value;

            // Sync other input
            inputs.forEach(other => {
                if (other !== e.target) other.value = val;
            });

            debounceTimer = setTimeout(() => {
                applyFilters();
            }, 60);
        });
    });
}

// 7. WhatsApp Order Builder
function orderViaWhatsApp(productName, price) {
    const text = `Hello Fishing Point Alappuzha,\n\nI want to order/enquire about this tackle:\n*Product:* ${productName}\n*Price Reference:* ${price}\n\nCould you please confirm stock availability at your Iron Bridge shop (Mullakkal) and courier delivery options?`;
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(url, '_blank');
}
