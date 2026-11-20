# 🎣 Fishing Point — Premium Fishing Tackle & Angling Gear Website

A modern, high-converting responsive website for **Fishing Point** tackle shop, built for local and coastal anglers.

## 🚀 Key Features
- **Ocean Navy & Deep Sea Design**: Custom ocean palette (`#040d1a`, `#00adb5`, `#ff7b00`) with high-resolution imagery and sleek dark UI.
- **Dynamic Category Filtering**: Live client-side tabs for Rods, Reels, Lures & Metal Jigs, Lines & Braids, and Accessories.
- **Real-Time Live Search**: Instant search bar to filter gear by brand, specs, or fish type.
- **1-Click WhatsApp Enquiry**: Every product card has an instant WhatsApp enquiry button with pre-filled product name and price reference.
- **Lead Capture Form**: Direct enquiry form formatting customer requirements into structured WhatsApp messages.
- **Angler's Trophy Wall (Brag Board)**: Showcases real customer catches (GT, Barramundi, Mangrove Jack) to establish strong local credibility.
- **Floating Sticky WhatsApp Button**: Maximize mobile conversion for anglers inquiring on the go.

## 📂 File Structure
```
fishing-point-website/
├── index.html        # Complete semantic HTML5 structure with Tailwind CDN
├── styles.css        # Custom scrollbar, glassmorphism, glowing utility effects
├── script.js         # Interactive filtering, search, and WhatsApp message builder
├── assets/           # Local images and branding assets
└── README.md         # Documentation
```

## ⚙️ How to Customize WhatsApp Number
Open `script.js` line 11:
```javascript
const STORE_WHATSAPP_NUMBER = "919876543210"; // Replace with client's actual 10-digit WhatsApp number with 91 country code
```
Also update `index.html` header phone links and numbers.
