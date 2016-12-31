const { app, BrowserWindow } = require('electron')
const { REACT_DEVELOPER_TOOLS, REACT_PERF, default: installExtension } = require('electron-devtools-installer')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 36,
    titleBarStyle: 'hidden-inset',
    alwaysOnTop: true,
    resizable: false,
    fullscreenable: false,
    maximizable: false,
    minWidth: 350
  })

  mainWindow.loadURL(`file://${__dirname}/ui/index.html`)

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  Promise.all([REACT_DEVELOPER_TOOLS, REACT_PERF].map(installExtension))
      .then((names) => names.map(name => console.log(`Added Extension:  ${name}`)))
      .catch((err) => console.error('An error occurred: ', err))
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
