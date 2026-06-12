# JARVIS Frontend

Futuristic React + Tailwind CSS dashboard for JARVIS AI Assistant.

## Features

✨ **Iron Man HUD-Inspired Design** - Cyan/blue neon aesthetics with glassmorphism
💬 **Real-time Chat Interface** - Smooth message streaming and animations
🎤 **Voice Input/Output** - Integrated voice controls
📱 **Responsive Design** - Mobile-first approach
🌙 **Dark Theme** - OLED-optimized color scheme
⚡ **Performance Optimized** - Fast load times and smooth interactions

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Development

```bash
npm run dev
```

Open http://localhost:3000

### Build

```bash
npm run build
```

### Type Check

```bash
npm run type-check
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── HUD.tsx         # HUD design components
│   │   ├── Navbar.tsx      # Navigation bar
│   │   ├── Sidebar.tsx     # Conversation list
│   │   ├── ChatArea.tsx    # Message display
│   │   ├── ChatInput.tsx   # Message input
│   │   └── ProtectedRoute.tsx
│   ├── pages/              # Page components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ChatPage.tsx
│   │   └── SettingsPage.tsx
│   ├── store/              # Zustand stores
│   │   ├── auth.ts
│   │   ├── chat.ts
│   │   └── settings.ts
│   ├── lib/                # Utilities
│   │   └── api.ts
│   ├── config/             # Configuration
│   │   └── api.ts
│   ├── styles/             # Global styles
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Design System

### Colors

- **Primary**: Cyan (`#22d3ee`)
- **Secondary**: Blue (`#3b82f6`)
- **Accent**: Purple (`#a855f7`)
- **Background**: Slate 950 (`#03050a`)
- **Text**: Gray 100 (`#f3f4f6`)

### Components

#### HUD Panel
Glassmorphic panel with cyan border and glow effect.

```tsx
<HUDPanel>
  Content here
</HUDPanel>
```

#### Glass Button
Glow button with gradient background.

```tsx
<GlassButton variant="primary" size="md">
  Click me
</GlassButton>
```

#### Glass Input
Stylized input with focus states.

```tsx
<GlassInput placeholder="Type here..." />
```

## API Integration

### Authentication

- `POST /auth/register` - Register user
- `POST /auth/login` - Login and get token
- `GET /auth/me` - Get current user

### Chat

- `POST /chat/message` - Send message
- `GET /chat/conversations` - List conversations
- `GET /chat/conversations/{id}` - Get conversation
- `PUT /chat/conversations/{id}` - Update conversation
- `DELETE /chat/conversations/{id}` - Delete conversation

### Voice

- `POST /voice/transcribe` - Transcribe audio
- `POST /voice/synthesize` - Synthesize speech
- `WS /voice/ws/chat/{id}` - WebSocket voice chat

## State Management

### useAuthStore

```typescript
const { user, token, setUser, setToken, logout } = useAuthStore();
```

### useChatStore

```typescript
const { conversations, messages, currentConversation, addMessage } = useChatStore();
```

### useSettingsStore

```typescript
const { voiceEnabled, setVoiceEnabled } = useSettingsStore();
```

## Animations

- **Page Transitions** - Fade and slide animations
- **Message Entry** - Slide up on appearance
- **Button Hover** - Scale and glow effects
- **Loading States** - Pulsing dots
- **Scroll Animations** - Smooth scrolling to latest message

## Performance Optimization

- **Code Splitting** - Route-based splitting
- **Lazy Loading** - Components load on demand
- **Image Optimization** - Compressed assets
- **Memoization** - Prevents unnecessary re-renders
- **Virtualization** - Long lists handled efficiently

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader support

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### GitHub Pages

```bash
npm run build
# Push dist folder to gh-pages branch
```

### Docker

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/name`
4. Open pull request

## License

MIT License
