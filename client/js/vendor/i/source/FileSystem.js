!function () {
    var FileSystem = {
        saveLocal: function saveLocal(fileName, content) {
            var blob = new Blob([content], { type: 'application/octet-stream' });
            var url = webkitURL.createObjectURL(blob);
            var link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');

            link.href = url;
            link.download = fileName;

            var mouseEvent = document.createEvent('MouseEvents');
            mouseEvent.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            link.dispatchEvent(mouseEvent);
            setTimeout(function() {
                webkitURL.revokeObjectURL(url);
            }, 1000);

            /*
            var onSuccess = function(fs) {
                fs.root.getFile(fileName, { create: true }, function(file) {
                    file.createWriter(function(writer) {
                        writer.onwriteend = function() {
                            link.dispatchEvent(mouseEvent);
                            setTimeout(function() {
                                webkitURL.revokeObjectURL(url);
                            }, 1000);
                        };
                        writer.write(blob);
                    });
                });
            };
            webkitRequestFileSystem(window.TEMPORARY, blob.size, onSuccess);
            */
        },
        loadLocal: function loadLocal(file, cb) {
            var reader = new FileReader();
            reader.onload = function(e) {
                cb(this.result);
            };
            reader.readAsText(file);
        },
    };

    I.Util.require('FileSystem', '', FileSystem);
}();
