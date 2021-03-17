import HelperDOM from '../../helper/HelperDOM.js'
import StateStyleSheet from '../StateStyleSheet.js'
import HelperLocalStore from '../../helper/HelperLocalStore.js'
import HelperElement from '../../helper/HelperElement.js'
import StyleSheetCommon from '../stylesheet/StyleSheetCommon.js'
import StyleSheetSelector from '../stylesheet/StyleSheetSelector.js'
import StateCommandCommon from './StateCommandCommon.js'
import HelperTrigger from '../../helper/HelperTrigger.js'
import ProjectResponsive from '../../start/project/ProjectResponsive.js'
import ExtendJS from '../../helper/ExtendJS.js'
import HelperProject from '../../helper/HelperProject.js'

export default {
  addElement (data) {
    const element = HelperElement.getElement(data.ref)
    HelperDOM.show(element)
  },

  removeElement (data) {
    const element = HelperElement.getElement(data.ref)
    delete element.dataset.ssHidden
    HelperDOM.hide(element)
  },

  pasteElement (data) {
    this.addElement(data)
  },

  duplicateElement (data) {
    // alias
    this.pasteElement(data)
  },

  cutElement (data) {
    this.removeElement(data)
  },

  moveElement (data) {
    const showElem = HelperElement.getElement(data.show)
    HelperDOM.show(showElem)
    const hideElem = HelperElement.getElement(data.hide)
    HelperDOM.hide(hideElem)
  },

  changeStyle (data) {
    StyleSheetCommon.addRemoveStyleRules(data, true)
  },

  cutStyle (data) {
    // alias
    this.changeStyle(data)
  },

  pasteStyle (data) {
    // alias
    this.changeStyle(data)
  },

  pasteElementData (data) {
    const element = HelperElement.getElement(data.ref)
    StateCommandCommon.pasteAttributes(element, data.ref, data.data.attributes)
    StateCommandCommon.pasteStyle(element, data.ref, data.data.style)
  },

  addSelector (data) {
    const style = StyleSheetSelector.getDeletedSelector(data.previous || data.selector)
    const properties = style && style.length ? style : [{}]
    StateStyleSheet.addSelector(data.selector, properties)
    StateCommandCommon.addSelectorLinkClass(data.selector)
  },

  removeSelector (data) {
    StateStyleSheet.saveDeletedSelector(data.selector)
    StyleSheetSelector.deleteSelector(data.selector)
    if (data.ref) StyleSheetSelector.unlinkDeletedClassSelector(data.selector, data.ref)
  },

  sortSelector (data) {
    StateStyleSheet.insertSheetAtPosition(data.selector, data.position, data.target)
    HelperDOM.reflow()
  },

  linkClass (data) {
    StyleSheetSelector.linkClass(data.cls, data.ref)
  },

  unlinkClass (data) {
    StyleSheetSelector.unlinkClass(data.cls, data.ref)
  },

  addColor (data) {
    StyleSheetCommon.addRemoveStyleRules({
      selector: ':root',
      properties: {
        [data.name]: data.value
      }
    }, true)
  },

  removeColor (data) {
    StateStyleSheet.removeStyleRule({
      selector: ':root',
      property: data.name
    })
  },

  changeText (data) {
    const element = HelperElement.getElement(data.ref)
    element.innerHTML = HelperLocalStore.getItem(data.textId)
  },

  changeAttribute (data) {
    const element = HelperElement.getElement(data.ref)
    for (const [name, value] of Object.entries(data.attributes)) {
      StateCommandCommon.setElementAttribute(element, name, value)
      StateCommandCommon.setAudioAttributes(element, name, value)
    }
  },

  changeTag (data) {
    const element = HelperElement.getElement(data.ref)
    HelperDOM.changeTag(element, data.tag)
  },

  setOptions (data) {
    const node = StateCommandCommon.getOptionsNode(data)
    node.innerHTML = data.html
  },

  setTracks (data) {
    const element = HelperElement.getElement(data.ref)
    const node = HelperElement.getNode(element)
    node.innerHTML = data.html
  },

  changeSvg (data) {
    const element = HelperElement.getElement(data.ref)
    element.setAttributeNS(null, 'viewBox', data.viewBox)
    element.innerHTML = data.svg
  },

  changeComponentProperties (data) {
    const element = HelperElement.getElement(data.ref)
    if (ExtendJS.isEmpty(data.properties)) {
      delete element.dataset.properties
    } else {
      element.dataset.properties = JSON.stringify(data.properties)
    }
    const allProperties = StateCommandCommon.getComponentAllProperties(element)
    element.dataset.allProperties = JSON.stringify(allProperties)
  },

  addResponsive (data) {
    ProjectResponsive.insertResponsive(data.responsive)
    HelperTrigger.triggerReload('responsive-mode-list')
  },

  removeResponsive (data) {
    ProjectResponsive.deleteResponsive(data.responsive)
    HelperTrigger.triggerReload('responsive-mode-list')
  },

  changeResponsive (data) {
    ProjectResponsive.editResponsive(data.current, data.previous)
    HelperTrigger.triggerReload('responsive-mode-list')
  },

  changeMeta (data) {
    HelperProject.setFileMeta(data.meta)
  }
}
