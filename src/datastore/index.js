import Datastore from 'lowdb'
import LodashId from 'lodash-id' // 使用插件生成自增id
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { remote, app } from 'electron'

if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}
if (process.env.DEBUG_ENV === 'debug') {
  global.__static = path.join(__dirname, '../../static').replace(/\\/g, '\\\\')
}

const APP = process.type === 'renderer' ? remote.app : app // 根据process.type来分辨在哪种模式使用哪种模块
const STORE_PATH = APP.getPath('userData') // 获取electron应用的用户目录

if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(STORE_PATH)) { // 如果不存在路径
    fs.mkdirpSync(STORE_PATH) // 就创建
  }
}

const adapter = new FileSync(path.join(STORE_PATH, '/data.json')) // 初始化lowdb读写的json文件名以及存储路径

const db = Datastore(adapter) // lowdb接管该文件
db._.mixin(LodashId) // 通过._mixin()引入

if (!db.has('uploaded').value()) { // 先判断该值存不存在
  db.set('uploaded', []).write() // 不存在就创建
}

if (!db.has('picBed').value()) {
  db.set('picBed', {
    current: 'weibo'
  }).write()
}

if (!db.has('settings.shortKey').value()) {
  db.set('settings.shortKey', {
    upload: 'CommandOrControl+Shift+P'
  }).write()
}

export default db
