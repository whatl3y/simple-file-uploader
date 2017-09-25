/*
 * Author: Lance Whatley
 *
 * Credit: Remy Alain Ticona Carbajal http://realtica.org
 * Documentation at: https://github.com/angular-ui/ui-uploader
 * NOTE: There are likely some differences in the API in this
 * factory function since it's not an angular module
 *
 * Licence: MIT
 */

(function (self) {
  if (self.SimpleFileUploader) return

  module.exports = self.SimpleFileUploader = {
    options: {},
    files: [],
    activeUploads: 0,
    uploadedFiles: 0,

    addFiles(files) {
      for (let i = 0; i < files.length; i++) {
        this.files.push(files[i])
      }
    },

    getFiles() {
      return this.files
    },

    startUpload(options=this.options) {
      this.options = options

      //headers are not shared by requests
      const headers = this.options.headers || {}
      const xhrOptions = this.options.options || {}
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i]
        if (this.activeUploads == this.options.concurrency)
          break
        if (file.active)
          continue
        this.ajaxUpload(file, this.options.url, this.options.data, this.options.paramName, headers, xhrOptions)
      }
    },

    removeFile(file) {
      this.files.splice(this.files.indexOf(file), 1)
    },

    removeAll() {
      this.files.splice(0, this.files.length)
    },

    getHumanSize(bytes) {
      const sizes = ['n/a', 'bytes', 'KiB', 'MiB', 'GiB', 'TB', 'PB', 'EiB', 'ZiB', 'YiB']
      const i = (bytes === 0) ? 0 : +Math.floor(Math.log(bytes) / Math.log(1024))
      return (bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0) + ' ' + sizes[isNaN(bytes) ? 0 : i + 1]
    },

    ajaxUpload(file, url, data, key, headers, xhrOptions) {
      data = data || {}
      key = key || 'file'

      let xhr, formData, prop
      this.activeUploads += 1
      file.active = true
      xhr = new window.XMLHttpRequest()

      // To account for sites that may require CORS
      if (xhrOptions.withCredentials === true) {
        xhr.withCredentials = true
      }
      formData = new window.FormData()
      xhr.open('POST', url)

      if (headers) {
        for (let headerKey in headers) {
          if (headers.hasOwnProperty(headerKey)) {
            xhr.setRequestHeader(headerKey, headers[headerKey])
          }
        }
      }

      // Triggered when upload starts:
      xhr.upload.onloadstart = () => {}

      // Triggered many times during upload:
      xhr.upload.onprogress = event => {
        if (!event.lengthComputable)
          return
        // Update file size because it might be bigger than reported by
        // the fileSize:
        file.loaded = event.loaded
        file.humanSize = this.getHumanSize(event.loaded)
        if (typeof this.options.onProgress === 'function') {
          this.options.onProgress(file)
        }
      }

      // Triggered when the upload is successful (the server may not have responded yet).
      xhr.upload.onload = () => {
        if (typeof this.options.onUploadSuccess === 'function') {
          this.options.onUploadSuccess(file)
        }
      }

      // Triggered when upload fails:
      xhr.upload.onerror = e => {
        if (typeof this.options.onError === 'function') {
          this.options.onError(e)
        }
      }

      // Triggered when the upload has completed AND the server has responded. Equivalent to
      // listening for the readystatechange event when xhr.readyState === XMLHttpRequest.DONE.
      xhr.onload = () => {
        this.activeUploads -= 1
        this.uploadedFiles += 1
        this.startUpload()
        if (typeof this.options.onCompleted === 'function') {
          this.options.onCompleted(file, xhr.responseText, xhr.status)
        }
        if (this.activeUploads === 0) {
          this.uploadedFiles = 0
          if (typeof this.options.onCompletedAll === 'function') {
            this.options.onCompletedAll(this.files)
          }
        }
      }

      // Append additional data if provided:
      if (data) {
        for (prop in data) {
          if (data.hasOwnProperty(prop)) {
            formData.append(prop, data[prop]);
          }
        }
      }

      // Append file data:
      formData.append(key, file, file.name)

      // Initiate upload:
      xhr.send(formData)
      return xhr
    }
  }
})(typeof self !== 'undefined' ? self : this)
