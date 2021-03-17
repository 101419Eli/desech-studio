import ExtendJS from './ExtendJS.js'
import HelperDesignSystem from './HelperDesignSystem.js'
import HelperProject from './HelperProject.js'

export default {
  sanitizeFile (path) {
    return path.replace(/[\\/:*?"<>|]/g, '')
  },

  convertPathForWin (file, os = navigator.platform) {
    return (os.toLowerCase() === 'win32') ? file.replaceAll('/', '\\') : file
  },

  getSourceFile (file, os = navigator.platform) {
    const separator = (os.toLowerCase() === 'win32') ? '' : '/'
    return decodeURI(file.replace('file:///', separator))
  },

  getFileExtension (file) {
    if (file.includes('.')) {
      return file.substring(file.lastIndexOf('.') + 1)
    } else {
      return ''
    }
  },

  getRelPath (path, folder = null) {
    folder = folder || HelperProject.getFolder()
    return path.replace(folder + '/', '')
  },

  getAbsPath (path) {
    const root = HelperProject.getFolder()
    return root + path
  },

  getBaseHref (file, folder = null) {
    const slashes = ExtendJS.countMatches(this.getRelPath(file, folder), '/')
    if (slashes) return '../'.repeat(slashes)
    return ''
  },

  getDirname (file) {
    return file.substring(0, file.lastIndexOf('/'))
  },

  getDefaultImage () {
    const root = HelperProject.getFolder()
    return root + '/asset/image/image.jpg'
  },

  getDefaultVideo () {
    const root = HelperProject.getFolder()
    return root + '/asset/media/video.mp4'
  },

  getDefaultAudio () {
    const root = HelperProject.getFolder()
    return root + '/asset/media/audio.mp3'
  },

  getDefaultBackgroundImage () {
    const root = HelperProject.getFolder()
    return root + '/asset/image/background.png'
  },

  getDropdownImage () {
    const root = HelperProject.getFolder()
    return root + '/asset/image/arrow-down.svg'
  },

  isReadonly (file) {
    return this.isReadonlyFile(file) || this.isReadonlyFolder(file)
  },

  isReadonlyFile (file) {
    const root = HelperProject.getFolder()
    return [
      this.getDefaultImage(),
      this.getDefaultVideo(),
      this.getDefaultAudio(),
      this.getDefaultBackgroundImage(),
      this.getDropdownImage(),
      root + '/js/desech.js',
      root + '/js/design-system.js',
      root + '/index.html'
    ].includes(file) || this.isFolderFile(file, 'css')
  },

  isReadonlyFolder (folder) {
    const root = HelperProject.getFolder()
    return [
      root + '/asset',
      root + '/asset/image',
      root + '/asset/media',
      root + '/font',
      root + '/css',
      root + '/css/general',
      root + '/css/page',
      root + '/js',
      root + '/component'
    ].includes(folder) ||
      this.isFolderFile(folder, 'component/design-system')
  },

  isFolderFile (file, folder) {
    const root = HelperProject.getFolder()
    return (file.startsWith(root + '/' + folder))
  },

  isComponentFile (file) {
    return this.getFileExtension(file) === 'html' && this.isFolderFile(file, 'component')
  },

  getFullHtml (htmlFile, body = '', meta = {}, rootFolder = null, hasDesignSystem = null) {
    rootFolder = rootFolder || HelperProject.getFolder()
    return this.getFullHtmlString({
      body,
      baseHref: this.getBaseHref(htmlFile, rootFolder),
      title: meta.title || '',
      meta: meta.meta || '',
      pageCssFile: this.getPageCssFile(htmlFile, rootFolder),
      cssDesignSystem: HelperDesignSystem.getDesignSystemCssFileLink(hasDesignSystem),
      jsDesignSystem: HelperDesignSystem.getDesignSystemJsFileLink(hasDesignSystem)
    })
  },

  getPageCssFile (htmlFile, rootFolder = null) {
    rootFolder = rootFolder || HelperProject.getFolder()
    return htmlFile.replace(rootFolder + '/', '').replace('/', '-').replace('.html', '.css')
  },

  getFullHtmlString (data) {
    // change the /src/ui/index.html file too
    data.meta = data.meta || `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="generator" content="Desech Studio">`
    return `<!doctype html>
<html>
<head>
  ${data.meta}
  <title>${data.title}</title>
  <base href="${data.baseHref}">
  <script src="js/desech.js"></script>${data.jsDesignSystem}
  <link rel="stylesheet" href="css/general/reset.css">
  <link rel="stylesheet" href="css/general/animation.css">
  <link rel="stylesheet" href="css/general/font.css">${data.cssDesignSystem}
  <link rel="stylesheet" href="css/general/root.css">
  <link rel="stylesheet" href="css/general/component-css.css">
  <link rel="stylesheet" href="css/general/component-html.css">
  <link rel="stylesheet" href="css/page/${data.pageCssFile}">
</head>
<body>
${data.body}
</body>
</html>
`
  },

  getIgnoredFileFolders () {
    return ['_desech', '_export', '.keep', '.DS_Store']
  }
}
