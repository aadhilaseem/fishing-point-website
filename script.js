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
    initModalScrollProtection();
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

// 7. Synchronized Live Search & Instant Dropdown
function initSearch() {
    const searchDesk = document.getElementById('gearSearch');
    const searchMob = document.getElementById('gearSearchMobile');
    const clearDesk = document.getElementById('clearSearchDesktop');
    const clearMob = document.getElementById('clearSearchMobile');
    const inputs = [searchDesk, searchMob].filter(Boolean);

    let debounceTimer;

    inputs.forEach(input => {
        // Live Input Event
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const val = e.target.value;

            // Sync other input
            inputs.forEach(other => {
                if (other !== e.target) other.value = val;
            });

            // Toggle clear button
            if (clearDesk) clearDesk.classList.toggle('hidden', !val);
            if (clearMob) clearMob.classList.toggle('hidden', !val);

            // Render instant live dropdown immediately
            renderSearchDropdown(val);

            debounceTimer = setTimeout(() => {
                applyFilters();
            }, 30);
        });

        // Keydown Handler for Enter: Auto-scroll down to results in catalog
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                input.blur();
                closeSearchDropdown();
                const catalogEl = document.getElementById('tackleCatalog');
                if (catalogEl) {
                    catalogEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        // Focus Handler
        input.addEventListener('focus', () => {
            if (input.value.trim().length > 0) {
                renderSearchDropdown(input.value);
            }
        });
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#searchWrapperDesktop') && !e.target.closest('#searchWrapperMobile')) {
            closeSearchDropdown();
        }
    });
}

function renderSearchDropdown(rawQuery) {
    const query = (rawQuery || '').toLowerCase().trim();
    const dropDesk = document.getElementById('searchDropdownDesktop');
    const dropMob = document.getElementById('searchDropdownMobile');
    const dropdowns = [dropDesk, dropMob].filter(Boolean);

    if (!query) {
        dropdowns.forEach(d => {
            d.innerHTML = '';
            d.classList.add('hidden');
        });
        return;
    }

    const db = window.PRODUCTS_DB || [];
    const matches = db.filter(p => {
        const name = (p.name || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const cat = (p.category_name || p.category || '').toLowerCase();
        const specs = (p.specs || []).join(' ').toLowerCase();
        return name.includes(query) || brand.includes(query) || cat.includes(query) || specs.includes(query);
    });

    let html = '';

    if (matches.length > 0) {
        const topMatches = matches.slice(0, 5);
        html += `<div class="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <span>Found ${matches.length} matching gear</span>
            <span class="text-emerald-700 font-extrabold">Tap to View</span>
        </div>`;

        topMatches.forEach(p => {
            html += `
            <div onclick="selectSearchProduct('${p.id}')" class="p-2.5 sm:p-3 hover:bg-slate-50 transition-colors flex items-center gap-3 cursor-pointer group">
                <div class="w-10 h-10 rounded-xl bg-slate-100 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200">
                    <img src="${p.img}" alt="${p.name}" class="w-full h-full object-contain group-hover:scale-105 transition-transform" onerror="this.src='assets/reel.jpg'">
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5 mb-0.5">
                        <span class="bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">${p.brand}</span>
                        <span class="text-[10px] text-slate-500 uppercase truncate">${p.category_name || p.category}</span>
                    </div>
                    <h4 class="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">${p.name}</h4>
                    <span class="text-xs font-extrabold text-slate-900">${p.price}</span>
                </div>
                <i class="fa-solid fa-chevron-right text-slate-300 text-xs group-hover:text-slate-600 transition-colors"></i>
            </div>`;
        });

        // Bottom CTA: View all results in catalog
        html += `
        <button onclick="jumpToCatalogWithFilter()" class="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
            <span>View All ${matches.length} Items in Catalog</span>
            <i class="fa-solid fa-arrow-down text-[10px]"></i>
        </button>`;
    } else {
        html += `
        <div class="p-4 text-center space-y-1.5">
            <i class="fa-solid fa-magnifying-glass text-xl text-slate-300"></i>
            <p class="text-xs font-bold text-slate-800">No matching gear found for "${rawQuery}"</p>
            <p class="text-[10px] text-slate-500">Need a custom tackle recommendation? Ask Pappan:</p>
            <a href="https://wa.me/${STORE_WHATSAPP_NUMBER}?text=Hi%20Pappan,%20I%20am%20looking%20for%20fishing%20gear:%20${encodeURIComponent(rawQuery)}" target="_blank" class="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-[10px] font-bold">
                <i class="fa-brands fa-whatsapp text-xs"></i>
                <span>Ask Pappan on WhatsApp</span>
            </a>
        </div>`;
    }

    dropdowns.forEach(d => {
        d.innerHTML = html;
        d.classList.remove('hidden');
    });
}

function selectSearchProduct(productId) {
    closeSearchDropdown();
    openProductModal(productId);
}

function jumpToCatalogWithFilter() {
    closeSearchDropdown();
    const catalogEl = document.getElementById('tackleCatalog');
    if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
}

function closeSearchDropdown() {
    const dropDesk = document.getElementById('searchDropdownDesktop');
    const dropMob = document.getElementById('searchDropdownMobile');
    if (dropDesk) dropDesk.classList.add('hidden');
    if (dropMob) dropMob.classList.add('hidden');
}

function clearLiveSearch() {
    const searchDesk = document.getElementById('gearSearch');
    const searchMob = document.getElementById('gearSearchMobile');
    const clearDesk = document.getElementById('clearSearchDesktop');
    const clearMob = document.getElementById('clearSearchMobile');

    if (searchDesk) searchDesk.value = '';
    if (searchMob) searchMob.value = '';
    if (clearDesk) clearDesk.classList.add('hidden');
    if (clearMob) clearMob.classList.add('hidden');

    closeSearchDropdown();
    applyFilters();
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
            pill.className = "bg-slate-100 text-slate-700 border border-slate-200/80 px-2 py-0.5 rounded text-[10px] font-semibold";
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

    // Save exact scroll position and lock background
    savedModalScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    document.documentElement.classList.add('modal-locked');
    document.body.classList.add('modal-locked');

    // Open Modal with Spring Elevation & Blur Background
    if (modal) {
        modal.classList.remove('hidden');
        // Force reflow for smooth transition
        void modal.offsetWidth;
        modal.classList.add('modal-open');
    }
}

let savedModalScrollY = 0;

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    modal.classList.remove('modal-open');

    // Unlock background and restore exact scroll position
    document.documentElement.classList.remove('modal-locked');
    document.body.classList.remove('modal-locked');
    if (typeof savedModalScrollY === 'number') {
        window.scrollTo({ top: savedModalScrollY, behavior: 'instant' });
    }

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

function initModalScrollProtection() {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    // Prevent mouse wheel on backdrop from scrolling window
    modal.addEventListener('wheel', (e) => {
        if (e.target === modal) {
            e.preventDefault();
        }
    }, { passive: false });

    // Prevent mobile touch drags on backdrop from scrolling window
    modal.addEventListener('touchmove', (e) => {
        if (e.target === modal) {
            e.preventDefault();
        }
    }, { passive: false });
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
window.clearLiveSearch = clearLiveSearch;
window.selectSearchProduct = selectSearchProduct;
window.jumpToCatalogWithFilter = jumpToCatalogWithFilter;
window.closeSearchDropdown = closeSearchDropdown;
