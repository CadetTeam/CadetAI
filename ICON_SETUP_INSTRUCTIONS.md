# App Icon Setup Instructions

To complete the app menu setup, you need to replace the placeholder icon files with your actual icons from the desktop.

## Icon File Structure

The app menu expects icons to be placed in the `public/app-icons/` directory with the following naming convention:

### Light Mode Icons (for dark theme)
- `light-folder.png`
- `light-fingerprint.png`
- `light-key.png`
- `light-add.png`
- `light-search.png`
- `light-create.png`
- `light-new-doc.png`
- `light-pricing.png`
- `light-new-file.png`
- `light-wallet.png`
- `light-cards.png`
- `light-grid.png`
- `light-discount.png`
- `light-new-page.png`
- `light-account.png`
- `light-storage.png`
- `light-search-doc.png`
- `light-modules.png`

### Dark Mode Icons (for light theme)
- `dark-folder.png`
- `dark-fingerprint.png`
- `dark-key.png`
- `dark-add.png`
- `dark-search.png`
- `dark-create.png`
- `dark-new-doc.png`
- `dark-pricing.png`
- `dark-new-file.png`
- `dark-wallet.png`
- `dark-cards.png`
- `dark-grid.png`
- `dark-discount.png`
- `dark-new-page.png`
- `dark-account.png`
- `dark-storage.png`
- `dark-search-doc.png`
- `dark-modules.png`

## How to Add Your Icons

1. Copy your icon files from the desktop to the `public/app-icons/` directory
2. Rename them according to the naming convention above
3. Ensure the icons are PNG format and approximately 24x24 pixels
4. The icons should have transparent backgrounds for best results

## Current App Mapping

The following apps are currently configured:

- **APD GPT** - The main application we've built (uses folder icon)
- **Security** - Security management (uses fingerprint icon)
- **Files** - File management (uses folder icon)
- **Keys** - API key management (uses key icon)
- **Add New** - App creation (uses add icon with "NEW" badge)
- **Identity** - Identity management (uses fingerprint icon)
- **Search** - Search functionality (uses search icon)
- **Create** - Content creation (uses create icon)
- **New Doc** - Document creation (uses new doc icon)
- **Pricing** - Pricing management (uses pricing icon)
- **New File** - File creation (uses new file icon)
- **Wallet** - Digital wallet (uses wallet icon)
- **Cards** - Card management (uses cards icon)
- **Grid** - Grid view (uses grid icon)
- **Discount** - Discount management (uses discount icon)
- **New Page** - Page creation (uses new page icon)
- **Account** - Account management (uses account icon)
- **Storage** - Storage management (uses storage icon)
- **Search Doc** - Document search (uses search doc icon)
- **Modules** - Module management (uses modules icon)

## Testing

Once you've added the icons:

1. Start the development server: `npm run dev`
2. Navigate to the home page (`/app`)
3. You should see the app menu on the left side
4. Click on different app icons to switch between apps
5. The APD GPT app will show the full sidebar, while other apps show empty pages with headers

## Notes

- The app menu is only visible on the home page and non-APDGPT app pages
- The APD GPT app (current functionality) shows the full sidebar
- Other apps show empty placeholder pages with headers
- The floating chat button is available on all pages
