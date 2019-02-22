'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
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
let settingWindow
const mainWinURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#main-page`
  : `file://${__dirname}/index.html#main-page`
const settingWinURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#setting`
  : `file://${__dirname}/index.html#setting`

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
    if (process.platform === 'linux') {
      app.quit()
    }
  })
}

function createSettingWindow () {
  const options = {
    height: 450,
    width: 800,
    show: true, // 创建后是否显示
    frame: true, // 是否创建frameless窗口
    center: true,
    fullscreenable: false, // 是否允许全屏
    resizable: false,
    title: 'PicGo',
    vibrancy: 'ultra-dark', // 窗口模糊的样式（仅macOS）
    transparent: true, // 是否是透明窗口（仅macOS）
    titleBarStyle: 'hidden', // 标题栏的样式，有hidden、hiddenInset、customButtonsOnHover等
    webPreferences: {
      backgroundThrottling: false, // 当页面被置于非激活窗口的时候是否停止动画和计时器
      webSecurity: false
    }
  }

  settingWindow = new BrowserWindow(options)

  settingWindow.loadURL(settingWinURL)

  settingWindow.on('closed', () => {
    settingWindow = null
    if (!mainWindow) {
      createMainWindow()
    } else {
      mainWindow.show()
    }
  })
}

if (process.platform === 'win32') {
  app.setAppUserModelId(pkg.build.appId)
}

ipcMain.on('openSettingWindow', (evt) => {
  if (!settingWindow) {
    createSettingWindow()
  } else {
    settingWindow.show()
  }
  mainWindow.hide()
})

app.on('ready', () => {
  createMainWindow()
  createSettingWindow()
})

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
