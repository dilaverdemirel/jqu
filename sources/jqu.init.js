/**
 * @author dilaverdemirel
 * @license MIT dilaverdemirel <https://github.com/dilaverdemirel>
 
 * version 1.0.0
 */
 
var pathAssets = "/jqu/lib" 
 
function MyGritter(title, msg) {
    var _title = title;
    var _msg = msg;

    function getTitleAndMsg() {
        return _title + _msg;
    }

    this.centerInfo = function () {
        jQuery.gritter.add({
            title: _title,
            text: _msg,
            image: pathAssets + '/img/info.png',
            class_name: 'gritter-info gritter-center'
        });
        return false;
    };

    this.centerWarning = function () {
        jQuery.gritter.add({
            title: _title,
            text: _msg,
            image: pathAssets + '/img/warning.png',
            class_name: 'gritter-warning gritter-center'
        });
        return false;
    };

    this.centerError = function () {
        jQuery.gritter.add({
            title: _title,
            text: _msg,
            image: pathAssets + '/img/error.png',
            class_name: 'gritter-error gritter-center'
        });
        return false;
    };

    this.error = function () {
        jQuery.gritter.add({
            title: _title,
            text: _msg,
            image: pathAssets + '/img/error.png',
            class_name: 'gritter-error'
        });
        return false;
    };

    this.warning = function () {
        jQuery.gritter.add({
            title: _title,
            text: _msg,
            image: pathAssets + '/img/warning.png',
            class_name: 'gritter-warning'
        });
        return false;
    };

    this.info = function () {
        jQuery.gritter.add({
            title: _title,
            text: _msg,
            image: pathAssets + '/img/info.png',
            class_name: 'gritter-info'
        });
        return false;
    };

    this.success = function () {
        jQuery.gritter.add({
            title: _title,
            text: _msg,
            image: pathAssets + '/img/success.png',
            class_name: 'gritter-success'
        });
        return false;
    };

    this.getTitle = function () {
        return _title;
    };
    this.setTitle = function (value) {
        _title = value;
    }

    this.getMsg = function () {
        return _msg;
    };
    this.setMsg = function (value) {
        _msg = value;
    }


    this.getTogether = function () {
        alert(getTitleAndMsg());
        return false;
    };

    this.setProperty = function (name, value) {
        privateProps[name] = value;
    }

    this.getProperty = function (name) {
        return privateProps[name];
    }
} 
 
var gritter
var jqu
$(document).ready(function(){

    /**
     * Mesaj gosteriminde kullanilan Gritter plug-in'nini initialize etmeyi saglar.
     * @type {MyGritter}
     */
    gritter = new MyGritter('Hata', '');

    jqu = JQU
})
