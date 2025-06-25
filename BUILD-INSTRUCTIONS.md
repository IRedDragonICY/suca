# SUCA - Build Instructions

## Prerequisites

1. **Node.js** (v16 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **Git** (for cloning the repository)
   - Download from [git-scm.com](https://git-scm.com/)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd suca
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

### Web Development Mode
Start the React development server:
```bash
npm start
```
The app will open at `http://localhost:3000` with hot reload.

### Electron Development Mode
Start the Electron app in development mode:
```bash
npm run dev
# or
npm run electron-dev
```

## Building for Production

### Build Web Version
Create optimized React build:
```bash
npm run build
```

### Build Electron Applications

#### Portable Windows Executable (Recommended)
```bash
npm run dist-portable
```
Creates: `dist/SUCA-Portable-0.1.0.exe` (~100 MB)
- Standalone executable that requires no installation
- Runs directly from any location
- Perfect for desktop use

#### Windows ZIP Distribution
```bash
npm run dist-win
```
Creates: `dist/SUCA - Subnet Calculator-0.1.0-win.zip` (~160 MB)
- Contains unpacked application files
- Extract and run the executable inside

#### Cross-Platform Builds
```bash
npm run dist-all    # Build for Windows, macOS, and Linux
npm run dist-mac    # macOS only
npm run dist-linux  # Linux only
```

## Build Scripts (Windows)

Convenient batch files for Windows users:

- **`dev-electron.bat`** - Start development mode
- **`build-portable.bat`** - Build portable executable
- **`build-windows.bat`** - Build Windows distribution

## Build Output

Successful builds create files in the `dist/` directory:
- `SUCA-Portable-0.1.0.exe` - Portable executable
- `SUCA - Subnet Calculator-0.1.0-win.zip` - ZIP distribution
- `win-unpacked/` - Unpacked application directory

## Known Issues & Solutions

### File Locking Issues
If you encounter "file in use" errors during builds:
1. Close all running instances of the app
2. Kill any electron/node processes:
   ```bash
   taskkill /f /im electron.exe
   taskkill /f /im node.exe
   ```
3. Delete the `dist` folder if needed
4. Retry the build

### Icon Issues
- The build system uses `public/logo512.png` for app icons
- NSIS installer requires ICO format (may fail but portable build works)
- If icon errors occur, the portable build will still succeed

### ESLint Warnings
The build may show ESLint warnings but will complete successfully. These are non-blocking development warnings about React hooks optimization.

## Application Features

SUCA includes comprehensive networking tools:

### IPv4 Calculator
- Complete subnet information (network, broadcast, range, etc.)
- Enhanced IP information (binary, hex, integer representations)
- Network analysis (private/public classification, efficiency metrics)
- Subnet division with export capabilities
- All possible networks display for given CIDR

### IPv6 Calculator
- IPv6 address analysis and subnet calculations
- Address expansion and compression
- Network prefix calculations

### Network Tools
- IP address validation and conversion
- CIDR notation utilities
- Network range calculations

### Cryptography Tools
- Number base conversion (binary, decimal, hex, octal)
- Text encoding/decoding (Base64, URL, HTML)
- Hash generation (MD5, SHA-1, SHA-256, SHA-512)
- Binary operations (AND, OR, XOR, NOT)

## Desktop Features

- **Modern Material You Design** - Clean, professional interface
- **Dark/Light Mode Support** - Automatic theme detection
- **Custom Title Bar** - Native-looking window controls
- **Responsive Layout** - Works on various screen sizes
- **Keyboard Shortcuts** - Efficient navigation
- **Export Capabilities** - Save results to CSV/JSON

## Development Notes

- React 19.1.0 with TypeScript
- Material-UI (MUI) for components
- Electron 36.5.0 for desktop packaging
- Custom Material You theme implementation
- Modern scrollbars and animations

## Support

For issues or questions:
1. Check this documentation
2. Review the source code in `src/` directory
3. Check console output for errors
4. Ensure all prerequisites are installed correctly

---

**Last Updated:** June 2025
**Version:** 0.1.0 