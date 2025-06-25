const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Simple packaging script
console.log('Creating SUCA Desktop Portable App...');

// Create portable directory
const portableDir = path.join(__dirname, 'SUCA-Portable');
const electronPath = path.join(__dirname, 'node_modules', 'electron', 'dist');

if (!fs.existsSync(portableDir)) {
  fs.mkdirSync(portableDir);
}

// Copy electron files
console.log('Copying Electron runtime...');
fs.cpSync(electronPath, portableDir, { recursive: true });

// Copy app files
console.log('Copying app files...');
const appDir = path.join(portableDir, 'resources', 'app');
fs.mkdirSync(appDir, { recursive: true });

// Copy essential files
fs.copyFileSync(path.join(__dirname, 'main.js'), path.join(appDir, 'main.js'));
fs.copyFileSync(path.join(__dirname, 'package.json'), path.join(appDir, 'package.json'));

// Copy build directory
if (fs.existsSync(path.join(__dirname, 'build'))) {
  fs.cpSync(path.join(__dirname, 'build'), path.join(appDir, 'build'), { recursive: true });
}

// Copy public directory
if (fs.existsSync(path.join(__dirname, 'public'))) {
  fs.cpSync(path.join(__dirname, 'public'), path.join(appDir, 'public'), { recursive: true });
}

// Rename electron.exe to SUCA.exe
const electronExe = path.join(portableDir, 'electron.exe');
const sucaExe = path.join(portableDir, 'SUCA.exe');

if (fs.existsSync(electronExe)) {
  fs.renameSync(electronExe, sucaExe);
}

console.log('Portable app created successfully!');
console.log(`Location: ${portableDir}`);
console.log('You can now run SUCA.exe to start the application.'); 