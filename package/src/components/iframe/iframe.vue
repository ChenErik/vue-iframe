<template>
  <div
    :id="options.id"
    class="vl-notify vl-notify-main vl-notify-alert vl-notify-iframe"
    tabindex="1"
    :style="getBaseStyle"
    @mousemove="divMove"
    @mouseup="divUp"
    @focus="resetZIndex"
  >
    <h2 class="vl-notice-title" @mousedown="divDown">
      <span class="lv-title" v-html="options.title" />
      <span class="lv-icon-maxmini">
        <template v-if="maxMiniState === 0">
          <i class="vlayer vlicon-mini lv-icon-mini" @click="mini(options.id)" />
          <i class="vlayer vlicon-max lv-icon-max" @click="max" />
        </template>
        <template v-else-if="maxMiniState === 1">
          <i class="vlayer vlicon-huanyuan lv-icon-max" @click="maxmini(options.id)" />
        </template>
        <template v-else-if="maxMiniState === 2">
          <i class="vlayer vlicon-huanyuan lv-icon-max" @click="maxmini" />
        </template>
      </span>
      <i class="icon-remove" @click="close" />
    </h2>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      zindex: 1,
      addStyle: {},
      maxMiniState: 0, // 0normal,1mini,2max
      moveLeft: 0,
      moveTop: 0,
      isMove: false
    }
  },
  computed: {
    getBaseStyle() {
      // 获取z-index
      this.resetZIndex()
      const op = this.options
      const styleBase = {
        left: op.offset[0] + 'px',
        top: op.offset[1] + 'px',
        margin: op.offset[2],
        zIndex: this.zindex,
        width: op.area[0],
        height: op.area[1]
      }
      let a = { ...styleBase }
      return this.mergeJson(a, this.addStyle)
    }
  },
  mounted() {
    this.resetZIndex()
  },
  methods: {
    divDown(event) {
      this.moveStart(event, this.options)
      this.moveLeft = event.clientX
      this.moveTop = event.clientY
      this.isMove = true
    },
    divMove(event) {
      if (this.isMove) {
        let o = document.getElementById(this.options.id + '')
        let top = this.options.offset[1] + (event.clientY - this.moveTop)
        let docOffsetHeight = o.offsetHeight / 2
        let left = this.options.offset[0] + (event.clientX - this.moveLeft)
        let docOffsetWidth = o.offsetWidth / 2
        if (top <= docOffsetHeight) {
          // 顶部边界
          top = docOffsetHeight
        }
        if (left <= docOffsetWidth) {
          // 左侧边界
          left = docOffsetWidth
        }
        let docHeight = document.documentElement.clientHeight
        let docWidth = document.documentElement.clientWidth
        if (top >= docHeight - docOffsetHeight) {
          // 底部边界
          top = docHeight - docOffsetHeight
        }
        if (left >= docWidth - docOffsetWidth) {
          // 右部边界
          left = docWidth - docOffsetWidth
        }
        o.style.left = left + 'px'
        o.style.top = top + 'px'
        this.resetZIndex()
      }
    },
    divUp() {
      this.isMove = false
    },
    moveStart(event, options) {
      options.offset = options.offset === 'auto' ? [] : options.offset
      if (options.offset.length === 0) {
        options.offset.push(document.getElementById(options.id + '').offsetLeft)
        options.offset.push(document.getElementById(options.id + '').offsetTop)
        options.offset.push(0)
      }
      if (options.offset.length === 2) {
        options.offset.push(0)
      }
      options.offset[0] = (document.getElementById(options.id + '').offsetLeft)
      options.offset[1] = (document.getElementById(options.id + '').offsetTop)
    },
    mergeJson(options, def) {
      for (let key in def) {
        options[key] = def[key]
      }
      return options
    },
    getStyle(el, styleProp) {
      let x = document.getElementById(el)
      let y = 0
      if (window.getComputedStyle) {
        y = document.defaultView
          .getComputedStyle(x, null)
          .getPropertyValue(styleProp)
      } else if (x.currentStyle) {
        y = x.currentStyle[styleProp]
      }
      return y
    },
    resetZIndex() {
      let max = 500
      let keys = ['vl-notify-iframe']
      let doms = document.querySelectorAll('.' + keys[0]) // vl-notify-iframe
      for (let i = 0, len = doms.length; i < len; i++) {
        let value = parseInt(this.getStyle(doms[i].id, 'z-index'))
        if (max < value) {
          max = value
        }
      }
      this.zindex = max + 1
    },
    async close() {
      if (typeof (this.options.cancel) === 'function') {
        await this.options.cancel(this.options.id)
        this.options.layer.close(this.options.id)
      } else {
        this.options.layer.close(this.options.id)
      }
    },
    mini(id) {
      let listLength = document.getElementsByClassName('vl-notify')
      let left = 0
      for (let i = 0; i < listLength.length; i++) {
        if (listLength[i].id === id) {
          left = i * 250 + 130
        }
      }
      // 最小化窗口
      this.addStyle = {
        overflow: 'hidden',
        bottom: 0,
        left: left + 'px',
        width: '100px',
        height: '42px',
        minHeight: '42px',
        top: 'auto'
      }
      this.maxMiniState = 1
    },
    max() {
      // 最大化窗口
      let height = document.documentElement.clientHeight
      if (height % 2 === 1) {
        height += 1
      }
      this.addStyle = {
        overflow: 'hidden',
        left: '50%',
        width: '100%',
        height: height + 'px',
        minHeight: '42px'
      }
      this.maxMiniState = 2
    },
    maxmini(id) {
      document.getElementById(this.options.id).removeAttribute('style')
      let list = document.getElementsByClassName('vl-notify')
      if (id) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].id === id) {
            this.addStyle = {
              left: 960 + (i + 1) * 30 + 'px',
              top: 'tpx',
              margin: 't',
              zIndex: this.zindex + 1
            }
          }
        }
      } else {
        this.addStyle = {
          left: 'tpx',
          top: 'tpx',
          margin: 't'
        }
      }

      this.maxMiniState = 0
    }
  }
}
</script>
