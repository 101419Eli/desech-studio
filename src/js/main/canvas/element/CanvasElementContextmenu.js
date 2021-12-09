import HelperEvent from '../../../helper/HelperEvent.js'
import RightHtmlCommon from '../../right/section/html/RightHtmlCommon.js'
import HelperTrigger from '../../../helper/HelperTrigger.js'
import HelperDOM from '../../../helper/HelperDOM.js'
import HelperElement from '../../../helper/HelperElement.js'
import CanvasElementManage from './CanvasElementManage.js'
import Contextmenu from '../../../component/Contextmenu.js'
import CanvasElementComponent from './CanvasElementComponent.js'
import Page from '../../../page/Page.js'
import StateSelectedElement from '../../../state/StateSelectedElement.js'
import HelperCanvas from '../../../helper/HelperCanvas.js'
import HelperComponent from '../../../helper/HelperComponent.js'

export default {
  getEvents () {
    return {
      click: ['clickHideMenuEvent', 'clickHideElementEvent', 'clickShowElementEvent',
        'clickCopyElementEvent', 'clickCutElementEvent', 'clickPasteElementEvent',
        'clickDuplicateElementEvent', 'clickDeleteElementEvent', 'clickCopyAllEvent',
        'clickCopyAttributesEvent', 'clickCopyStyleEvent', 'clickPasteAllEvent',
        'clickCopySelectorEvent', 'clickCutSelectorEvent', 'clickPasteSelectorEvent',
        'clickAssignComponentHoleEvent', 'clickLoadComponentEvent'],
      contextmenu: ['contextmenuCanvasShowMenuEvent', 'contextmenuSidebarShowMenuEvent']
    }
  },

  handleEvent (event) {
    HelperEvent.handleEvents(this, event)
  },

  clickHideMenuEvent (event) {
    if (HelperDOM.isVisible(document.getElementById('element-contextmenu'))) {
      Contextmenu.emptyMenu()
    }
  },

  contextmenuCanvasShowMenuEvent (event) {
    if (!HelperCanvas.isPreview() && event.target.closest('.element')) {
      const elem = StateSelectedElement.getElement() || event.target.closest('.element')
      this.showContextmenu(elem, event.clientX, event.clientY)
    }
  },

  contextmenuSidebarShowMenuEvent (event) {
    if (event.target.closest('.panel-element-item')) {
      const item = event.target.closest('.panel-element-item')
      this.showSidebarContextmenu(item, event.clientX, event.clientY)
    }
  },

  clickHideElementEvent (event) {
    if (event.target.classList.contains('element-menu-hide')) {
      this.showHideElement(true)
    }
  },

  clickShowElementEvent (event) {
    if (event.target.classList.contains('element-menu-show')) {
      this.showHideElement(false)
    }
  },

  async clickCopyElementEvent (event) {
    if (event.target.classList.contains('element-menu-copy')) {
      await CanvasElementManage.copyElement()
    }
  },

  async clickCutElementEvent (event) {
    if (event.target.classList.contains('element-menu-cut')) {
      await CanvasElementManage.cutElement()
    }
  },

  async clickPasteElementEvent (event) {
    if (event.target.classList.contains('element-menu-paste')) {
      await CanvasElementManage.pasteElement()
    }
  },

  async clickDuplicateElementEvent (event) {
    if (event.target.classList.contains('element-menu-duplicate')) {
      await CanvasElementManage.duplicateElement()
    }
  },

  async clickDeleteElementEvent (event) {
    if (event.target.classList.contains('element-menu-delete')) {
      await CanvasElementManage.deleteElement()
    }
  },

  async clickCopyAllEvent (event) {
    if (event.target.classList.contains('element-menu-copy-all')) {
      await CanvasElementManage.copyAttrStyle()
    }
  },

  async clickCopyAttributesEvent (event) {
    if (event.target.classList.contains('element-menu-copy-attributes')) {
      await CanvasElementManage.copyAttributes()
    }
  },

  async clickCopyStyleEvent (event) {
    if (event.target.classList.contains('element-menu-copy-style')) {
      await CanvasElementManage.copyStyle()
    }
  },

  async clickPasteAllEvent (event) {
    if (event.target.classList.contains('element-menu-paste-data')) {
      await CanvasElementManage.pasteAttrStyle()
    }
  },

  async clickCopySelectorEvent (event) {
    if (event.target.classList.contains('element-menu-copy-selector')) {
      await CanvasElementManage.copySelector()
    }
  },

  async clickCutSelectorEvent (event) {
    if (event.target.classList.contains('element-menu-cut-selector')) {
      await CanvasElementManage.cutSelector()
    }
  },

  async clickPasteSelectorEvent (event) {
    if (event.target.classList.contains('element-menu-paste-selector')) {
      await CanvasElementManage.pasteSelector()
    }
  },

  async clickAssignComponentHoleEvent (event) {
    if (event.target.classList.contains('element-menu-component-hole')) {
      await CanvasElementComponent.assignComponentHole(document.getElementById('html-section'))
    }
  },

  clickLoadComponentEvent (event) {
    if (event.target.classList.contains('element-menu-component-load')) {
      this.loadComponent()
    }
  },

  showContextmenu (element, x, y) {
    // select the correct element when dealing with components
    element = StateSelectedElement.selectElement(element)
    const menu = document.getElementById('element-contextmenu')
    const options = this.getMenuOptions(element)
    Contextmenu.reloadMenu(menu, options, x, y)
  },

  getMenuOptions (element) {
    const menuType = this.getMenuOptionsType(element)
    const template = HelperDOM.getTemplate(`template-contextmenu-element-${menuType}`)
    this.toggleComponent(element, template)
    if (!HelperDOM.isVisible(element)) template.classList.add('hidden')
    return template
  },

  getMenuOptionsType (element) {
    const type = HelperElement.getType(element)
    if (HelperComponent.isComponent(element)) {
      return 'component'
    } else if (type === 'body' || type === 'inline') {
      return type
    } else {
      return 'general'
    }
  },

  toggleComponent (element, container) {
    if (!HelperComponent.isMovableElement(element)) {
      // this will hide the options to delete, cut, paste, duplicate
      container.classList.add('component-element')
    }
    if (HelperComponent.canAssignComponentHole(element)) {
      container.classList.add('component-hole')
      this.swapComponentHoleLinks(element, container)
    }
  },

  swapComponentHoleLinks (element, container) {
    const same = HelperElement.getRef(element) === HelperComponent.getMainHole()
    const links = container.getElementsByClassName('element-menu-component-hole')
    HelperDOM.toggle(links[0], !same)
    HelperDOM.toggle(links[1], same)
  },

  showSidebarContextmenu (li, x, y) {
    const element = HelperElement.getElement(li.dataset.ref)
    this.showContextmenu(element, x, y)
  },

  showHideElement (hidden) {
    Contextmenu.emptyMenu()
    RightHtmlCommon.setHidden(hidden)
    HelperTrigger.triggerReload('sidebar-left-panel', { panel: 'element' })
    HelperTrigger.triggerReload('right-panel')
  },

  loadComponent () {
    const element = StateSelectedElement.getElement()
    const file = HelperComponent.getInstanceFile(element)
    Page.loadMain(file)
  }
}
