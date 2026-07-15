<<<<<<< HEAD
# Wishlist-Project
=======
# Lumière — Premium E-Commerce Storefront with Wishlist

Lumière is a browser-hosted, highly polished e-commerce storefront with a fully featured wishlist system. It is designed with a premium modern dark theme, smooth micro-interactions, responsive grids, and unique AI-generated product imagery for each item.

## Features

- **Dynamic Shop View**: Browse products across multiple categories (Electronics, Clothing, Home, Books, Sports) with live filtering and real-time search.
- **Multiple Named Wishlists**: Create, rename, delete, and view multiple custom lists (e.g., "Holiday Gift List", "My Favorites").
- **Non-Destructive Wishlist Merging**: Combine any two distinct wishlists into a new list.
  - **Union Semantics**: The result contains the union of items from both lists (no items are lost).
  - **Deduplication**: Items are deduplicated by `productId`.
  - **Conflict Resolution**: If both lists contain the same product, the item from the first list (primary) is kept, preserving its original added date and personal notes.
  - **Safety**: The original source wishlists remain fully intact.
- **Custom Item Notes**: Add and update personalized notes (up to 120 characters) for individual items within any wishlist.
- **Persistent Storage**: All wishlists, items, notes, and names are saved in the browser's `localStorage` and persist across reloads.
- **Vibrant UX/UI**: Styled with a cohesive dark palette, subtle glassmorphism headers/modals, glowing transitions, and custom animations.
- **Zero External Dependencies**: Built entirely with Vanilla HTML, CSS, and JS. All images are local, ensuring fast and reliable offline loading.

## File Structure

```
ecommerce-wishlist/
├── index.html          # Main HTML markup and UI templates
├── css/
│   └── style.css       # Complete design system, custom properties, and animations
├── js/
│   ├── data.js         # Curated 20-product catalog
│   ├── store.js        # WishlistStore logic (CRUD, localStorage, and merge logic)
│   └── app.js          # DOM rendering, user event handlers, and routing
└── images/             # Premium AI-generated product photography assets
```

## Getting Started

### Run Locally
Simply open the `index.html` file in any modern web browser:
```bash
# On Windows
start index.html

# On macOS
open index.html

# On Linux
xdg-open index.html
```

---

## Deploy to GitHub Pages

To host this storefront for free on GitHub Pages:

1. Create a new public repository on GitHub.
2. Link the repository to your local clone:
   ```bash
   git remote add origin <your-github-repo-url>
   ```
3. Push your code:
   ```bash
   git push -u origin main
   ```
4. Go to **Settings** > **Pages** in your GitHub repository.
5. Under **Build and deployment**, select **Deploy from a branch** and set the source to `main` (folder: `/root`).
6. Save and your page will be live at `https://<your-username>.github.io/<your-repo-name>/` within a few minutes!
>>>>>>> 47be707 (docs: Add README with features and deployment guide)
