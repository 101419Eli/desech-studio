import StateStyleSheet from '../../../../../state/StateStyleSheet.js'
import ColorPicker from '../../../../../component/ColorPicker.js'
import InputUnitField from '../../../../../component/InputUnitField.js'
import HelperDOM from '../../../../../helper/HelperDOM.js'
import HelperStyle from '../../../../../helper/HelperStyle.js'
import RightEffectCommon from './RightEffectCommon.js'

export default {
  getTemplate (type) {
    const name = (type === 'drop-shadow' || type === 'hue-rotate' || type === 'blur') ? type : 'other'
    return HelperDOM.getTemplate(`template-effect-filter-${name}`)
  },

  getParsedValues () {
    const source = StateStyleSheet.getPropertyValue('filter')
    return this.parseCSS(source)
  },

  parseCSS (source) {
    return HelperStyle.parseCSSValues(source, {
      valuesDelimiter: ' ',
      paramsDelimiter: ' '
    })
  },

  injectData (container, data, type) {
    if (type === 'drop-shadow') RightEffectCommon.injectColor(container, HelperStyle.getParsedCSSParam(data, 0))
    this.injectOptions(container.closest('form').elements, data, type)
  },

  injectOptions (fields, data, type) {
    InputUnitField.setValue(fields.x, HelperStyle.getParsedCSSParam(data, 1) || this.getDefaultShadowValue('x'))
    InputUnitField.setValue(fields.y, HelperStyle.getParsedCSSParam(data, 2) || this.getDefaultShadowValue('y'))
    InputUnitField.setValue(fields.blur, HelperStyle.getParsedCSSParam(data, 3) || this.getDefaultShadowValue('blur'))
    InputUnitField.setValue(fields.amount, HelperStyle.getParsedCSSParam(data, 0) || this.getDefaultFilterValue(type))
  },

  getDefaultShadowValue (name) {
    switch (name) {
      case 'x': case 'y':
        return '1px'
      case 'blur':
        return '3px'
    }
  },

  getDefaultFilterValue (type) {
    switch (type) {
      case 'opacity':
        return '100%'
      case 'blur':
        return '5px'
      case 'brightness':
        return '200%'
      case 'contrast':
        return '200%'
      case 'hue-rotate':
        return '180deg'
      case 'saturate':
        return '200%'
      case 'grayscale':
        return '100%'
      case 'sepia':
        return '100%'
      case 'invert':
        return '100%'
    }
  },

  getDisplayedValue (section, type) {
    const fields = section.getElementsByClassName('slide-container')[0].elements
    return (type === 'drop-shadow') ? this.getDropShadowFilterValue(section, fields) : this.getFilterValue(type, fields)
  },

  getDropShadowFilterValue (section, fields) {
    const color = ColorPicker.getColorPickerValue(section.getElementsByClassName('color-picker')[0])
    const { x, y, blur } = this.getDropShadowFilterOptions(fields)
    return `drop-shadow(${color} ${x} ${y} ${blur})`
  },

  getDropShadowFilterOptions (fields) {
    return {
      x: InputUnitField.getValue(fields.x) || this.getDefaultShadowValue('x'),
      y: InputUnitField.getValue(fields.y) || this.getDefaultShadowValue('y'),
      blur: InputUnitField.getValue(fields.blur) || this.getDefaultShadowValue('blur')
    }
  },

  getFilterValue (type, fields) {
    const amount = InputUnitField.getValue(fields.amount) || this.getDefaultFilterValue(type)
    return `${type}(${amount})`
  },

  getElementName (data, name) {
    const first = HelperStyle.getParsedCSSParam(data, 0)
    return (data.function === 'drop-shadow') ? `${name} ${RightEffectCommon.getColorHex(first)}` : `${name} ${first}`
  }
}
