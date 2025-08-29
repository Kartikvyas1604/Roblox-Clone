# Threejs Walk Cycle

This project demonstrates a simple animated human walk cycle using [Three.js](https://threejs.org/) and TypeScript, built with Vite.

## Features
- Custom human model built from basic geometries
- Smooth walk cycle animation (arms, legs, body movement)
- Animated movement from far to near the camera
- Responsive rendering and green ground plane

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
│   ├── counter.ts
│   ├── main.ts
│   ├── style.css
│   ├── typescript.svg
│   └── vite-env.d.ts
```

## Customization
- Modify `src/main.ts` to change the animation, camera, or model.
- Update `src/style.css` for custom styles.

## License
MIT
