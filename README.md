# M&M Pet Store – Shopify Theme

A professional, mobile-first Shopify Online Store 2.0 theme for **M&M Pet Store**, a dropshipping pet supplies brand. Built with clean Liquid, vanilla JS, and a single CSS file — no build tools required.

---

## 🚀 How to Import the Theme into Shopify

### Option 1: Upload a ZIP file

1. On your computer, navigate to the `theme/` directory of this repository.
2. Zip **the contents** of the `theme/` folder (not the folder itself) — the ZIP should contain `layout/`, `templates/`, `sections/`, etc. at the root level.

   ```bash
   cd theme && zip -r ../mm-pet-store-theme.zip .
   ```

3. In your Shopify Admin, go to **Online Store → Themes**.
4. Click **Add theme → Upload zip file**.
5. Upload `mm-pet-store-theme.zip`.
6. Click **Publish** once uploaded.

### Option 2: Connect via GitHub (Shopify Partners / Developer stores)

1. In Shopify Admin, go to **Online Store → Themes → Add theme → Connect from GitHub**.
2. Authorize Shopify and select the `elvinhatamov/pet_store` repository.
3. Choose the branch (`main`) and set the theme root to `theme/`.
4. Click **Connect**.

---

## 🎨 Customizing the Theme

All customizations are available in the **Shopify Theme Editor** (Online Store → Themes → Customize):

| Setting | Where to find it |
|---|---|
| Colors (primary, accent, etc.) | Theme Settings → Colors |
| Fonts (headings, body) | Theme Settings → Typography |
| Favicon | Theme Settings → Favicon |
| Social media links | Theme Settings → Social media |
| Announcement bar text | Sections → Announcement bar |
| Logo image | Sections → Header |
| Navigation menu | Sections → Header |
| Hero banner image & text | Sections → Hero Banner |
| Featured collections | Sections → Featured Collections |
| Best sellers products | Sections → Featured Products |
| Trust badges text | Sections → Trust Badges |
| Customer testimonials | Sections → Testimonials |
| Newsletter heading | Sections → Newsletter |
| Footer links & social | Sections → Footer |

---

## 📁 Theme Structure

```
theme/
├── layout/
│   └── theme.liquid          # Main layout (head, body, cart drawer, search overlay)
├── templates/
│   ├── index.json            # Home page
│   ├── collection.json       # Collection page
│   ├── product.json          # Product page
│   ├── cart.json             # Cart page
│   ├── search.json           # Search results
│   ├── page.json             # Generic page (About, Contact, FAQ, etc.)
│   ├── blog.json             # Blog listing
│   ├── article.json          # Blog post
│   ├── 404.json              # Not found
│   ├── password.liquid       # Password / coming soon page
│   └── customers/            # Customer account templates
├── sections/                 # Reusable, customizable sections
├── snippets/                 # Reusable Liquid partials
├── assets/
│   ├── base.css              # All styles (mobile-first, CSS custom properties)
│   └── theme.js              # Vanilla JS (menu, cart drawer, variants, AJAX cart)
├── config/
│   ├── settings_schema.json  # Theme Editor settings definition
│   └── settings_data.json    # Default setting values
└── locales/
    └── en.default.json       # English strings
```

---

## ✨ Features

- **Mobile-first** responsive design with breakpoints at 768px and 1024px
- **AJAX cart drawer** — add to cart without page reload, update quantities, remove items
- **Search overlay** — accessible search modal
- **Variant selector** — updates price and availability live
- **Product image gallery** — clickable thumbnails
- **Collapsible tabs** on product page (Description, Shipping Info, Returns Policy)
- **JSON-LD structured data** on product pages for SEO
- **OpenGraph + Twitter Card** meta tags on all pages
- **Trust badges** section (Free Shipping, Easy Returns, Secure Checkout, 24/7 Support)
- **Testimonials** section with star ratings
- **Newsletter signup** with Shopify customer form
- **Announcement bar** with close button
- **Keyboard navigation** and ARIA labels throughout
- **System font stack** by default (no external font loading required)

---

## ⚠️ Limitations & Notes

- **Placeholder images**: The hero banner and featured collections require images to be set in the Theme Editor. Without images, a colored background is shown.
- **Navigation menus**: The header uses a `main-menu` linklist by default. Create a menu named `main-menu` in Shopify Admin → Navigation, or select a different menu in the Theme Editor.
- **Footer link columns**: Create linklists in Shopify Admin → Navigation with handles `footer-1`, `footer-2`, `footer-3` to populate footer link columns.
- **Product recommendations**: Related products on the product page use the first collection the product belongs to as a fallback. For full Shopify product recommendations, the theme is set up to work with Shopify's recommendations API.
- **Dropshipping note**: Shipping info and returns policy text on product pages can be customized per-section in the Theme Editor.
- **No build tools**: This theme ships as-is and requires no Node.js, webpack, or other build step.

---

## 📄 License

This theme is provided for use with the M&M Pet Store Shopify store.