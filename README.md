# Simple File Uploader

Simple File Uploader is a single/multiple and high customizable file
uploader and the most important is very easy to implement.

This is basically the same file upload utility as https://github.com/angular-ui/ui-uploader,
but without the AngularJS dependency.

  - Upload multiple or single files
  - Cancel or remove upload when you want.
  - Allows concurrent Upload
  - Totally cutomizable

## Compatibility

Because this project uses [FormData](http://caniuse.com/#search=formdata),
it does **not** work on IE9 or earlier.

## Install

```sh
npm install --save simple-file-uploader
```

## Add Script

```js
import SimpleFileUploader from 'simple-file-uploader'
// or
const SimpleFileUploader = require('simple-file-uploader')
```

## Usage

```js
// Add and/or remove files as desired
SimpleFileUploader.addFiles(files);
SimpleFileUploader.remove(file);
SimpleFileUploader.removeAll();

// Send files to server
SimpleFileUploader.startUpload({
  url: 'http://my_domain.com',
  data: { key1: value1, key2: value2 },
  concurrency: 2,
  onProgress: function(file) {
      // file contains a File object
      console.log(file);
  },
  onUploadSuccess: function(file) {
      // file contains a File object
      console.log(file);
  },
  onCompleted: function(file, responseText, status) {
      // file contains a File object
      console.log(file);
      // responseText contains the server response as text
      console.log(responseText);
      // status contains the status of the response
      console.log(status);
  },
  onCompletedAll: function(files) {
  	// files is an array of File objects
  	console.log(files);
  }
});

// Custom headers
SimpleFileUploader.startUpload({
  url: 'http://my_domain.com',
  concurrency: 2,
  headers: {
      'Accept': 'application/json'
  },
  onCompletedAll: function(files) {
  	// files is an array of File objects
  	console.log(files);
  }
});
```

## Additional Documentation

[ui-uploader](https://github.com/angular-ui/ui-uploader)

## Development

The only source file is located at `./src/FileUploader.js`, and after
any changes desired you can use gulp to build.

```sh
gulp build
```
