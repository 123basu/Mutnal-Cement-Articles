# Features Added

## 1. Admin Panel — Password Fix

**Files modified:** `.env.local`

- The `#` character in `.env` files is treated as a comment start. The admin password `Ravindram@#2026` was being truncated to `Ravindram@` when loaded from `.env.local`.
- **Fix:** Wrap the password in quotes: `ADMIN_PASSWORD="Ravindram@#2026"`

---

## 2. Admin Panel — Local Development Mode for Deliveries

**Files modified:**
- `src/lib/github.ts`
- `src/app/api/admin/deliveries/route.ts`

- The deliveries admin panel reads/writes via the GitHub API. Running locally failed because the GitHub token returned **401 Unauthorized**, causing the GET endpoint to fail (no SHA returned) and subsequently the POST endpoint to reject with "sha is required".
- **Fix:** Added `readDeliveriesLocal()` and `writeDeliveriesLocal()` functions in `github.ts`. When `NODE_ENV === "development"`, the API routes read/write the local `src/data/deliveries.json` file directly instead of calling the GitHub API.

---

## 3. Delivery Popup — Customer Name Bug Fix

**Files modified:**
- `src/components/DeliveryPopup.tsx`

- The delivery map popup card showed the **city** name next to the "Customer" label instead of the customer name.
- **Fix:** Changed both the government and regular popup variants from `<Row label="Customer" value={d.city} />` to `<Row label="Customer" value={d.customerName} />`.

---

## 4. Contact Page — "Locate Us" Button

**Files modified:**
- `src/app/[locale]/contact/page.tsx`
- `src/messages/en.json`
- `src/messages/kn.json`
- `src/messages/hi.json`

- Added a **Locate Us** button on the contact page that opens Google Maps directions to the factory location (`15.713794, 74.700944`).
- Added translation keys for all three languages.

---

## 5. Admin Panel — Products CRUD

**New files:**
- `src/data/products.json`
- `src/app/api/admin/products/route.ts`
- `src/app/api/admin/upload/route.ts`
- `src/components/admin/ProductForm.tsx`
- `public/images/products/` (directory)

**Modified files:**
- `src/lib/types.ts` — added `AdminProduct` interface
- `src/lib/github.ts` — added `readProducts()` / `writeProducts()`
- `src/app/[locale]/admin/(protected)/layout.tsx`
- `src/components/admin/AdminNav.tsx` — added "Products" tab

**Admin URL:** `/en/admin/products`

### Features
- View all products
- Add a new product (name, description, specs, image)
- Edit an existing product
- Delete a product
- **Image upload:** Click "Upload Image" → OS file picker → saves to `public/images/products/` → thumbnail preview
- Images use unique filenames to avoid collisions

---

## 6. Admin Panel — Blog CRUD

**New files:**
- `src/data/blogs.json`
- `src/app/api/admin/blogs/route.ts`
- `src/components/admin/BlogForm.tsx`
- `src/components/blog/AdminBlogCard.tsx`

**Modified files:**
- `src/lib/types.ts` — added `AdminBlog` interface
- `src/lib/github.ts` — added `readBlogs()` / `writeBlogs()`
- `src/components/admin/AdminNav.tsx` — added "Blog" tab

**Admin URL:** `/en/admin/blog`

### Features
- View all blog posts
- Add a new blog (category, title, description, author, date, reading time, content)
- Edit an existing blog
- Delete a blog
- **Content field** supports Markdown (headings, bold, blockquotes, lists)

---

## 7. Admin Panel — Tabbed Navigation

**New files:**
- `src/components/admin/AdminNav.tsx`

**Modified files:**
- `src/app/[locale]/admin/(protected)/layout.tsx` — protected layout with auth + nav

All admin pages are protected behind the same session-based authentication. The login page sits outside the protected route group to avoid redirect loops.

### Admin Tabs
| Tab | URL | Description |
|-----|-----|-------------|
| Deliveries | `/en/admin` | Manage delivery map entries |
| Products | `/en/admin/products` | Manage products |
| Blog | `/en/admin/blog` | Manage blog posts |
| Contact Messages | `/en/admin/contacts` | View contact form submissions |

---

## 8. Public Products Page — Dynamic Content

**Files modified:**
- `src/app/[locale]/products/page.tsx`
- `src/app/[locale]/page.tsx`

- Removed hardcoded `STATIC_PRODUCTS` array.
- Products page now reads exclusively from `src/data/products.json`.
- Home page "Featured Products" section reads from the same JSON file.
- Adding/editing/deleting products in the admin panel immediately reflects on both pages (requires rebuild for static pages, or works instantly with `npm run dev`).

---

## 9. Public Blog Page — Dynamic Content

**Files modified:**
- `src/app/[locale]/blog/page.tsx`
- `src/app/[locale]/blog/[slug]/page.tsx`
- `src/lib/blog.ts`
- `src/app/[locale]/blog/[slug]/page.tsx`

- Removed old MDX blog files (`src/content/blog/choosing-right-brick.mdx`, `src/content/blog/why-flyash-bricks.mdx`).
- Blog listing page now reads from `src/data/blogs.json`.
- Blog detail pages are generated for each admin-managed blog slug.
- Content is rendered with basic Markdown support (headings, bold, blockquotes, lists).

---

## 10. Contact Form — Fully Functional

**New files:**
- `src/data/contacts.json`
- `src/app/api/contact/route.ts`
- `src/app/api/admin/contacts/route.ts`
- `src/components/ContactForm.tsx`
- `src/components/admin/ContactMessages.tsx`
- `src/app/[locale]/admin/(protected)/contacts/page.tsx`

**Modified files:**
- `src/lib/types.ts` — added `ContactMessage` interface
- `src/lib/github.ts` — added `readContacts()` / `writeContacts()` / `appendContact()`
- `src/components/admin/AdminNav.tsx` — added "Contact Messages" tab
- `src/app/[locale]/contact/page.tsx` — replaced static form with `ContactForm` component

### Public Contact Form
- Validates all required fields (name, email, phone, message)
- Validates email format
- Shows inline validation errors
- On success: shows "Thanks!" message and clears the form
- Submissions saved to `src/data/contacts.json`

### Admin Contact Messages
**Admin URL:** `/en/admin/contacts`
- Lists all submissions sorted newest-first
- Displays name, email, phone, message, and timestamp
- Each message has a Delete button with confirmation
- Deleting immediately removes from the UI and `contacts.json`

---

## Summary of All New Files

```
src/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── blogs/route.ts
│   │   │   ├── contacts/route.ts
│   │   │   ├── products/route.ts
│   │   │   └── upload/route.ts
│   │   └── contact/route.ts
│   └── [locale]/
│       └── admin/
│           └── (protected)/
│               ├── layout.tsx
│               ├── page.tsx
│               ├── blog/page.tsx
│               ├── contacts/page.tsx
│               └── products/page.tsx
├── components/
│   ├── admin/
│   │   ├── AdminNav.tsx
│   │   ├── BlogForm.tsx
│   │   ├── ContactMessages.tsx
│   │   └── ProductForm.tsx
│   ├── blog/
│   │   └── AdminBlogCard.tsx
│   └── ContactForm.tsx
└── data/
    ├── blogs.json
    ├── contacts.json
    └── products.json

public/images/products/    ← uploaded product images
```
