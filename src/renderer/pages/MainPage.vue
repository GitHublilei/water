<template>
  <div id="main-page" :style="{ backgroundImage: 'url(' + log + ')' }">

  </div>
</template>
<script>
export default {
  name: 'main-page',
  data () {
    return {
      log: 'static/water.png',
      dragging: false,
      wX: '',
      wY: '',
      screenX: '',
      screenY: '',
      menu: null,
      os: ''
    }
  },
  mounted () {
    this.os = process.platform

    window.addEventListener('mousedown', this.handleMouseDown, false)
    window.addEventListener('mousemove', this.handleMouseMove, false)
    window.addEventListener('mouseup', this.handleMouseUp, false)
  },
  methods: {
    buildMenu () {
      const _this = this
      const template = [
        {
          label: '打开详细窗口',
          click () {
            _this.$electron.ipcRenderer.send('openSettingWindow')
          }
        },
        // {
        //   label: '选择默认图床',
        //   type: 'submenu',
        //   submenu
        // },
        {
          label: '最小化窗口',
          role: 'minimize'
        },
        {
          label: '重启应用',
          click () {
            _this.$electron.remote.app.relaunch()
            _this.$electron.remote.app.exit(0)
          }
        },
        {
          role: 'quit',
          label: '退出'
        }
      ]

      this.menu = this.$electron.remote.Menu.buildFromTemplate(template)
    },
    getMenu () {
      this.buildMenu()
    },
    handleMouseDown (e) {
      this.dragging = true
      this.wX = e.pageX
      this.wY = e.pageY
      this.screenX = e.screenX
      this.screenY = e.screenY
    },
    handleMouseMove (e) {
      e.preventDefault()
      e.stopPropagation()
      if (this.dragging) {
        const xLoc = e.screenX - this.wX
        const yLoc = e.screenY - this.wY
        this.$electron.remote.BrowserWindow.getFocusedWindow().setBounds({
          x: xLoc,
          y: yLoc,
          width: 50,
          height: 50
        })
      }
    },
    handleMouseUp (e) {
      this.dragging = false
      if (this.screenX === e.screenX && this.screenY === e.screenY) {
        if (e.button === 0) { // left mouse
        } else {
          this.getMenu()
          this.openContextMenu()
        }
      }
    },
    openContextMenu () {
      this.menu.popup(this.$electron.remote.getCurrentWindow())
    }
  },
  beforeDestroy () {
    window.removeEventListener('mousedown', this.handleMouseDown, false)
    window.removeEventListener('mousemove', this.handleMouseMove, false)
    window.removeEventListener('mouseup', this.handleMouseUp, false)
  }
}
</script>
<style lang="stylus" scoped>
  #main-page
    background #6060FF
    color #FFF
    height 100vh
    width 100vw
    text-align center
    line-height 100vh
    font-size 40px
    background-size 90vh 90vw
    background-position center center
    background-repeat no-repeat
    position relative
    border 4px solid #fff
    box-sizing border-box
    cursor pointer
</style>

