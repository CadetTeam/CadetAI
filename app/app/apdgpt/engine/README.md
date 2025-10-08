# APD Engine - Enhanced React Flow Canvas

## Overview

The APD Engine is a fully functional, interactive canvas built with React Flow that visualizes connections between an APD (Automated Process Documentation) and various entities like collaborators, documents, and models.

## Features

### 🎨 Enhanced Node Components

#### 1. **APD Node (Central Hub)**
- Gradient background with smooth transitions
- Pulsing status indicator with animations
- Shows "Central Hub" badge when it's the main APD
- Shadow effects that respond to selection state
- Scale animation on hover and selection

#### 2. **Collaborator Node (User Avatar)**
- **Real Avatar Support**: Uses Radix UI Avatar component
- **Online Status**: Shows green pulsing indicator when user is online
- **Role Badge**: Displays user role (Product Manager, Developer, Designer, etc.)
- **Initials Fallback**: Automatically generates initials from name if no avatar URL provided
- **Gradient Avatar Background**: Beautiful gradient for fallback avatars
- **Responsive Design**: Adapts to different screen sizes

#### 3. **Document Node**
- **Smart Icon Detection**: Automatically shows appropriate icon based on file type
  - PDF: FileTextIcon (red theme)
  - Images: ImageIcon (purple theme)
  - Database/SQL: Database icon (indigo theme)
- **File Size Display**: Shows document size
- **Type Badge**: Displays document type
- **Color-coded Themes**: Different gradient backgrounds per file type
- **Truncated Labels**: Long filenames are elegantly truncated

#### 4. **Model Node**
- **Dynamic Icons**: Different icons for AI, Canvas, Framework, Neural models
- **Active State Indicator**: Shows pulsing green dot when model is active
- **Gradient Backgrounds**: Beautiful purple-to-violet gradients
- **Type Badges**: Clear model type identification
- **Active Animation**: Icon pulses when model is running

### 🌊 Animated Connection Lines

#### Custom Edge Component
- **Glow Effect**: Background path with reduced opacity for glow
- **Pulse Animation**: Main path pulses smoothly
- **Traveling Particles**: Animated dots travel along the edge path
- **Color Coding**: Different colors for different connection types:
  - Collaborators: Green (#10b981)
  - Documents: Red/Purple/Indigo (based on type)
  - Models: Purple (#8b5cf6)
- **Bezier Curves**: Smooth, curved connections using getBezierPath
- **Dashed Connection Line**: Preview line when manually connecting nodes

### 📐 Smart Positioning

#### Circular Auto-Arrangement
- Nodes are automatically positioned in a circular pattern around the APD
- Different radius for different node types:
  - Collaborators: 250px radius
  - Documents: 300px radius
  - Models: 350px radius
- Prevents overlapping and creates organized layouts
- Counter system tracks node placement for optimal distribution

### 🎭 Animations & Transitions

#### CSS Animations
- **Node Appearance**: Fade-in and scale-up when nodes are added
- **Edge Flow**: Animated dash pattern flowing along edges
- **Hover Effects**: Nodes lift slightly on hover with brightness increase
- **Handle Scaling**: Connection handles grow when hovered
- **Pulse Effects**: Status indicators and active states pulse smoothly
- **Background Pan**: Subtle background pattern animation

#### Interactive States
- **Selection Highlighting**: Selected nodes show blue border and shadow glow
- **Hover Brightness**: All nodes brighten slightly on hover
- **Scale Transitions**: Smooth scaling for selected nodes
- **Connection Preview**: Animated dashed line while connecting

### 🎮 Controls & Interactions

#### Desktop Controls
- **Compact Toolbar**: Floating toolbar with quick actions
- **Legend Panel**: Expandable panel with all node creation options
- **Auto-positioning**: Toolbar moves to bottom-left after APD creation
- **Node Details Panel**: Shows detailed information for selected nodes

#### Mobile Controls
- **Vertical Tab**: Slim button on left edge to open mobile menu
- **Flyout Menu**: Full-featured menu with backdrop
- **Touch-optimized**: Larger touch targets for mobile devices
- **Responsive Layout**: Adapts to screen size automatically

### 🛠️ Technical Features

#### React Flow Integration
- Custom node types for each entity
- Custom edge type with animations
- Background with dots pattern
- MiniMap with color-coded nodes
- Zoom and pan controls
- Node dragging and connecting
- Fit view on initialization

#### State Management
- Node state tracking
- Edge state tracking
- Selected node state
- APD existence tracking
- Node counter for positioning
- Mobile/desktop layout state

#### Data Structure
Each node contains rich data:
- **Collaborators**: name, role, online status, avatar URL
- **Documents**: filename, type, size, icon type
- **Models**: name, type, active state, framework type

### 🎯 Usage

1. **Create APD**: Click "Generate APD" to create the central hub
2. **Add Collaborators**: Click the Users icon to add team members
3. **Add Documents**: Click the File icon to add supporting documents
4. **Add Models**: Click the Grid icon to add analysis models
5. **Connect Manually**: Drag from node handles to create custom connections
6. **Interact**: Click nodes to see details, drag to reposition

### 🎨 Customization

#### Adding Real Avatar URLs
```typescript
data: {
  avatarUrl: 'https://example.com/avatar.jpg',
  // ... other data
}
```

#### Customizing Colors
Edit the color values in the edge data:
```typescript
data: { color: '#your-color-here' }
```

#### Adding New Node Types
1. Create a new node component
2. Add to `nodeTypes` object
3. Create add function with circular positioning
4. Update UI buttons

### 📱 Responsive Design

- **Desktop**: Full-featured with floating panels
- **Tablet**: Collapsed panels by default
- **Mobile**: Vertical tab with flyout menu
- **Touch Support**: Optimized for touch interactions

### 🚀 Performance

- Smooth 60fps animations
- Efficient re-renders with React.memo potential
- Optimized edge rendering
- Lazy loading of heavy components

## File Structure

```
app/app/apdgpt/engine/
├── page.tsx          # Main component with all logic
├── styles.css        # Custom animations and styles
└── README.md         # This file
```

## Technologies Used

- **React Flow (@xyflow/react)**: Canvas and flow management
- **Radix UI**: Avatar and UI components
- **Lucide React**: Icons
- **Tailwind CSS**: Styling and responsive design
- **Custom CSS**: Advanced animations

## Future Enhancements

- Real-time collaboration indicators
- Node grouping and clustering
- Export to image/PDF
- Undo/redo functionality
- Node templates
- Data persistence
- Real-time sync with backend

