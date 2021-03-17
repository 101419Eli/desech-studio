import HelperDOM from '../../../../helper/HelperDOM.js'
import InputUnitField from '../../../../component/InputUnitField.js'
import RightFillProperty from './RightFillProperty.js'
import HelperEvent from '../../../../helper/HelperEvent.js'
import RightFillCommon from './RightFillCommon.js'
import RightCommon from '../../RightCommon.js'
import StyleSheetSelector from '../../../../state/stylesheet/StyleSheetSelector.js'
import ColorPickerGradient from '../../../../component/color-picker/ColorPickerGradient.js'
import HelperStyle from '../../../../helper/HelperStyle.js'

export default {
  getEvents () {
    return {
      change: ['changeSizeLengthEvent', 'changePositionEvent', 'changeSizeEvent', 'changeSelectEvent'],
      setsource: ['setsourceImageEvent']
    }
  },

  handleEvent (event) {
    HelperEvent.handleEvents(this, event)
  },

  changeSizeLengthEvent (event) {
    if (event.target.classList.contains('background-image-size-length')) {
      this.setBackgroundSize(event.target.closest('form'))
    }
  },

  changePositionEvent (event) {
    if (event.target.classList.contains('background-image-position')) {
      this.setBackgroundPosition(event.target.closest('form'))
    }
  },

  changeSizeEvent (event) {
    if (event.target.classList.contains('background-image-size')) {
      this.changeSize(event.target)
    }
  },

  changeSelectEvent (event) {
    if (event.target.classList.contains('background-image-select')) {
      this.changeSelect(event.target)
    }
  },

  setsourceImageEvent (event) {
    if (event.target.closest('.background-fill-container #picker-source-image')) {
      this.setImageSource(event.target, event.detail)
    }
  },

  changeSize (select) {
    this.toggleSizeLength(select)
    this.setBackgroundSize(select.closest('form'))
  },

  toggleSizeLength (select) {
    const container = select.parentNode.nextElementSibling
    HelperDOM.toggle(container, select.value === 'length')
  },

  setBackgroundSize (form) {
    const value = this.getBackgroundSize(form.elements)
    const index = RightFillCommon.getActiveElementIndex(form.closest('#fill-section'))
    this.setBackgroundProperty('background-size', index, value)
  },

  getBackgroundSize (fields) {
    if (!fields.size.value) return ''
    if (fields.size.value !== 'length') return fields.size.value
    return this.getDoubleFields(fields.width, fields.height)
  },

  getDoubleFields (first, second) {
    const value1 = InputUnitField.getValue(first)
    const value2 = InputUnitField.getValue(second)
    return (value1 + ' ' + value2).trim()
  },

  setBackgroundProperty (property, index, value) {
    value = value || HelperStyle.getDefaultProperty(property)
    const fullValue = RightFillProperty.replaceBackgroundPropertyAtIndex(property, index, value)
    RightCommon.changeStyle({
      [property]: fullValue
    })
  },

  setBackgroundPosition (form) {
    const value = this.getDoubleFields(form.elements.x, form.elements.y)
    const index = RightFillCommon.getActiveElementIndex(form.closest('#fill-section'))
    this.setBackgroundProperty('background-position', index, value)
  },

  changeSelect (select) {
    const index = RightFillCommon.getActiveElementIndex(select.closest('#fill-section'))
    this.setBackgroundProperty(select.dataset.type, index, select.value)
  },

  incrementBackgroundProperties () {
    const selector = StyleSheetSelector.getCurrentSelector()
    for (const property of ['size', 'position', 'repeat', 'attachment', 'origin', 'blend-mode']) {
      RightFillProperty.insertBackgroundProperty('background-' + property, selector)
    }
  },

  setImageSource (button, file) {
    file = encodeURI(file)
    ColorPickerGradient.setBackgroundImageSource(button.closest('.fill-image'), file)
    RightFillProperty.updateBackgroundImage(button.closest('form.slide-container'))
  },

  injectBackgroundImage (container, elemIndex) {
    const fields = container.getElementsByClassName('fill-background-image')[0].elements
    const selector = StyleSheetSelector.getCurrentSelector()
    this.injectBackgroundSize(container, fields, selector, elemIndex)
    this.injectBackgroundPosition(fields, selector, elemIndex)
    this.injectBackgroundSelect(fields.repeat, selector, elemIndex)
    this.injectBackgroundSelect(fields.attachment, selector, elemIndex)
    this.injectBackgroundSelect(fields.origin, selector, elemIndex)
    this.injectBackgroundSelect(fields.blendmode, selector, elemIndex)
  },

  injectBackgroundSize (container, fields, selector, elemIndex) {
    const value = RightFillProperty.getBackgroundPropertyAtIndex(selector, 'background-size', elemIndex)
    if (['cover', 'contain'].includes(value)) {
      fields.size.value = value
    } else if (value !== 'auto') { // ignore the default auto value
      this.injectBackgroundSizeLength(container, fields, value.split(' '))
    }
  },

  injectBackgroundSizeLength (container, fields, values) {
    HelperDOM.show(container.getElementsByClassName('background-size-length')[0])
    fields.size.value = 'length'
    InputUnitField.setValue(fields.width, values[0])
    InputUnitField.setValue(fields.height, values[1] || values[0])
  },

  injectBackgroundPosition (fields, selector, elemIndex) {
    const value = RightFillProperty.getBackgroundPropertyAtIndex(selector, 'background-position', elemIndex)
    const values = value.split(' ')
    InputUnitField.setValue(fields.x, values[0])
    InputUnitField.setValue(fields.y, values[1] || values[0])
  },

  injectBackgroundSelect (select, selector, elemIndex) {
    select.value = RightFillProperty.getBackgroundPropertyAtIndex(selector, select.dataset.type, elemIndex)
  }
}
