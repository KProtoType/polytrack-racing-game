# PolyTrack Racing Game 🏎️

A 3D low-poly racing game built with Three.js, featuring realistic car physics, dynamic tracks, and engaging gameplay.

![PolyTrack Racing Game](https://img.shields.io/badge/Game-Racing-blue) ![Three.js](https://img.shields.io/badge/Three.js-r128-green) ![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

## 🎮 Features

### Core Gameplay
- **3D Car Physics**: Realistic acceleration, braking, steering, and momentum
- **Multiple Racing Tracks**: Curved circuits with elevation changes and checkpoints
- **Lap System**: Complete 3 laps with lap timing and best time tracking
- **Collision Detection**: Bounce off barriers and track boundaries
- **Speed Boosts**: Special track elements for enhanced gameplay

### Visual Style
- **Low-Poly Aesthetic**: Flat-shaded materials for a clean, modern look
- **Colorful Environment**: Beautiful gradient sky with sunset/dawn colors
- **Dynamic Lighting**: Realistic shadows and lighting effects
- **Particle Effects**: Speed trails and collision effects
- **Responsive Design**: Works perfectly on mobile and desktop

### Controls
- **Desktop**: WASD/Arrow keys for movement, Space for handbrake, R to reset
- **Mobile**: Touch steering wheel and pedal controls
- **Camera**: C key to cycle between camera modes (follow, cinematic, overhead)
- **Game**: P/ESC to pause, R to reset car position

### Track Features
- **Curved Racing Circuit**: Complex track with wide and tight turns
- **Elevation Changes**: Hills and dips for varied gameplay
- **Visual Checkpoints**: Ring markers to guide players
- **Start/Finish Line**: Clear lap completion detection
- **Environmental Details**: Trees, rocks, and decorative elements

## 🚀 Quick Start

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd polytrack-racing-game

# Start local server
npm run dev
# or
python -m http.server 3000 --directory public

# Open browser to http://localhost:3000
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Or connect your GitHub repository to Vercel for automatic deployments
```

## 🎯 How to Play

1. **Start the Game**: Click "Start Race" from the main menu
2. **Read Controls**: Review the instruction screen
3. **Race**: Complete 3 laps as fast as possible
4. **Beat Your Time**: Try to set new personal best records

### Scoring
- Complete all 3 laps to finish the race
- Pass through all checkpoints in order
- Aim for the fastest total race time
- Best times are saved locally

## 🛠️ Technical Details

### Architecture
- **Game Engine**: Custom built with Three.js
- **Physics**: Custom physics system (no external library)
- **Audio**: Web Audio API for sound effects
- **Controls**: Keyboard and touch input support
- **Performance**: Optimized for 60fps on most devices

### File Structure
```
public/
├── index.html          # Main game page and UI
├── style.css           # Responsive styling
├── game.js             # Core game engine and scene management
├── car.js              # Car physics and visual components
├── track.js            # Track generation and collision system
├── camera.js           # Dynamic camera following system
└── ui.js               # User interface and mobile controls
```

### Performance Optimizations
- Efficient particle system with limited count
- Low-poly models for optimal rendering
- Texture and geometry reuse
- Optimized collision detection
- Mobile-specific optimizations

## 🎨 Customization

### Tweaking Car Physics
Edit `car.js` to modify:
- `acceleration`: How fast the car speeds up
- `maxSpeed`: Top speed of the car
- `turnSpeed`: Steering responsiveness
- `friction`: How quickly the car slows down

### Visual Customization
Edit `game.js` sky shader uniforms:
- `topColor`: Sky gradient top color
- `bottomColor`: Sky gradient bottom color
- Lighting colors and intensities

### Track Modifications
Edit `track.js` to change:
- Track shape and size (`trackRadius`, track points)
- Elevation changes (height calculations)
- Number of checkpoints and decorations

## 📱 Mobile Support

The game includes comprehensive mobile support:
- **Touch Steering**: Virtual steering wheel
- **Touch Pedals**: Accelerate, brake, and handbrake buttons
- **Responsive UI**: Scales properly on all screen sizes
- **Performance**: Optimized for mobile GPUs

## 🔧 Browser Compatibility

- **Chrome**: Full support with best performance
- **Firefox**: Full support
- **Safari**: Full support (may require user gesture for audio)
- **Edge**: Full support
- **Mobile Browsers**: Optimized for iOS Safari and Chrome Mobile

## 🎵 Audio Features

- **Engine Sounds**: Dynamic pitch based on car speed
- **Collision Effects**: Impact sound effects
- **Checkpoint Chimes**: Audio feedback for progress
- **Web Audio API**: No external audio libraries required

## 📈 Future Enhancements

Potential features for future versions:
- Multiple track layouts
- Car customization options
- Multiplayer support
- Power-ups and obstacles
- Weather effects
- Procedural track generation

## 🐛 Troubleshooting

### Common Issues
1. **Game won't start**: Ensure JavaScript is enabled
2. **No sound**: Click anywhere to enable audio context
3. **Poor performance**: Try reducing browser zoom or closing other tabs
4. **Mobile controls not working**: Ensure touch events are supported

### Performance Tips
- Close unnecessary browser tabs
- Use Chrome or Firefox for best performance
- Reduce browser zoom if experiencing lag
- Clear browser cache if experiencing issues

## 📄 License

MIT License - feel free to use this code for your own projects!

## 🤝 Contributing

This is a demonstration project created with Claude Code. Feel free to fork and enhance!

---

Built with ❤️ using Three.js and Claude Code