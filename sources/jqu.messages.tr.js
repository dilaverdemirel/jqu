/**
 * @author dilaverdemirel
 * @license MIT dilaverdemirel <https://github.com/dilaverdemirel>
 
 * version 1.0.0
 */
 

(function (window) {

    if (window.JQU.messages) {
        return;
    }

    var messages = {
        "Success" : "Başarılı",
        "Fail" : "Hatalı",
        "Info" : "Bilgi",
        "Warning" : "Uyarı",
        "lov-selection-button":"<button class='btn btn-xs btn-yellow' type = 'button' ><i class='fa fa-hand-o-up bigger-120'></i></button>",
        "required-message" : "#1# için lütfen giriş yapınız!",
        "select-an-item-message" : "Seçiniz"
    }

    //expose globally
    window.JQU.messages = messages;

})(window);