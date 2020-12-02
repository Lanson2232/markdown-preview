const textEditor = document.querySelector('#editor');
const textPreview = document.querySelector('#preview');
const textEditorUploadToHastebin = document.querySelector('#editorUploadToHastebin');
const textEditorDownloadFile = document.querySelector('#editorDownloadFile');
const textPreviewUploadToHastebin = document.querySelector('#previewUploadToHastebin');
const textPreviewDownloadFile = document.querySelector('#previewDownloadFile');


textEditor.addEventListener('keyup', evt => {
  const { value } = evt.target;
  var converter = new showdown.Converter(),
    html = converter.makeHtml(value);
  textPreview.innerHTML = html;
})


/* https://github.com/Rob--W/cors-anywhere/blob/master/demo.html */
var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
function createPasteEditor(options, printResult) {
  var x = new XMLHttpRequest();
  x.open(options.method, cors_api_url + "https://hastebin.com/documents");
  x.onload = x.onerror = function () {
    printResult("https://hastebin.com/" + JSON.parse(x.responseText).key);
  };
  if (/^POST/i.test(options.method)) {
    x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }
  x.send(textEditor.value ? textEditor.value : " ");
}

function createPastePreview(options, printResult) {
  var x = new XMLHttpRequest();
  x.open(options.method, cors_api_url + "https://hastebin.com/documents");
  x.onload = x.onerror = function () {
    printResult("https://hastebin.com/" + JSON.parse(x.responseText).key);
  };
  if (/^POST/i.test(options.method)) {
    x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }
  x.send(textPreview.innerHTML ? textPreview.innerHTML : " ");
}

/* https://stackoverflow.com/a/31596687 */
function copyToClipboardFF(text) {
  window.prompt("Copy to clipboard: Ctrl C, Enter", text);
}
function copyToClipboard(text) {
  var success = true,
    range = document.createRange(),
    selection;
  // For IE.
  if (window.clipboardData) {
    window.clipboardData.setData("Text", text);
  } else {
    // Create a temporary element off screen.
    var tmpElem = $('<div>');
    tmpElem.css({
      position: "absolute",
      left: "-1000px",
      top: "-1000px",
    });
    // Add the input value to the temp element.
    tmpElem.text(text);
    $("body").append(tmpElem);
    // Select temp element.
    range.selectNodeContents(tmpElem.get(0));
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    // Lets copy.
    try {
      success = document.execCommand("copy", false, null);
    }
    catch (e) {
      copyToClipboardFF(input.val());
    }
    if (success) {
      alert("The text is on the clipboard, try to paste it!");
      // remove temp element.
      tmpElem.remove();
    }
  }
}

const fileDownload = (content, filename, contentType) => {
  const a = document.createElement('a');
  const file = new Blob([content], {type: contentType});
  a.href= URL.createObjectURL(file);
  a.download = filename;
  a.click();
  alert("file saved!")
	URL.revokeObjectURL(a.href);
};

textEditorDownloadFile.addEventListener('click', () => {
  fileDownload(textEditor.value, 'MarkdownPreview.md', 'text/plain');
});
textEditorUploadToHastebin.addEventListener('click', event => {
  createPasteEditor({ method: 'POST' }, function (data) {
    copyToClipboard(data)
  })
})

textPreviewDownloadFile.addEventListener('click', () => {
  fileDownload(textPreview.innerHTML, 'MarkdownPreview.html', 'text/plain');
});
textPreviewUploadToHastebin.addEventListener('click', event => {
  createPastePreview({ method: 'POST' }, function (data) {
    copyToClipboard(data)
  })
})
