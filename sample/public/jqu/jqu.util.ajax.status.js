/**
 * @author dilaverdemirel
 * @license MIT dilaverdemirel <https://github.com/dilaverdemirel>
 
 * version 1.0.0
 */
 
(function (window) {

    if (window.JQU.ajax) {
        return;
    }

    var ajax = {
        completeFunctions : [],
        errorFunctions : [],
        startFunctions : [],
        stopFunctions : [],
        successFunctions : [],
        clearFunctions : function(){
            JQU.clearArray(JQU.ajax.completeFunctions)
            JQU.clearArray(JQU.ajax.errorFunctions)
            JQU.clearArray(JQU.ajax.startFunctions)
            JQU.clearArray(JQU.ajax.stopFunctions)
            JQU.clearArray(JQU.ajax.successFunctions)
        },
        addCompleteEventHandler : function(fnc){
            JQU.ajax.completeFunctions.push(fnc)
        },
        addErroEventHandler : function(fnc){
            JQU.ajax.errorFunctions.push(fnc)
        },
        addStartEventHandler : function(fnc){
            JQU.ajax.startFunctions.push(fnc)
        },
        addStopEventHandler : function(fnc){
            JQU.ajax.stopFunctions.push(fnc)
        },
        addSuccessEventHandler : function(fnc){
            JQU.ajax.successFunctions.push(fnc)
        }
    };

    //expose globally
    window.JQU.ajax = ajax;

})(window);

$(document).ready(function(){
    $(document).ajaxComplete(function( event, xhr, settings ) {
        $.each(JQU.ajax.completeFunctions, function(i, fnc) {
            fnc(event, xhr, settings)
        });
    });

    $(document).ajaxError(function( event, jqxhr, settings, thrownError ) {
        $.each(JQU.ajax.errorFunctions, function(i, fnc) {
            fnc(event, jqxhr, settings, thrownError)
        });
    });

    $(document).ajaxStart(function() {
        $.each(JQU.ajax.startFunctions, function(i, fnc) {
            fnc()
        });
    });

    $(document).ajaxStop(function() {
        $.each(JQU.ajax.stopFunctions, function(i, fnc) {
            fnc()
        });
    });

    $(document).ajaxSuccess(function( event, xhr, settings ) {
        $.each(JQU.ajax.successFunctions, function(i, fnc) {
            fnc(event, xhr, settings)
        });
    });
})
