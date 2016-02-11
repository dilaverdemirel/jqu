/**
 * @author dilaverdemirel
 * @license MIT dilaverdemirel <https://github.com/dilaverdemirel>
 
 * version 1.0.0
 */
 
jqudsl = function (data) {
    var base = this;

    base.data = {}
    base.containerId = null
    base.collectedData = {}
    base.onCompleteFnc = function () {
    }
    base.loadOptionsData = {}

    base.data = function (data) {
        base.data = data
        return this
    }

    base.fill = function (containerId) {
        if(JQU.hasValue(containerId)) {
            base.containerId = containerId
        }
        JQU.fillForm(base.data, containerId)
        base.runOnComplete()
        return this
    }

    base.open = function () {
        var form = $('#' + base.containerId);
        JQU.openDialog($(form).closest(".modal").attr("id"))
        base.runOnComplete()
        return this
    }

    base.container = function (containerId) {
        base.containerId = containerId
        return this
    }

    base.parameters = function (data) {
        base.collectedData = data
        return this
    }

    base.collect = function (elements) {
        if (JQU.hasValue(elements)) {
            base.collectedData = JQU.prepareJSONFromDOM({"elements" :elements, "containerId" : base.containerId})
        } else {
            base.collectedData = JQU.EL(base.containerId).serializeFormToJSON()
        }
        base.onCompleteData = base.collectedData

        base.runOnComplete()

        return this
    }

    base.loadOptions = function (options) {
        base.loadOptionsData = $.extend({
            dataUrl: "",
            dataType: "json",
            method: "POST",
            parameters: {},
            showResponseMessage: false
        }, options);

        return this
    }

    base.load = function (url) {
        if (!JQU.hasValue(base.collectedData)) {
            base.collectedData = {}
        }

        var optionsTemp = {
            dataUrl: url,
            parameters: base.collectedData
        }

        var options = $.extend(optionsTemp, base.loadOptionsData);

        base.data = JQU.loadData(options)
        base.onCompleteData = base.data

        if(base.onCompleteData != "[AJAX_ERROR]") {
            base.runOnComplete()
        }
        return this
    }

    base.sendOptions = function (options) {
        return base.loadOptions(options)
    }

    base.send = function(url){
        return base.load(url)

    }

    base.onComplete = function (fnc) {
        base.onCompleteFnc = fnc
        return this
    }

    base.runOnComplete = function () {
        eval("base.onCompleteFnc(base.onCompleteData)")
        base.onCompleteFnc = function () {
        }
        return this
    }

    base.reload = function (elements) {
        $.each(elements, function (i, item) {
            if(JQU.hasValue(item)) {
                eval(item).reload()
            }
        })
        return this
    }

    base.clear = function () {
        JQU.resetForm(base.containerId)
        return this
    }
};

dsl = function () {
    return new jqudsl()
};