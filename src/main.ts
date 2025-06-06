import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { readFileSync, writeFileSync } from 'node:fs';
import path, { join } from 'node:path';

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


ipcMain.handle('ask-and-write-base64', (event, base64: string) => {
  const folder = dialog.showOpenDialogSync(BrowserWindow.getAllWindows()[0], { properties: ['openDirectory'] })

  const destination = join(folder[0], 'sample.png')
  writeFileSync(`${destination}`, base64, { encoding: 'base64' });

  return destination
})

ipcMain.handle('get-file-content-as-base64', (event, path: string) => readFileSync(path))
