/**
 * Created by ChienHo on 2018/2/28.
 */

/**
 * 二进制字节流转data url
 * @param frame
 * @returns {string}
 */
exports.bin2base64 = function(frame) {
    if (!frame) {
        return;
    }
    var buffer = new Uint8Array(frame);
    var buffer_length = buffer.length;
    if (buffer_length < 4) {
        return;
    }
    //MIME判断
    var mime;
    if (buffer[0] == 0x89 && buffer[1] == 0x50 && buffer[2] == 0x4E && buffer[3] == 0x47) {
        mime = 'image/png';
    } else if (buffer[0] == 0xFF && buffer[1] == 0xD8) {
        mime = 'image/jpeg';
    } else if (buffer[0] == 0x47 && buffer[1] == 0x49 && buffer[2] == 0x46) {
        mime = 'image/gif';
    } else {
        return;
    }
    var binary = '';
    for (var i = 0; i < buffer_length; i++) {
        binary += String.fromCharCode(buffer[i]);
    }
    return 'data:' + mime + ';base64,' + window.btoa(binary);
};

/**
 * data url转二进制字节流
 * @param dataUrl
 * @returns {Uint8Array}
 */
exports.base642bin = function(dataUrl) {
    dataUrl = dataUrl.split(',');
    if (dataUrl.length != 2) {
        return new Uint8Array(0);
    }
    var buffer = new Uint8Array(dataUrl[1].length);
    for (var i = 0; i < dataUrl[1].length; i++) {
        buffer[i] = dataUrl[1].charCodeAt(i);
    }
    return buffer;
};
