// ==========================================================================
// Fishing Point - High-Performance E-Commerce Interactivity v5.0
// Quick View Modal with Backdrop Blur, Zero Latency, Fast Filtering
// ==========================================================================

const STORE_WHATSAPP_NUMBER = "919567330366";

let activeCategory = 'All';
let activeBrand = 'All';

document.addEventListener('DOMContentLoaded', () => {
    initSearch();
    initScrollReveal();
    initKeyboardShortcuts();
    registerServiceWorker();
});

// 1. Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch(() => {});
        });
    }
}

// 2. High-Performance Scroll Reveal
function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// 3. Category Filter
function filterByCategory(category) {
    activeCategory = category;
    
    // Update category tabs style
    const tabs = document.querySelectorAll('.cat-tab');
    tabs.forEach(tab => {
        if (tab.getAttribute('data-cat') === category) {
            tab.className = "cat-tab active-cat-tab px-3 py-1.5 rounded-xl border border-slate-900 bg-slate-900 text-white font-bold whitespace-nowrap shadow-xs";
        } else {
            tab.className = "cat-tab px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 whitespace-nowrap";
        }
    });

    applyFilters();
}

// 4. Brand Filter
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

    // Smooth scroll to catalog when selected from brand section
    const catalogEl = document.getElementById('tackleCatalog');
    if (catalogEl && window.scrollY < catalogEl.offsetTop - 120) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
}

// 5. Reset All Filters
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

// 6. Unified Filter Application
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
            item.classList.add('visible');
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

// 7. Synchronized Live Search
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
            }, 50);
        });
    });
}

// 8. WhatsApp Order Builder
function orderViaWhatsApp(productName, price) {
    const text = `Hello Fishing Point Alappuzha,\n\nI want to order/enquire about this tackle:\n*Product:* ${productName}\n*Price Reference:* ${price}\n\nCould you please confirm stock availability at your Iron Bridge shop (Mullakkal) and courier delivery options?`;
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(url, '_blank');
}

// ==========================================================================
// 9. Interactive Product Quick View Modal (Popup with Blur Background)
// ==========================================================================

function openProductModal(productId) {
    const db = window.PRODUCTS_DB || [];
    const product = db.find(p => p.id === productId);

    if (!product) return;

    // Populate Modal Elements
    const modal = document.getElementById('productModal');
    const modalImg = document.getElementById('modalProductImg');
    const modalName = document.getElementById('modalProductName');
    const modalPrice = document.getElementById('modalProductPrice');
    const modalDesc = document.getElementById('modalProductDesc');
    const modalBrand = document.getElementById('modalBrandBadge');
    const modalCat = document.getElementById('modalCategoryBadge');
    const specsContainer = document.getElementById('modalSpecsContainer');
    const featuresList = document.getElementById('modalFeaturesList');
    const whatsAppBtn = document.getElementById('modalWhatsAppBtn');

    if (modalImg) {
        modalImg.src = product.img;
        modalImg.alt = product.name;
    }
    if (modalName) modalName.textContent = product.name;
    if (modalPrice) modalPrice.textContent = product.price;
    if (modalDesc) modalDesc.textContent = product.desc || 'Authorized gear available at Fishing Point Alappuzha.';
    if (modalBrand) modalBrand.textContent = product.brand;
    if (modalCat) modalCat.textContent = product.category_name || product.category;

    // Populate Specs
    if (specsContainer) {
        specsContainer.innerHTML = '';
        const specs = product.specs || [];
        specs.forEach(s => {
            const pill = document.createElement('span');
            pill.className = "bg-white text-slate-800 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-2xs";
            pill.textContent = s;
            specsContainer.appendChild(pill);
        });
    }

    // Populate Features
    if (featuresList) {
        featuresList.innerHTML = '';
        const features = product.features || [
            "100% Genuine manufacturer stock verified for Kerala waters",
            "Free professional braid machine spooling included",
            "Available for walk-in pickup near Iron Bridge & All-Kerala delivery"
        ];
        features.forEach(f => {
            const li = document.createElement('li');
            li.className = "flex items-start gap-2";
            li.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-600 text-[11px] mt-0.5"></i><span>${f}</span>`;
            featuresList.appendChild(li);
        });
    }

    // WhatsApp Action
    if (whatsAppBtn) {
        whatsAppBtn.onclick = () => {
            orderViaWhatsApp(product.name, product.price);
        };
    }

    // Open Modal with Spring Elevation & Blur Background
    if (modal) {
        modal.classList.remove('hidden');
        // Force reflow for smooth transition
        void modal.offsetWidth;
        modal.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
    }
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    modal.classList.remove('modal-open');
    document.body.style.overflow = '';

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 250);
}

function handleBackdropClick(event) {
    const modalCard = document.getElementById('modalCard');
    if (modalCard && !modalCard.contains(event.target)) {
        closeProductModal();
    }
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
        }
    });
}

// Attach directly to window for global inline accessibility
window.filterByCategory = filterByCategory;
window.filterByBrand = filterByBrand;
window.resetAllFilters = resetAllFilters;
window.orderViaWhatsApp = orderViaWhatsApp;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.handleBackdropClick = handleBackdropClick;
