import HelperEvent from '../../../helper/HelperEvent.js'
import RightHtmlCommon from '../../right/section/html/RightHtmlCommon.js'
import HelperTrigger from '../../../helper/HelperTrigger.js'
import HelperDOM from '../../../helper/HelperDOM.js'
import HelperElement from '../../../helper/HelperElement.js'
import CanvasElementManage from './CanvasElementManage.js'
import Contextmenu from '../../../component/Contextmenu.js'
import CanvasElementSelect from './CanvasElementSelect.js'
import HelperFile from '../../../helper/HelperFile.js'
import HelperProject from '../../../helper/HelperProject.js'
import CanvasElementComponent from './CanvasElementComponent.js'

export default {
  getEvents () {
    return {
      click: ['clickHideMenuEvent', 'clickHideElementEvent', 'clickShowElementEvent',
        'clickCopyElementEvent', 'clickCutElementEvent', 'clickPasteElementEvent',
        'clickDuplicateElementEvent', 'clickDeleteElementEvent', 'clickCopyAllEvent',
        'clickCopyAttributesEvent', 'clickCopyStyleEvent', 'clickPasteAllEvent',
        'clickCopySelectorEvent', 'clickCutSelectorEvent', 'clickPasteSelectorEvent',
        'clickInsertComponentChildrenEvent'],
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
    if (event.target.closest('.element')) {
      this.showContextmenu(event.target.closest('.element'), event.clientX, event.clientY)
    }
  },

  contextmenuSidebarShowMenuEvent (event) {
    if (event.target.closest('.panel-element-item')) {
      this.showSidebarContextmenu(event.target.closest('.panel-element-item'), event.clientX,
        event.clientY)
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

  clickDeleteElementEvent (event) {
    if (event.target.classList.contains('element-menu-delete')) {
      CanvasElementManage.deleteElement()
    }
  },

  async clickCopyAllEvent (event) {
    if (event.target.classList.contains('element-menu-copy-all')) {
      await CanvasElementManage.copyAll()
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
      await CanvasElementManage.pasteAll()
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

  clickInsertComponentChildrenEvent (event) {
    if (event.target.classList.contains('element-menu-component-children')) {
      CanvasElementComponent.insertComponentChildren()
    }
  },

  showContextmenu (element, x, y) {
    // select the correct element when dealing with components
    element = CanvasElementSelect.selectElement(element)
    const menu = document.getElementById('element-contextmenu')
    const options = this.getMenuOptions(element)
    Contextmenu.reloadMenu(menu, options, x, y)
  },

  getMenuOptions (element) {
    const type = HelperElement.getType(element)
    const template = this.getMenuOptionsTemplate(type)
    this.toggleVisibleInMenu(template, element, type)
    this.toggleComponentChildren(template, type)
    return template
  },

  getMenuOptionsTemplate (type) {
    const fragment = (type === 'component' || type === 'component-children') ? type : 'general'
    return HelperDOM.getTemplate(`template-contextmenu-element-${fragment}`)
  },

  toggleVisibleInMenu (menu, element, type) {
    if (HelperDOM.isVisible(element)) return
    const item = menu.getElementsByClassName('element-menu-hide')[0]
    HelperDOM.hide(item)
    HelperDOM.show(item.nextElementSibling)
  },

  toggleComponentChildren (menu, type) {
    if (type === 'component' || type === 'component-children' ||
      !HelperFile.isComponentFile(HelperProject.getFile())) {
      return
    }
    const item = menu.getElementsByClassName('element-menu-component-children')[0]
    HelperDOM.show(item)
  },

  showSidebarContextmenu (li, x, y) {
    const element = HelperElement.getElement(li.dataset.ref)
    this.showContextmenu(element, x, y)
  },

  showHideElement (hidden) {
    Contextmenu.emptyMenu()
    RightHtmlCommon.setHidden(hidden)
    HelperTrigger.triggerReload('sidebar-left-panel', { panel: 'element' })
    HelperTrigger.triggerReload('right-panel-style')
  }
}
