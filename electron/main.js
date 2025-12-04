const { app, BrowserWindow } = require('electron');
const path = require('path');

// IMPORTANT: Command line switches must be set BEFORE app is ready

// Suppress harmless GL/VSync warnings (doesn't affect functionality)
// These errors are cosmetic and don't impact app performance
// Note: These flags help reduce the errors, but some may still appear in stderr
// The electron-dev.sh wrapper script filters them out
app.commandLine.appendSwitch('disable-gpu-vsync');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-software-rasterizer');

// Disable sandbox to avoid permission issues on Linux
// This is safe for a clock app and prevents sandbox errors
// Works in both development and production builds
app.commandLine.appendSwitch('--no-sandbox');
app.commandLine.appendSwitch('--disable-setuid-sandbox');

// Suppress console errors for known harmless messages
const originalConsoleError = console.error;
console.error = function(...args) {
  const message = args.join(' ');
  // Filter out harmless GL/VSync errors
  if (message.includes('gl_surface_presentation_helper') || 
      message.includes('GetVSyncParametersIfAvailable')) {
    return; // Suppress this error
  }
  originalConsoleError.apply(console, args);
};

let mainWindow = null;

function createWindow() {
  const iconPath = path.join(__dirname, '../build/icon.png');
  
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    icon: iconPath, // Set app icon
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    title: 'Fliqlocko',
    autoHideMenuBar: true,
    frame: true,
    resizable: true,
    minWidth: 400,
    minHeight: 300,
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

