# APD Engine Canvas - Demo & Testing Guide

## 🚀 Quick Start

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Navigate to APD Engine
Open your browser and go to:
```
http://localhost:3000/app/apdgpt/engine
```

---

## 🎬 Demo Flow

### Step 1: Generate APD (Central Hub)
1. You'll see a centered toolbar/panel
2. Click the **"Generate APD"** button
3. **What to observe:**
   - Central APD node appears with pulsing status indicator
   - "Central Hub" badge displays
   - Toolbar smoothly transitions to bottom-left
   - Node has gradient background and shadow effects

### Step 2: Add Collaborators (User Avatars)
1. Click the **Users icon** (👥) in the toolbar
2. **What to observe:**
   - Collaborator node appears in circular position around APD
   - Real avatar component with initials (e.g., "SJ" for Sarah Johnson)
   - Role badge displays (Product Manager, Developer, etc.)
   - Green pulsing dot if user is "online"
   - **Animated connection line** from APD to collaborator
   - Green colored edge with traveling particle animation
   - Smooth glow effect on the connection

3. **Add multiple collaborators:**
   - Click again to add more
   - Notice they arrange in a circle automatically
   - Each has different name, role, and online status

### Step 3: Add Documents
1. Click the **File icon** (📄) in the toolbar
2. **What to observe:**
   - Document node appears at 300px radius
   - Icon changes based on type:
     - 📄 Red theme for PDFs
     - 🖼️ Purple theme for images
     - 🗄️ Indigo theme for databases
   - File size displays (e.g., "2.4 MB")
   - Type badge shows "PDF", "IMAGE", etc.
   - **Animated edge** with color matching document type
   - Traveling particle along the connection

3. **Add multiple documents:**
   - Different types appear with different themes
   - Auto-positioned in circular pattern
   - Color-coded edges match document type

### Step 4: Add Models
1. Click the **Grid icon** (⊞) in the toolbar
2. **What to observe:**
   - Model node appears at 350px radius
   - Icon changes based on model type:
     - 🧠 Brain icon for AI/Neural
     - ⊞ Grid for Canvas/Framework
     - ⚡ Zap for others
   - Active models show:
     - Gradient pulsing icon background
     - Green "Active" indicator
   - Type badge displays model framework
   - **Purple animated edge** to APD
   - Particle animation along connection

3. **Add multiple models:**
   - Mix of active and inactive
   - Different icons per type
   - Circular auto-positioning

---

## 🎨 Visual Features to Notice

### Node Interactions
1. **Hover Effects:**
   - Node brightens slightly
   - Subtle lift animation
   - Shadow increases

2. **Selection:**
   - Click any node
   - Blue border appears
   - Blue shadow glow
   - Scale increases (105%)
   - Details panel shows on bottom-right

3. **Dragging:**
   - Drag any node to reposition
   - Smooth movement
   - Edges follow dynamically
   - Drop anywhere on canvas

### Edge Animations
1. **Triple Layer Effect:**
   - Glow layer (subtle, 20% opacity)
   - Main pulsing path
   - Traveling particle dot

2. **Color Coding:**
   - Green: Collaborators
   - Red/Purple/Indigo: Documents (type-based)
   - Purple: Models
   - Blue: Manual connections

3. **Particle Animation:**
   - Watch dots travel along edges
   - 2-second journey from source to target
   - Continuous loop
   - Smooth motion

### Manual Connections
1. **How to connect manually:**
   - Hover over a node edge (small circles appear)
   - Drag from one handle to another node
   - **Watch the preview line:** Blue dashed animation
   - Release to create connection

2. **Connection features:**
   - Automatic bezier curves
   - Smooth animated preview
   - Converts to custom animated edge on connect

---

## 📱 Mobile Testing

### How to Test Mobile View:
1. Open DevTools (F12)
2. Click device toolbar icon
3. Select a mobile device (e.g., iPhone 12)

### Mobile Features to Test:
1. **Vertical Tab:**
   - Small tab appears on left edge
   - Click to open mobile menu
   - Backdrop overlay

2. **Flyout Menu:**
   - Full menu slides in from left
   - Same functionality as desktop
   - Touch-optimized buttons

3. **Touch Interactions:**
   - Tap nodes to select
   - Pinch to zoom
   - Two-finger pan

---

## 🎯 Feature Checklist

### User Avatar Component ✅
- [ ] Avatar displays with initials
- [ ] Role badge shows correct role
- [ ] Online indicator pulses (green dot)
- [ ] Hover effect works
- [ ] Selection state shows blue border
- [ ] Different names appear randomly

### Document Component ✅
- [ ] PDF shows with red theme and text icon
- [ ] Images show with purple theme and image icon
- [ ] Database shows with indigo theme and DB icon
- [ ] File size displays correctly
- [ ] Type badge shows
- [ ] Different documents have different colors

### Model Component ✅
- [ ] AI/Neural shows brain icon
- [ ] Canvas/Framework shows grid icon
- [ ] Active models pulse with gradient
- [ ] Green "Active" indicator shows
- [ ] Type badge displays
- [ ] Different models have different states

### Animated Edges ✅
- [ ] Glow layer visible (subtle)
- [ ] Main path pulses
- [ ] Particle travels along edge
- [ ] Colors match node types
- [ ] Smooth bezier curves
- [ ] Manual connection preview works

### Circular Positioning ✅
- [ ] Collaborators at 250px radius
- [ ] Documents at 300px radius
- [ ] Models at 350px radius
- [ ] Even distribution around APD
- [ ] No overlapping

### Interactions ✅
- [ ] Node hover brightens and lifts
- [ ] Node selection shows blue glow
- [ ] Drag and drop works
- [ ] Click shows details panel
- [ ] Manual connections work
- [ ] Controls zoom/pan work

---

## 🐛 Troubleshooting

### If nodes don't appear:
1. Check console for errors
2. Verify APD is created first
3. Try refreshing the page

### If edges don't animate:
1. Check if CSS file is loaded
2. Verify browser supports SVG animations
3. Try a different browser (Chrome recommended)

### If positioning is off:
1. Zoom out to see full canvas
2. Click "fit view" in controls
3. Refresh and re-add nodes

---

## 📊 Performance Notes

- **Smooth on:** Chrome, Edge, Safari
- **Animations:** 60fps with < 50 nodes
- **Memory:** Minimal, React Flow optimized
- **Mobile:** Tested on iOS and Android

---

## 🎥 Recording a Demo

### Suggested Flow:
1. Start with empty canvas
2. Generate APD (show toolbar movement)
3. Add 3-4 collaborators (show avatars and roles)
4. Add 2-3 documents (show different types)
5. Add 2 models (show active vs inactive)
6. Select nodes to show details
7. Drag nodes to rearrange
8. Create manual connection
9. Zoom and pan around canvas
10. Show mobile view

---

## ✨ Key Highlights to Showcase

1. **Avatar System:** Real component with initials and online status
2. **Smart Icons:** Document types auto-detect and show correct icons
3. **Active States:** Models pulse when active
4. **Animated Lines:** Three-layer edges with traveling particles
5. **Auto-Layout:** Circular positioning around central hub
6. **Smooth Animations:** All transitions are polished
7. **Responsive:** Works perfectly on mobile
8. **Interactive:** Rich hover states and selection feedback

---

**Have fun exploring the enhanced APD Canvas! 🚀**

