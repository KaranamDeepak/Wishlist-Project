// js/app.js — UI rendering + event handling

// ── State ────────────────────────────────────────────────────────────────────
const state = {
  view: "shop",              // "shop" | "wishlists" | "detail"
  activeListId: null,        // for detail view
  categoryFilter: "All",
  searchQuery: "",
  mergeSelection: new Set(), // holds up to 2 list IDs for merge
  pendingProductId: null     // product being added to wishlist
};

// ── DOM refs ─────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── Router ───────────────────────────────────────────────────────────────────
function navigate(view, listId = null) {
  state.view = view;
  state.activeListId = listId;
  state.mergeSelection.clear();
  render();
}

// ── Top-level render ─────────────────────────────────────────────────────────
function render() {
  // Nav highlight
  document.querySelectorAll(".nav-link").forEach(el => {
    el.classList.toggle("active", el.dataset.view === state.view ||
      (state.view === "detail" && el.dataset.view === "wishlists"));
  });

  // Wishlist count badge
  const totalItems = store.getLists().reduce((sum, l) => sum + l.items.length, 0);
  const badge = $("wishlist-badge");
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? "inline-flex" : "none";

  // Views
  $("shop-view").style.display = state.view === "shop" ? "block" : "none";
  $("wishlists-view").style.display = state.view === "wishlists" ? "block" : "none";
  $("detail-view").style.display = state.view === "detail" ? "block" : "none";

  if (state.view === "shop") renderShop();
  if (state.view === "wishlists") renderWishlists();
  if (state.view === "detail") renderDetail();
}

// ── Shop View ────────────────────────────────────────────────────────────────
function renderShop() {
  const categories = ["All", ...new Set(window.PRODUCTS.map(p => p.category))];
  const filtersEl = $("category-filters");
  filtersEl.innerHTML = categories.map(cat =>
    `<button class="filter-btn ${cat === state.categoryFilter ? "active" : ""}" data-cat="${cat}">${cat}</button>`
  ).join("");

  const query = state.searchQuery.toLowerCase();
  const filtered = window.PRODUCTS.filter(p => {
    const matchCat = state.categoryFilter === "All" || p.category === state.categoryFilter;
    const matchSearch = !query ||
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  const grid = $("product-grid");
  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state"><p>No products match your search.</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const stars = renderStars(p.rating);
    return `
    <article class="product-card" data-id="${p.id}">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" />
        ${!p.inStock ? `<span class="out-of-stock-badge">Out of Stock</span>` : ""}
      </div>
      <div class="product-body">
        <span class="product-category">${p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-footer">
          <div class="product-meta">
            <span class="product-price">$${p.price.toFixed(2)}</span>
            <span class="product-rating">${stars} <span class="rating-num">${p.rating}</span></span>
          </div>
          <button class="btn-add-wish" data-product-id="${p.id}" aria-label="Add ${p.name} to wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            Wishlist
          </button>
        </div>
      </div>
    </article>`;
  }).join("");
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = "";
  for (let i = 0; i < full; i++) html += "★";
  if (half) html += "½";
  return `<span class="stars">${html}</span>`;
}

// ── Wishlists View ───────────────────────────────────────────────────────────
function renderWishlists() {
  const lists = store.getLists();
  const mergeCount = state.mergeSelection.size;

  $("merge-btn").disabled = mergeCount !== 2;
  $("merge-hint").textContent =
    mergeCount === 0 ? "Select two wishlists to merge them." :
    mergeCount === 1 ? "Select one more wishlist to merge." :
    "Ready to merge!";
  $("merge-btn").classList.toggle("ready", mergeCount === 2);

  const container = $("wishlists-container");
  if (lists.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>No wishlists yet. Create one!</p></div>`;
    return;
  }

  container.innerHTML = lists.map(list => {
    const itemCount = list.items.length;
    const selected = state.mergeSelection.has(list.id);
    const preview = list.items.slice(0, 3).map(item => {
      const prod = window.PRODUCTS.find(p => p.id === item.productId);
      return prod ? `<img src="${prod.image}" alt="${prod.name}" class="list-preview-img" title="${prod.name}" />` : "";
    }).join("");

    return `
    <div class="wishlist-card ${selected ? "merge-selected" : ""}" data-list-id="${list.id}">
      <div class="wishlist-card-header">
        <div class="wishlist-check-wrap">
          <input type="checkbox" class="merge-checkbox" id="merge-${list.id}"
            data-list-id="${list.id}" ${selected ? "checked" : ""}
            ${!selected && mergeCount >= 2 ? "disabled" : ""} />
          <label for="merge-${list.id}" class="sr-only">Select for merge</label>
        </div>
        <div class="wishlist-info">
          <h3 class="wishlist-name">${escapeHtml(list.name)}</h3>
          <p class="wishlist-meta">${itemCount} item${itemCount !== 1 ? "s" : ""} · Created ${formatDate(list.createdAt)}</p>
        </div>
        <div class="wishlist-actions">
          <button class="btn-icon btn-view-list" data-list-id="${list.id}" title="View list">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="btn-icon btn-delete-list" data-list-id="${list.id}" data-list-name="${escapeHtml(list.name)}" title="Delete list">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      </div>
      ${preview ? `<div class="list-previews">${preview}</div>` : ""}
    </div>`;
  }).join("");
}

// ── Detail View ──────────────────────────────────────────────────────────────
function renderDetail() {
  const list = store.getList(state.activeListId);
  if (!list) { navigate("wishlists"); return; }

  $("detail-list-name").textContent = list.name;
  $("detail-item-count").textContent = `${list.items.length} item${list.items.length !== 1 ? "s" : ""}`;

  const container = $("detail-items");
  if (list.items.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>This wishlist is empty. <a href="#" class="link" id="go-shop-link">Browse the shop</a> to add items.</p></div>`;
    return;
  }

  container.innerHTML = list.items.map(item => {
    const prod = window.PRODUCTS.find(p => p.id === item.productId);
    if (!prod) return "";
    return `
    <div class="detail-item" data-product-id="${prod.id}">
      <img src="${prod.image}" alt="${prod.name}" class="detail-item-img" />
      <div class="detail-item-body">
        <div class="detail-item-top">
          <div>
            <span class="product-category">${prod.category}</span>
            <h4 class="detail-item-name">${prod.name}</h4>
            <span class="product-price">$${prod.price.toFixed(2)}</span>
          </div>
          <button class="btn-icon btn-remove-item" data-product-id="${prod.id}" title="Remove from list">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="note-wrap">
          <input type="text" class="note-input" placeholder="Add a note…"
            value="${escapeHtml(item.note || "")}"
            data-product-id="${prod.id}" maxlength="120" />
        </div>
        <p class="item-added-date">Added ${formatDate(item.addedAt)}</p>
      </div>
    </div>`;
  }).join("");
}

// ── Modal ────────────────────────────────────────────────────────────────────
function showModal(productId) {
  state.pendingProductId = productId;
  const lists = store.getLists();
  const prod = window.PRODUCTS.find(p => p.id === productId);

  $("modal-product-name").textContent = prod ? prod.name : "";

  const listSelect = $("modal-list-select");
  listSelect.innerHTML = lists.map(l =>
    `<option value="${l.id}">${escapeHtml(l.name)} (${l.items.length} items)</option>`
  ).join("");

  $("modal-note").value = "";
  $("modal-overlay").classList.add("open");
  $("modal-list-select").focus();
}

function closeModal() {
  $("modal-overlay").classList.remove("open");
  state.pendingProductId = null;
}

// ── Create list inline ───────────────────────────────────────────────────────
function showCreateListForm() {
  $("create-list-form").style.display = "flex";
  $("new-list-name-input").value = "";
  $("new-list-name-input").focus();
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Event Delegation ─────────────────────────────────────────────────────────
document.addEventListener("click", e => {
  // Nav
  const navLink = e.target.closest(".nav-link");
  if (navLink) {
    navigate(navLink.dataset.view);
    return;
  }

  // Category filter
  const filterBtn = e.target.closest(".filter-btn");
  if (filterBtn) {
    state.categoryFilter = filterBtn.dataset.cat;
    renderShop();
    return;
  }

  // Add to wishlist button
  const addWishBtn = e.target.closest(".btn-add-wish");
  if (addWishBtn) {
    showModal(addWishBtn.dataset.productId);
    return;
  }

  // Modal: confirm add
  if (e.target.id === "modal-confirm") {
    const listId = $("modal-list-select").value;
    const note = $("modal-note").value;
    if (listId && state.pendingProductId) {
      const added = store.addItem(listId, state.pendingProductId, note);
      if (!added) {
        $("modal-feedback").textContent = "Already in this list!";
        $("modal-feedback").style.display = "block";
        return;
      }
    }
    closeModal();
    render();
    return;
  }

  // Modal: create new list from modal
  if (e.target.id === "modal-create-list") {
    const name = prompt("Name your new wishlist:");
    if (name && name.trim()) {
      const newList = store.createList(name);
      showModal(state.pendingProductId); // re-open with updated list
    }
    return;
  }

  // Modal: cancel
  if (e.target.id === "modal-cancel" || e.target.id === "modal-overlay") {
    if (e.target.id === "modal-overlay" && e.target !== $("modal-overlay")) return;
    closeModal();
    return;
  }

  // View list
  const viewBtn = e.target.closest(".btn-view-list");
  if (viewBtn) {
    navigate("detail", viewBtn.dataset.listId);
    return;
  }

  // Delete list
  const deleteBtn = e.target.closest(".btn-delete-list");
  if (deleteBtn) {
    const name = deleteBtn.dataset.listName;
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      store.deleteList(deleteBtn.dataset.listId);
      render();
    }
    return;
  }

  // Remove item from detail
  const removeItem = e.target.closest(".btn-remove-item");
  if (removeItem) {
    store.removeItem(state.activeListId, removeItem.dataset.productId);
    renderDetail();
    render(); // update badge
    return;
  }

  // Back button in detail
  if (e.target.id === "detail-back-btn") {
    navigate("wishlists");
    return;
  }

  // Go to shop from empty detail
  if (e.target.id === "go-shop-link") {
    e.preventDefault();
    navigate("shop");
    return;
  }

  // Create list button
  if (e.target.id === "btn-create-list") {
    showCreateListForm();
    return;
  }

  // Submit new list
  if (e.target.id === "create-list-submit") {
    const name = $("new-list-name-input").value.trim();
    if (name) {
      store.createList(name);
      $("create-list-form").style.display = "none";
      render();
    }
    return;
  }

  // Cancel new list
  if (e.target.id === "create-list-cancel") {
    $("create-list-form").style.display = "none";
    return;
  }

  // Merge button
  if (e.target.id === "merge-btn" && !e.target.disabled) {
    const [idA, idB] = [...state.mergeSelection];
    const merged = store.mergeLists(idA, idB);
    if (merged) {
      state.mergeSelection.clear();
      showToast(`Created "${merged.name}" with ${merged.items.length} item${merged.items.length !== 1 ? "s" : ""}.`);
      render();
    }
    return;
  }
});

// Merge checkbox change
document.addEventListener("change", e => {
  const cb = e.target.closest(".merge-checkbox");
  if (cb) {
    const id = cb.dataset.listId;
    if (cb.checked) {
      if (state.mergeSelection.size < 2) state.mergeSelection.add(id);
      else cb.checked = false;
    } else {
      state.mergeSelection.delete(id);
    }
    renderWishlists();
    return;
  }

  // Note input blur — save note
  const noteInput = e.target.closest(".note-input");
  if (noteInput) {
    store.updateItemNote(state.activeListId, noteInput.dataset.productId, noteInput.value);
    return;
  }
});

// Note input: save on blur
document.addEventListener("focusout", e => {
  const noteInput = e.target.closest(".note-input");
  if (noteInput && state.activeListId) {
    store.updateItemNote(state.activeListId, noteInput.dataset.productId, noteInput.value);
  }
});

// Search
document.addEventListener("input", e => {
  if (e.target.id === "search-input") {
    state.searchQuery = e.target.value;
    renderShop();
  }
});

// Close modal on overlay click
$("modal-overlay").addEventListener("click", e => {
  if (e.target === $("modal-overlay")) closeModal();
});

// Clear modal feedback on list select change
$("modal-list-select").addEventListener("change", () => {
  $("modal-feedback").style.display = "none";
});

// ── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const toast = $("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

// ── Init ─────────────────────────────────────────────────────────────────────
render();
