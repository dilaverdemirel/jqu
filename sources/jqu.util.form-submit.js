/**
 * @author dilaverdemirel
 * @license MIT dilaverdemirel <https://github.com/dilaverdemirel>
 
 * version 1.0.0
 */

(function($){
    if(!$.jqutilities){
        $.jqutilities = new Object();
    };

    $.jqutilities.jquFormSubmit = function(el, options){
        var base = this;
        base.jqel = $(el);
        base.el = el;

        //Elementin DOM agacina configurasyon datasi saklanir
        base.jqel.data("jqutilities.jquFormSubmit", base);

        base.init = function(){
            base.options = $.extend({},$.jqutilities.jquFormSubmit.defaultOptions, options);

            if(!JQU.hasValue(base.options.formId)){
                JQU.showMessage(JQU.messageType.ERROR,"formId is required!")
                return false;
            }

            var form = $("#"+base.options.formId)
            var formDataType = $(form).attr("form-data-type")
            var valid = base.validate(form)

            if(valid == "errorfalse"){
                return false
            } else if(valid == "errortrue"){
                return true
            }

            var loadOnComplete = function(data){
                dsl().reload(base.options.updatedToTables)
                eval(base.options.onComplete)
            }

            var loadOptions = { dataUrl: base.options.formSendUrl,
                                method: base.options.formMethod,
                                parameters: base.prepareData(form,formDataType),
                                dataType : formDataType,
                                showResponseMessage: true }

            dsl().loadOptions(loadOptions)
                 .onComplete(loadOnComplete)
                 .load()

            return false;
        };

        base.prepareData = function(form,formDataType){
            var formData = ""

            if(!JQU.hasValue(formDataType)){
                formDataType = "json"
            }

            if(formDataType == "text"){
                formData = $(form).serializeFormToJSON("text")
            } else {
                formData = $(form).serializeFormToJSON()
            }

            console.log(formData);
            return formData
        }

        base.validate = function(form){
            var pickLists = $("#"+base.options.formId).find(".sisPicklist")
            var pickListError = false
            $.each(pickLists,function(i,item){
                if(!pickListError) {
                    var selectedValue = $(item).find("option:selected").text()
                    var validationMessage = $(item).attr("validation-message")
                    if ($(item).prop("required") && !JQU.hasValue(selectedValue)) {
                        if(!JQU.hasValue(validationMessage)) {
                            JQU.showMessage(JQU.messageType.ERROR, JQU.formatMessage("required-message", $(item).attr("select-label")))
                        } else {
                            JQU.showMessage(JQU.messageType.ERROR, validationMessage)
                        }
                        $(item).next("div").find("button").focus()
                        pickListError = true
                    }
                }
            })

            if(pickListError){
                return "errorfalse";
            }

            //Checkbox ve optionbox larin kontrolu
            var itemContainers = $("#"+base.options.formId).find(".sisFieldContainer")
            var itemContainersError = false
            $.each(itemContainers,function(i,item){
                if(!itemContainersError) {
                    var selected = $(item).find("input:checked").length
                    var required = $(item).attr("field-required")
                    var validationMessage = $(item).attr("validation-message")
                    if (required == "true" && selected == 0) {
                        if(!JQU.hasValue(validationMessage)) {
                            JQU.showMessage(JQU.messageType.ERROR, JQU.formatMessage("required-message", $(item).attr("field-label")))
                        } else {
                            JQU.showMessage(JQU.messageType.ERROR, validationMessage)
                        }
                        $(item).find("input:first").focus()
                        itemContainersError = true
                    }
                }
            })

            if(itemContainersError){
                return "errorfalse";
            }

            //ColorPicker larin kontrolu
            var colorPickers = $("#"+base.options.formId).find(".sisColorPicker")
            var colorPickersError = false
            $.each(colorPickers,function(i,item){
                if(!colorPickersError) {
                    var value = $(item).val()
                    var required = $(item).attr("field-required")
                    var validationMessage = $(item).attr("validation-message")
                    if (required == "true" && !JQU.hasValue(value)) {
                        if(!JQU.hasValue(validationMessage)) {
                            JQU.showMessage(JQU.messageType.ERROR, JQU.formatMessage("required-message", $(item).attr("field-label")))
                        } else {
                            JQU.showMessage(JQU.messageType.ERROR, validationMessage)
                        }
                        colorPickersError = true
                    }
                }
            })

            if(colorPickersError){
                return "errorfalse";
            }

            var valid = form[0].checkValidity()

            if(!valid){
                return "errortrue"
            }

            return "valid"
        }

    };

    $.jqutilities.jquFormSubmit.defaultOptions = {
        formId: "",
        formSendUrl: "",
        formMethod: "post",
        updatedToTables: "{}",
        onComplete : function(){}
    };

    $.fn.jquFormSubmit = function(options){
        return (new $.jqutilities.jquFormSubmit(this, options)).init();
    };

})(jQuery);