# Lumière Storefront & Wishlist — v1 Product Specification

This document outlines the first-pass product requirements, data design, and technical decisions for the storefront and wishlist project, drafted before the build phase.

---

## 1. Product Vision & Goals
Build a simple, browser-hosted e-commerce catalog featuring a robust, multi-list wishlist management system. The primary goal is to provide a highly polished client-side experience with a single concrete functional requirement: **the ability to merge two distinct wishlists into one**.

---

## 2. Core Features (v1 Scope)

### A. Storefront Browser
- **Product Catalog**: A curated list of 16 hardcoded items across 5 core categories (Electronics, Clothing, Home, Books, Sports).
- **Search & Filter**: Real-time product search by keyword and category filters to locate items quickly.
- **Dynamic Category Images**: Visual assets tailored to represent each product category.

### B. Wishlist Management (CRUD)
- **Multiple Wishlists**: Users can create, view, rename, and delete multiple custom-named wishlists.
- **Idempotency**: Adding a product to a specific wishlist is idempotent; duplicates are ignored.
- **Item Customisation**: Users can attach optional, personal notes (up to 120 characters) to any item in a wishlist.

### C. Wishlist Merging (The Hard Requirement)
- **Trigger**: Select any two wishlists from the dashboard to merge them.
- **Non-Destructive Execution**: The two original wishlists remain unchanged. A new wishlist is created named `[List A] + [List B]`.
- **Deduplication**: Items are combined and deduplicated based on `productId`.
- **Conflict Resolution**: If the same product exists in both lists, the item from the primary list (List A) takes precedence, keeping its notes and addition timestamp.

---

## 3. Data Architecture (v1 Data Shapes)

### Product Shape
```json
{
  "id": "string (UUID)",
  "name": "string",
  "category": "string (Electronics | Clothing | Home | Books | Sports)",
  "price": "number (USD)",
  "description": "string",
  "image": "string (local file path)",
  "rating": "number (1.0–5.0)",
  "inStock": "boolean"
}
```

### Wishlist Shape
```json
{
  "id": "string (UUID)",
  "name": "string",
  "createdAt": "ISO 8601 string",
  "items": [WishlistItem]
}
```

### WishlistItem Shape
```json
{
  "productId": "string",
  "addedAt": "ISO 8601 string",
  "note": "string (optional)"
}
```

---

## 4. Technical Infrastructure & Persistence
- **Runtime**: Client-side Vanilla HTML5, CSS3, and modern JavaScript (ES6+).
- **State Management**: Encapsulated state object in memory for active filters, search keywords, and views.
- **Persistence**: Wishlists are stored as JSON strings in the browser's `localStorage` (key: `wishlist_store`). A default "My Wishlist" is initialized automatically on first load if no storage is found.
- **Hosting**: Designed to run as a static website, fully ready to host on GitHub Pages without any database or backend server.
