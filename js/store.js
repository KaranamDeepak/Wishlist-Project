// js/store.js — WishlistStore: all localStorage reads/writes and wishlist CRUD

class WishlistStore {
  constructor() {
    this.STORAGE_KEY = "wishlist_store";
    this._ensureDefaults();
  }

  // ── Internal helpers ────────────────────────────────────────────────────────

  _load() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  _save(lists) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lists));
  }

  _generateId() {
    return "wl_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  _ensureDefaults() {
    const lists = this._load();
    if (lists.length === 0) {
      this._save([
        {
          id: this._generateId(),
          name: "My Wishlist",
          createdAt: new Date().toISOString(),
          items: []
        }
      ]);
    }
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  /** Returns all wishlists */
  getLists() {
    return this._load();
  }

  /** Returns a single wishlist by id, or null */
  getList(id) {
    return this._load().find(l => l.id === id) || null;
  }

  /** Creates a new empty wishlist. Returns the created list. */
  createList(name) {
    const lists = this._load();
    const newList = {
      id: this._generateId(),
      name: name.trim() || "New Wishlist",
      createdAt: new Date().toISOString(),
      items: []
    };
    lists.push(newList);
    this._save(lists);
    return newList;
  }

  /** Deletes a wishlist by id. Returns true if deleted, false if not found. */
  deleteList(id) {
    const lists = this._load();
    const filtered = lists.filter(l => l.id !== id);
    if (filtered.length === lists.length) return false;
    this._save(filtered);
    return true;
  }

  /** Renames a wishlist. Returns updated list or null. */
  renameList(id, newName) {
    const lists = this._load();
    const list = lists.find(l => l.id === id);
    if (!list) return null;
    list.name = newName.trim() || list.name;
    this._save(lists);
    return list;
  }

  /**
   * Adds a product to a wishlist. Idempotent — if productId already in list,
   * does nothing and returns false. Returns true on success.
   */
  addItem(listId, productId, note = "") {
    const lists = this._load();
    const list = lists.find(l => l.id === listId);
    if (!list) return false;
    const alreadyIn = list.items.some(i => i.productId === productId);
    if (alreadyIn) return false;
    list.items.push({
      productId,
      addedAt: new Date().toISOString(),
      note: note.trim()
    });
    this._save(lists);
    return true;
  }

  /** Removes a product from a wishlist. Returns true on success. */
  removeItem(listId, productId) {
    const lists = this._load();
    const list = lists.find(l => l.id === listId);
    if (!list) return false;
    const before = list.items.length;
    list.items = list.items.filter(i => i.productId !== productId);
    this._save(lists);
    return list.items.length < before;
  }

  /** Updates the note on a wishlist item. Returns true on success. */
  updateItemNote(listId, productId, note) {
    const lists = this._load();
    const list = lists.find(l => l.id === listId);
    if (!list) return false;
    const item = list.items.find(i => i.productId === productId);
    if (!item) return false;
    item.note = note.trim();
    this._save(lists);
    return true;
  }

  /**
   * Merges two wishlists into a new list.
   *
   * Merge semantics (as per spec):
   *  - Non-destructive: both source lists remain intact.
   *  - New list name: "<ListA name> + <ListB name>"
   *  - Items deduplicated by productId.
   *  - On conflict (same product in both lists), ListA's item wins
   *    (preserves ListA's addedAt and note).
   *
   * Returns the newly created merged list, or null if either id is invalid.
   */
  mergeLists(listAId, listBId) {
    const lists = this._load();
    const listA = lists.find(l => l.id === listAId);
    const listB = lists.find(l => l.id === listBId);
    if (!listA || !listB) return null;

    // Build merged items: start with all of A, add B items not in A
    const mergedItems = [...listA.items];
    const aProductIds = new Set(listA.items.map(i => i.productId));
    for (const item of listB.items) {
      if (!aProductIds.has(item.productId)) {
        mergedItems.push({ ...item });
      }
    }

    const mergedList = {
      id: this._generateId(),
      name: `${listA.name} + ${listB.name}`,
      createdAt: new Date().toISOString(),
      items: mergedItems
    };

    lists.push(mergedList);
    this._save(lists);
    return mergedList;
  }
}

// Singleton
window.store = new WishlistStore();
