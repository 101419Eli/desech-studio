import HelperEvent from '../../helper/HelperEvent.js'
import HelperCanvas from '../../helper/HelperCanvas.js'
import HelperTrigger from '../../helper/HelperTrigger.js'

export default {
  getEvents () {
    return {
      click: ['clickZoomInEvent', 'clickZoomOutEvent', 'clickZoomResetEvent'],
      wheel: ['wheelZoomInOutEvent'],
      auxclick: ['auxclickZoomResetEvent']
    }
  },

  handleEvent (event) {
    HelperEvent.handleEvents(this, event)
  },

  clickZoomInEvent (event) {
    if (event.target.closest('.canvas-zoom-in')) {
      this.zoomIn(event.clientX, event.clientY)
    }
  },

  clickZoomOutEvent (event) {
    if (event.target.closest('.canvas-zoom-out')) {
      this.zoomOut(event.clientX, event.clientY)
    }
  },

  clickZoomResetEvent (event) {
    if (event.target.closest('.canvas-zoom-reset')) {
      this.zoomReset()
    }
  },

  wheelZoomInOutEvent (event) {
    if (HelperEvent.isCtrlCmd(event) && !event.altKey && !event.shiftKey) {
      if (event.deltaY < 0) {
        this.zoomIn(event.clientX, event.clientY)
      } else {
        this.zoomOut(event.clientX, event.clientY)
      }
    }
  },

  auxclickZoomResetEvent (event) {
    if (event.button === 1 && HelperEvent.isCtrlCmd(event) && !event.altKey && !event.shiftKey) {
      this.zoomReset()
    }
  },

  zoomIn (clientX, clientY) {
    this.incrementZoom(5, clientX, clientY)
  },

  zoomOut (clientX, clientY) {
    this.incrementZoom(-5, clientX, clientY)
  },

  zoomReset () {
    this.setZoom(100)
  },

  incrementZoom (increment, clientX, clientY) {
    const zoom = HelperCanvas.getZoom()
    let value = Math.round(zoom + increment)
    value = Math.min(Math.max(value, 10), 200) // [10, 200]
    this.setZoom(value)
    this.scrollToZoom(zoom, value, clientX, clientY)
  },

  scrollToZoom (previousZoom, currentZoom, clientX, clientY) {
    const container = HelperCanvas.getCanvasContainer()
    const mouseX = clientX - container.offsetLeft
    const mouseY = clientY - container.offsetTop
    const zoomX = (container.scrollLeft + mouseX) / (previousZoom / 100)
    const zoomY = (container.scrollTop + mouseY) / (previousZoom / 100)
    const scrollX = Math.round((zoomX * (currentZoom / 100)) - mouseX)
    const scrollY = Math.round((zoomY * (currentZoom / 100)) - mouseY)
    container.scrollTo(scrollX, scrollY)
  },

  setZoom (value) {
    HelperCanvas.getCanvas().style.zoom = value + '%'
    this.updateZoomLevel(value + '%')
    HelperTrigger.triggerReload('element-overlay', { panelReload: false })
  },

  updateZoomLevel (text) {
    const block = document.getElementsByClassName('canvas-zoom-reset')[0]
    block.textContent = text
  }
}
