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
        "Success" : "Success",
        "Fail" : "Fail",
        "Info" : "Info",
        "Warning" : "Warning",
        "lov-selection-button":"<button class='btn btn-xs btn-yellow' type = 'button' ><i class='fa fa-hand-o-up bigger-120'></i></button>",
        "required-message" : "Please enter a value for #1#",
        "select-an-item-message" : "Select An Item"
    }

    //expose globally
    window.JQU.messages = messages;

})(window);