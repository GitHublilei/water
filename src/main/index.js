'use strict'

import { app, BrowserWindow } from 'electron'
import db from '../datastore'
import pkg from '../../package.json'
import fixPath from 'fix-path'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
if (process.env.DEBUG_ENV === 'debug') {
  global.__static = require('path').join(__dirname, '../../static').replace(/\\/g, '\\\\')
}

let mainWindow
const mainWinURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#main-page`
  : `file://${__dirname}/index.html#main-page`

// fix the $PATH in macOS
fixPath()

function createMainWindow () {
  if (mainWindow) return
  let obj = {
    height: 50,
    width: 50,
    show: true,
    frame: false,
    fullscreenable: false,
    skipTaskbar: true,
    resizable: false,
    transparent: false,
    icon: `${__static}/logo.png`,
    webPreferences: {
      backgroundThrottling: false,
      devTools: false
    }
  }

  if (process.platform === 'darwin') {
    obj.show = false
  }

  if (db.read().get('settings.miniWindowOntop').value()) {
    obj.alwaysOnTop = true
  }

  mainWindow = new BrowserWindow(obj)

  mainWindow.loadURL(mainWinURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

if (process.platform === 'win32') {
  app.setAppUserModelId(pkg.build.appId)
}

app.on('ready', createMainWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow()
  }
})
