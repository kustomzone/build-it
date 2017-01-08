const { app, BrowserWindow, ipcMain } = require('electron')
const { REACT_DEVELOPER_TOOLS, REACT_PERF, default: installExtension } = require('electron-devtools-installer')
const { SMALL_SIZE, expand, shrink } = require('./resizer')
let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: SMALL_SIZE.w,
    height: SMALL_SIZE.h,
    titleBarStyle: 'hidden-inset',
    alwaysOnTop: true,
    resizable: false,
    fullscreenable: false,
    maximizable: false,
    minWidth: SMALL_SIZE.w,
    minHeight: SMALL_SIZE.h,
    show: false
  })

  mainWindow.loadURL(`file://${__dirname}/../ui/index.html`)

  mainWindow.once('ready-to-show', () => mainWindow.show())
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  ipcMain.on('resizer-expand', expand)
  ipcMain.on('resizer-shrink', shrink)
  Promise.all([REACT_DEVELOPER_TOOLS, REACT_PERF].map(installExtension))
      .then((names) => names.map(name => console.log(`Added Extension:  ${name}`)))
      .catch((err) => console.error('An error occurred: ', err))
  require('devtron').install()
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // if (process.platform !== 'darwin') {
  app.quit()
  // }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
