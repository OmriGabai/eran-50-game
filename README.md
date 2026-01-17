# Eran's 50th Birthday Bash - Make It Meme

A multiplayer party game where players compete to write the funniest captions for images displayed on a shared screen. Perfect for birthday parties and gatherings!

## How It Works

1. **Host** opens the game on a TV/projector (`/host`)
2. **Players** join on their phones (`/play`)
3. **Eran** (the birthday person) joins as the permanent judge
4. Each round, an image is shown and players write captions
5. Captions appear as memes (Impact font, top/bottom text)
6. The judge picks their favorite - winner gets points!

## Features

- Real-time multiplayer via Socket.io
- Meme-style captions with live preview while typing
- Mobile-friendly UI with safe area support
- Multiple round types: Normal (100pts), Roast (150pts), Tribute (200pts)
- Persistent images via Cloudinary (survives server restarts)
- Bonus rounds - game continues as long as you want
- Auto-reconnection if connection drops

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Real-time**: Socket.io
- **Images**: Cloudinary
- **Deployment**: Render

## Setup

### Prerequisites

- Node.js 18+
- Cloudinary account (free tier works)

### Installation

```bash
# Clone the repo
git clone https://github.com/OmriGabai/eran-50-game.git
cd eran-50-game

# Install dependencies
npm install

# Create .env.local with your Cloudinary credentials
echo "CLOUDINARY_CLOUD_NAME=your_cloud_name" >> .env.local
echo "CLOUDINARY_API_KEY=your_api_key" >> .env.local
echo "CLOUDINARY_API_SECRET=your_api_secret" >> .env.local

# Run development server
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## Usage

### Admin Page (`/admin`)

Upload images before the party:
- Drag & drop multiple images
- Images are stored in Cloudinary
- Reorder images for round sequence

### Host Page (`/host`)

Display on TV/projector:
- Shows player lobby before game starts
- Displays images and timer during rounds
- Shows all captions as a meme grid for judging
- Celebrates winners with confetti

### Player Page (`/play`)

Players join on their phones:
- Enter name to join (enter "Eran" to be the judge)
- Write captions with separate top/bottom text inputs
- See live preview of your meme while typing
- Judge picks winner from their phone

## Game Flow

```
Lobby -> Round Start -> Caption Phase (60s) -> Judging -> Winner -> Next Round
                                                              |
                                                    End Game (when host chooses)
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `PORT` | Server port (default: 3001) |

## Deployment on Render

1. Create a new Web Service
2. Connect your GitHub repo
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy!

## License

MIT

---

Made with love for Eran's 50th birthday!
