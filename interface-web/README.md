# IteratED Web Interface

A modern, responsive web interface for the IteratED AI-powered Socratic STEM tutor system.

## Features

- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 💬 **Real-time Chat**: Interactive chat interface with your AI tutor
- 🔄 **Session Management**: Persistent tutoring sessions
- 📱 **Mobile Responsive**: Works perfectly on all devices
- ⚡ **Fast Performance**: Built with Next.js 14 and React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Python 3.8+ (for backend integration)

### Installation

1. **Install Next.js dependencies:**
   ```bash
   npm install
   ```

2. **Install Python backend dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Backend Integration

### Option 1: Use the Built-in API (Simulated)

The interface currently uses a simulated API that returns predefined responses. This is perfect for testing the UI.

### Option 2: Connect to Your Python Backend

To connect to your actual IteratED Python backend:

1. **Start the Python backend server:**
   ```bash
   cd interface-web
   python backend_integration.py
   ```

2. **Update the API endpoint in the frontend:**
   Edit `src/app/page.tsx` and change the fetch URL from `/api/chat` to `http://localhost:8000/api/chat`

3. **Configure your API keys:**
   - Add your Gemini API key for TutorGemini
   - Add your OpenAI API key for TutorOpenAI

## Project Structure

```
interface-web/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts          # API route for chat
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Main chat interface
│   └── ...
├── backend_integration.py            # Python FastAPI server
├── requirements.txt                  # Python dependencies
└── package.json                      # Node.js dependencies
```

## Customization

### Styling

The interface uses Tailwind CSS for styling. You can customize the appearance by modifying:

- `src/app/globals.css` - Global styles
- `src/app/page.tsx` - Component-specific styles

### Adding Features

- **New API endpoints**: Add routes in `src/app/api/`
- **Additional UI components**: Create new components in `src/components/`
- **State management**: Consider using Zustand or Redux for complex state

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

Create a `.env.local` file for environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key_here
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the IteratED system. See the main README for licensing information.
