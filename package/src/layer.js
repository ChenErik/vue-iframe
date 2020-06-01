/**
 * @Author: 左盐
 * @Date:   2018-03-05 16:12:17
 * @Email:  huabinglan@163.com
 * @Last modified by:   左盐
 * @Last modified time: 2018-03-31 10:39:54
 */

import vueIframe from './content.vue'
let Notification = function(Vue) {
  let NotificationConstructor = Vue.extend(vueIframe)
  let self = {}
  const defOptions = {
    title: '信息',
    content: '',
    area: 'auto',
    offset: 'auto',
    yes: '',
    cancel: ''
  }
  self.instances = {}
  self.instancesVue = []
  let seed = 0

  /**
   * [function description]
   * @method function
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  self.open = function(options) {
    options = mergeJson(options, defOptions)
    let id = `vi_${new Date().getTime()}_${seed++}`
    options.id = id
    options.layer = self
    let instance = new NotificationConstructor({
      data: options
    })
    options.content.Content = Vue.extend(options.content.Content)
    instance.id = id
    instance.vm = instance.$mount()
    self.instances[id] = {
      inst: instance,
      type: options.type
    }
    document.body.appendChild(instance.vm.$el)
    self.instancesVue[id] = {
      'mask': '',
      'main': instance.vm,
      'iframe': ''
    }
    let listLength = document.getElementsByClassName('vl-notify').length
    instance.vm.$el.style.left = 960 + listLength * 30 + 'px'
    return id
  }
  /**
   * [description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  self.iframe = function(opt) {
    let option = {
      content: opt.content,
      area: opt.area
    }
    option = mergeJson(option, opt)
    return self.open(option)
  }
  /**
   * 关闭一个弹窗
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  self.close = function(id) {
    let oElm = document.getElementById(id)
    if (oElm) {
      if (oElm.style.width !== '900px') {
        let vlList = document.getElementsByClassName('vl-notify')
        for (let i = 0; i < vlList.length; i++) {
          if (vlList[i].id === id) {
            for (let j = 0; j < vlList.length - i - 1; j++) {
              vlList[i + 1 + j].animate([{ left: vlList[i + 1 + j].style.left }, { left: (i + j) * 250 + 130 + 'px' }], { duration: 1000, iterations: 1 })
              vlList[i + 1 + j].style.left = (i + j) * 250 + 130 + 'px'
            }
          }
        }
      }
      document.body.removeChild(oElm)
      delete self.instances[id]
      self.instancesVue[id].main.$destroy()
      if (self.instancesVue[id].iframe !== '') {
        self.instancesVue[id].iframe.$destroy()
      }
      // 取消隐藏滚动条
      if (!self.instancesVue[id].main.scrollbar) {
        let scrollbarCount = 0
        for (let key in self.instancesVue) {
          if (!self.instancesVue[key].main.scrollbar) {
            scrollbarCount++
          }
        }
        if (scrollbarCount === 1) {
          const htmlDom = document.getElementsByTagName('html')[0]
          htmlDom.style.marginRight = 'auto'
          htmlDom.classList.remove('vl-html-scrollbar-hidden')
        }
      }
      // 控制遮罩,删除掉当前的遮罩
      if (self.instancesVue[id].main.shade) {
        let layerMask = document.getElementById(id + '_mask')
        let maskId = id + '_mask'
        document.body.removeChild(layerMask)
        if (self.instancesVue[maskId]) {
          self.instancesVue[maskId].mask.$destroy()
        }
      }
      delete self.instancesVue[id]
    } else {
      setTimeout(function() {
        let oElm = document.getElementById(id)
        if (oElm) {
          document.body.removeChild(oElm)
          delete self.instances[id]
          self.instancesVue[id].main.$destroy()
          if (self.instancesVue[id].iframe !== '') {
            self.instancesVue[id].iframe.$destroy()
          }
        }
      }, 200)
    }
  }
  /**
   * 关闭一个弹窗
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  self.closeAll = function(type = -1) {
    let types = {
      'alert': 0,
      'page': 1,
      'iframe': 2,
      'loading': 3,
      'tips': 4,
      'msg': 5
    }
    if (type === -1) {
      for (let k in self.instances) {
        self.close(k)
      }
    } else {
      let targetType = types[type]
      for (let k in self.instances) {
        if (self.instances[k].type === targetType) {
          self.close(k)
        }
      }
    }
  }
  /**
   * 手动最大化
   */
  self.full = function(id = '') {
    document.querySelector('#' + id + ' .lv-icon-max').click()
  }
  /**
   * 手动最小化
   */
  self.min = function(id = '') {
    document.querySelector('#' + id + ' .lv-icon-mini').click()
  }
  /**
 * 手动最小化
 */
  self.restore = function(id = '') {
    document.querySelector('#' + id + ' .lv-icon-huanyuan').click()
  }

  /**
   * get offset
   */
  // function getOffset() {
  //   let offset = [];
  //   offset.push(document.body.clientWidth);
  //   offset.push(document.body.clientHeight);
  //   return offset;
  // }

  /**
   * 合并json
   * @method mergeJson
   * @param  {[type]}  optons [description]
   * @param  {[type]}  def    [description]
   * @return {[type]}         [description]
   */
  function mergeJson(options, def) {
    for (let key in def) {
      if (options[key] === undefined) {
        options[key] = def[key]
      }
    }
    return options
  }

  return self
}

// module.exports = Notification;
export default Notification
