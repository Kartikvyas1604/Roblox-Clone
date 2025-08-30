
# Threejs Roblox-like Game Clone

This project is a Roblox-like 3D game demo built with [Three.js](https://threejs.org/) and TypeScript, using Vite. You can control a character, walk, run, jump, and explore a world with trees and a moving camera.

## Features
- Move your character in any direction (WASD or arrow keys)
- Jump (Spacebar)
- Run (Hold Shift)
- Camera follows the character
- Randomly placed trees and large ground
- Simple physics (gravity, jump)

## Controls
- **W/A/S/D** or **Arrow Keys**: Move
- **Spacebar**: Jump
- **Shift**: Run

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Threejs-Walk-cycle
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Project
Start the development server:
```bash
npm run dev
```
Open your browser and navigate to the local server URL (usually http://localhost:5173).

## Project Structure
```
├── index.html
├── package.json
├── tsconfig.json
├── public/
│   └── vite.svg
├── src/
│   ├── main.ts  # Main game logic
│   ├── game.ts  # (Legacy, can be used for reference)
│   ├── style.css
│   ├── typescript.svg
│   └── vite-env.d.ts
```

## Customization
- Modify `src/main.ts` to change the game logic, controls, or models.
- Update `src/style.css` for custom styles.

## License
MIT
