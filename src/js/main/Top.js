import HelperEvent from '../helper/HelperEvent.js'
import HelperCanvas from '../helper/HelperCanvas.js'
import TopCommon from './top/TopCommon.js'
import HelperDOM from '../helper/HelperDOM.js'
import CanvasCommon from './canvas/CanvasCommon.js'
import CanvasElementSelect from './canvas/element/CanvasElementSelect.js'
import CanvasElementComponent from './canvas/element/CanvasElementComponent.js'
import HelperProject from '../helper/HelperProject.js'
import InputUnitField from '../component/InputUnitField.js'
import HelperStyle from '../helper/HelperStyle.js'

export default {
  getEvents () {
    return {
      reloadcontainer: ['reloadcontainerEvent'],
      click: ['clickSwitchPreviewEvent'],
      keydown: ['keydownSwitchPreviewEvent']
    }
  },

  handleEvent (event) {
    HelperEvent.handleEvents(this, event)
  },

  reloadcontainerEvent (event) {
    if (event.target.id === 'responsive-mode-list') {
      this.reloadResponsive()
    }
  },

  clickSwitchPreviewEvent (event) {
    if (event.target.closest('.top-preview-button')) {
      this.switchPreview()
    }
  },

  keydownSwitchPreviewEvent (event) {
    if (event.key && HelperEvent.areMainShortcutsAllowed(event) &&
      HelperEvent.isNotCtrlAltShift(event) && event.key.toLowerCase() === 'p') {
      this.switchPreview()
    }
  },

  switchPreview () {
    const button = document.getElementById('top-preview-button')
    const enabled = button.classList.contains('selected')
    enabled ? this.disablePreview(button) : this.enablePreview(button)
  },

  enablePreview (button) {
    CanvasCommon.enablePanelButton('select')
    CanvasElementSelect.deselectElement()
    button.classList.add('selected')
    HelperCanvas.addPreview()
    CanvasElementComponent.renderComponents()
  },

  disablePreview (button) {
    button.classList.remove('selected')
    HelperCanvas.removePreview()
    CanvasElementComponent.unrenderComponents()
  },

  clearResponsive () {
    HelperDOM.deleteChildren(this.getContainer())
  },

  loadResponsive (selectedMode) {
    const list = this.getContainer()
    const settings = HelperProject.getProjectSettings()
    this.setDefaultResponsiveData(settings)
    this.addResponsiveModes(list)
    if (selectedMode) {
      const data = this.selectPreviousMode(list, selectedMode)
      TopCommon.resizeCanvas(data)
    } else {
      TopCommon.resizeCanvas(settings.responsive.default)
    }
  },

  reloadResponsive () {
    const selectedMode = document.querySelector('.responsive-mode.selected')
    this.clearResponsive()
    this.loadResponsive(selectedMode.dataset.ref)
  },

  getContainer () {
    return document.getElementById('responsive-mode-list')
  },

  setDefaultResponsiveData (settings) {
    const button = document.getElementById('responsive-mode-default')
    button.dataset.data = JSON.stringify(settings.responsive.default)
  },

  addResponsiveModes (list) {
    const modes = this.getSortedModes()
    this.addInheritData(modes)
    for (const data of modes) {
      const block = this.getResponsiveBlock(data)
      list.appendChild(block)
    }
  },

  getSortedModes () {
    const responsiveType = HelperProject.getProjectSettings().responsiveType
    return this.getModes().sort((a, b) => {
      // desktop - descending, mobile - ascending
      return (responsiveType === 'desktop') ? b.value - a.value : a.value - b.value
    })
  },

  getModes () {
    const data = []
    const settings = HelperProject.getProjectSettings()
    for (const responsive of settings.responsive.list) {
      this.addMode(data, responsive)
    }
    return data
  },

  addMode (data, responsive) {
    // min-width, max-height, width, height, value, type
    data.push({
      ...responsive,
      ...TopCommon.getResponsiveModeData(responsive)
    })
  },

  addInheritData (list) {
    for (let i = 0; i < list.length; i++) {
      // all previous siblings are inherited media queries which we will need to add to the canvas
      list[i].inherit = list.slice(0, i + 1).map(mode => mode['min-width'] || mode['max-width'])
    }
    return list
  },

  getResponsiveBlock (data) {
    const template = HelperDOM.getTemplate('template-responsive-mode')
    const button = this.addButton(template, data)
    this.buildEditOverlay(button, data)
    return template
  },

  addButton (template, data) {
    const button = template.getElementsByClassName('responsive-mode')[0]
    this.addButtonSvg(button, data)
    const value = data['min-width'] || data['max-width']
    button.dataset.ref = HelperStyle.getResponsiveClass(value)
    const inheritClasses = this.getInheritClasses(data)
    button.dataset.data = JSON.stringify({ ...data, inheritClasses })
    return button
  },

  addButtonSvg (button, data) {
    const svg = HelperDOM.getTemplate(`template-responsive-mode-${data.type}`)
    button.appendChild(svg)
  },

  getInheritClasses (data) {
    const value = data['min-width'] || data['max-width']
    const ref = HelperStyle.getResponsiveClass(value)
    const inherit = data.inherit.map(value => HelperStyle.getResponsiveClass(value)).join(' ')
    return (ref + ' ' + inherit).trim()
  },

  buildEditOverlay (button, data) {
    const form = TopCommon.createOverlay(button.nextElementSibling, 'edit')
    this.addOverlayData(form.elements, data)
  },

  addOverlayData (fields, data) {
    if (data['min-width']) InputUnitField.setValue(fields['min-width'], data['min-width'])
    if (data['max-width']) InputUnitField.setValue(fields['max-width'], data['max-width'])
  },

  selectPreviousMode (list, selectedMode) {
    const button = list.querySelector(`.responsive-mode[data-ref="${selectedMode}"]`)
    button.classList.add('selected')
    return JSON.parse(button.dataset.data)
  }
}
