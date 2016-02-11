/**
 * @author dilaverdemirel
 * @license MIT dilaverdemirel <https://github.com/dilaverdemirel>
 
 * version 1.0.0
 */

(function (window) {

    if (window.JQU) {
        return;
    }

    var JQU = {
        /**
         * formId ile belirtilen formun elemanlarinin id leri
         * ile eslesen JSON data degerlerini form elemanlerina
         * set etmeyi saglar.
         * @param data JSON data
         * @param formId doldurulacak form id
         */
        fillForm: function (data,formId) {
            var form = $('#'+formId);
            $.each(form[0].elements, function(index, el){
                var elId = $(el).attr("id")
                if(JQU.hasValue(elId)) {
                    var value = eval("data." + elId)
                    if(value != undefined) {
                        if ($(el).hasClass("jquDatePicker")) {
                            value = JQU.formatDate(value, $(el).attr("date-pattern"))
                            $(el).datepicker("setDate", value)
                        } else if ($(el).hasClass("jquAutoComplete")) {
                            //JQU.context("dom").get($(el).attr("path")).setValue(value)
                            elId = elId.substr(0, elId.length - 5)
                            value = eval("data." + elId)
                            $(el).data("jqutilities.jquAutoComplete").setValue(value)
                        } else if ($(el).hasClass("jquSwitchBoxHidden")) {
                            $(el).data("jqutilities.jquSwitchBox").setValue(value)
                        } else if ($(el).hasClass("jquradio")) {
                            $("input[name=" + elId + "][value='" + value + "']").prop("checked", true);
                        } else if ($(el).hasClass("jquColorPicker")) {
                            $(el).spectrum("set", value);
                        } else {
                            $(el).val(value)
                        }
                    }
                }
            })
        },
        /**
         * Gonderilen JSON datayi belirtilen forma
         * doldurur ve dialogu acar.
         * @param data
         * @param formId
         */
        fillFormAndOpenDialog: function (data,formId) {
            var form = $('#'+formId);
            JQU.fillForm(data,formId)
            var dialogId = $(form).closest(".modal").attr("id")
            JQU.openDialog(dialogId)
        },
        /**
         * Dialogu acmayi saglar
         * @param dialogId
         */
        openDialog : function(dialogId){
            try{
                eval(dialogId+"OnShow()")
            }catch(err){}

            $("#"+dialogId).modal({
                show:true,
                backdrop: "static",
                keyboard: false})

            JQU.dialogZIndex++
            $("#"+dialogId).css("z-index", JQU.dialogZIndex);
            $("#"+dialogId).css("overflow-x", "hidden");
            $("#"+dialogId).css("overflow-y", "auto");
            $("#"+dialogId).css("width", "105%");
        },
        /**
         * Dialogu kapatmayi saglar
         * @param dialogId
         */
        closeDialog : function(dialogId){
            try{
                eval(dialogId+"OnClose()")
            }catch(err){}

            $("#"+dialogId).modal('hide')
        },
        /**
         * String olarak gonderilen datayi JSON formatina donusturur
         * @param json string
         * @returns {*}
         */
        parseJSON : function (json){
            return $.parseJSON(json)
        },
        /**
         * Uygulamada mesaj gosterimi yapmayi saglar
         * @param type : JQU.messageType
         * @param message
         */
        showMessage : function(type,message){
            gritter.setTitle(JQU.messages[type]);
            gritter.setMsg(message);
            if(type == "Success") {
                gritter.success();
            } else if(type == "Fail") {
                gritter.error();
            } else if(type == "Info") {
                gritter.info();
            } else if(type == "Warning") {
                gritter.warning();
            }
        },
        /**
         * Message gosteriminde kullanilmaktadir
         */
        messageType : {
            SUCCESS : "Success",
            ERROR : "Fail",
            INFO : "Info",
            WARNING : "Warning"
        },
        /**
         * Gonderilen degerin json olup olmadigini kontrol eder
         * @param json
         * @returns {boolean}
         */
        isJSON : function(json){
            try{
                $.parseJSON(json)
                return false
            }catch(err){
                return true
            }
        },
        /**
         * DataTable componentinde column'larin iceriginde custom content eklendigi zaman
         * table olusturulurken icerigi saglamak icin bu fonksiyon kullanilmaktadir.
         * @param id
         * @param index
         * @param data
         * @returns {*}
         */
        getTableColumnExternalContent : function(id,index,data){
            var html = $("#"+id+"ColumnContents").find("#ColumnContent"+index).html()
            html = exl().pattern(html)
                        .eval(data)
            return html
        },
        /**
         * jQuery ile belirtilen id'li elemente erismeyi saglar
         * @param elId
         * @param containerId
         * @returns {*}
         * @constructor
         */
        EL : function(elId,containerId){
            if(containerId != undefined && containerId != "") {
                return $("#" + elId,"#" + containerId)
            }else {
                if(elId.indexOf(".") != -1) {
                    var path = elId.split(".")
                    return $("#" + path[1],"#"+path[0])
                } else {
                    return $("#" + elId)
                }
            }
        },
        /**
         * elementlerin degerlerini almayi saglar
         *
         * @param element elementId,formId.elementId
         * @param containerId
         * @returns {{element: string, value: string}}
         */
        domElementValueGetter : function(element,containerId){
            var result = {
                element : "",
                value : "",
                containerId : ""
            }

            if(!JQU.hasValue(element)){
                return result
            }

            if(element.indexOf(".") != -1) {
                var path = element.split(".")
                value = JQU.EL(path[1], path[0]).val()
                result = {
                    element: path[1],
                    value: value,
                    containerId : path[0]
                }
            } else{
                value = JQU.EL(element,containerId).val()
                result = {
                    element: element,
                    value: value,
                    containerId : containerId
                }
            }

            return result
        },
        /**
         * Belirtilen form elementlerinin degerlerini JSON olarak saglar.
         * jsonType : ARRAY/SINGLE
         * type : BASIC/COMPLEX
         * @param elements [select,input]
         * @param containerId formId
         * @returns {*}
         */
        prepareJSONFromDOM : function(options){
            var settings = $.extend({
                type : "BASIC",
                elements : [],
                containerId : "",
                jsonType : "ARRAY"
            }, options);

            var json = ""
            var jsonOptions = {
                prefix : "[",
                suffix : "]",
                itemPrefix : "{",
                itemSuffix : "}"
            }

            if(settings.jsonType == "SINGLE"){
                jsonOptions.prefix = "{"
                jsonOptions.suffix = "}"
                jsonOptions.itemPrefix = ""
                jsonOptions.itemSuffix = ""
            }

            var preapare = function(element){
                if(settings.type == "BASIC") {
                    var result = JQU.domElementValueGetter(element,settings.containerId)
                    return jsonOptions.itemPrefix + "\"" + result.element + "\":\"" + result.value + "\"" + jsonOptions.itemSuffix;
                } else {
                    var result = JQU.domElementValueGetter(element.id,settings.containerId)
                    return jsonOptions.itemPrefix + "\"" + element.jname + "\":\"" + result.value + "\"" + jsonOptions.itemSuffix;
                }
            }

            $.each(settings.elements, function(i, element) {
                if(json == "") {
                    json = preapare(element)
                } else {
                    json += ","+preapare(element)
                }
            });

            return JQU.parseJSON(jsonOptions.prefix+json+jsonOptions.suffix)
        },
        /**
         * HTML Select'i doldurmayi saglar
         * @param pattern [value,label]
         * @param data [{persAdi:Dilaver,persSoyadi:Demirel},{persAdi:Ercan,persSoyadi:Can}]
         * @param id element id
         * @param containerId element container id
         */
        loadSelectList : function(options){

            var settings = $.extend({
                pattern: [],
                data: [],
                id: "",
                containerId : "",
                emptyItem : true,
                itemValuePattern : "",
                itemLabelPattern :""
            }, options);


            var isPatternActive = false

            if(!JQU.isJSON(settings.pattern)) {
                pattern = JQU.parseJSON(settings.pattern)
            }

            if(!JQU.hasValue(settings.itemValuePattern)){
                isPatternActive = true
            }

            var el = JQU.EL(settings.id,settings.containerId)
            $(el).empty()

            if(settings.emptyItem){
                $(el).append('<option value = "">'+JQU.messages["select-an-item-message"]+'</option>')
            }

            $.each(settings.data, function(i, item) {

                var itemValue = "",itemLabel = ""

                if(isPatternActive){
                    itemValue = eval("item."+settings.pattern[0])
                    itemLabel = eval("item."+settings.pattern[1])
                } else {
                    itemValue = exl().pattern(settings.itemValuePattern).eval(item)
                    itemLabel = exl().pattern(settings.itemLabelPattern).eval(item)
                }

                $(el).append('<option value="'+itemValue+'">'+itemLabel+'</option>')
            });
        },
        /**
         * HTML Radio grubu hazirlamayi saglar
         * @param pattern [value,label]
         * @param data [{persAdi:Dilaver,persSoyadi:Demirel},{persAdi:Ercan,persSoyadi:Can}]
         * @param id element id
         * @param containerId element container id
         */
        loadRadioList : function(options){

            var settings = $.extend({
                pattern: [],
                data: [],
                id: "",
                required : false,
                name : "",
                containerId : "",
                orientation : "horizontal",
                style : "",
                styleClass : "",
                disabled :"",
                value : "",
                type : "radio",
                additional : "",
                onClick : "",
                itemValuePattern : "",
                itemLabelPattern :""
            }, options);


            var isPatternActive = false

            if(!JQU.isJSON(settings.pattern)) {
                pattern = JQU.parseJSON(settings.pattern)
            }

            if(!JQU.hasValue(settings.itemValuePattern)){
                isPatternActive = true
            }

            var checked = function(value){
                var status = ""
                if(JQU.hasValue(settings.value)) {
                    if(settings.type == "checkbox") {
                        $(settings.value).each(function (i, item) {
                            if (item == value) {
                                status = "checked"
                                return status
                            }
                        })
                    } else {
                        if (settings.value == value) {
                            status = "checked"
                            return status
                        }
                    }
                }
                return status
            }

            var el = JQU.EL(settings.id+"ItemContainer",settings.containerId)
            $(el).empty()

            var itemSize = 0
            $.each(settings.data, function(i, item) {

                var itemValue = "",itemLabel = ""

                if(isPatternActive){
                    itemValue = eval("item."+settings.pattern[0])
                    itemLabel = eval("item."+settings.pattern[1])
                } else {
                    itemValue = exl().pattern(settings.itemValuePattern).eval(item)
                    itemLabel = exl().pattern(settings.itemLabelPattern).eval(item)
                }


                $(el).append('<label>')
                $(el).append('<input type = "'+settings.type+'" ' +
                    '                 name = "'+settings.name+'" ' +
                    '                 id = "'+settings.id+i+'"' +
                    '                 value="'+itemValue+'"' +
                    '                 class = "'+settings.styleClass+' jqu'+settings.type+'"' +
                    '                 style = "'+settings.style+'"' +
                    '                 onClick = "'+settings.onClick+'"' +
                    '                 item-size = "'+settings.data.length+'"' +
                                      +" "+ settings.additional +" "+
                    '                 '+(settings.disabled ? ' disabled ' : '')+'' +
                    '                 '+' '+checked(itemValue)+' />'+itemLabel)

                if(settings.orientation == "horizontal"){
                    $(el).append("&nbsp;&nbsp;")
                } else {
                    $(el).append("<br/>")
                }
                $(el).append('</label>')
                itemSize++
            });

            if(itemSize > 0){
                $(el).attr("item-size",itemSize)
            }
            $(el).attr("field-required",settings.required)
        },
        /**
         * Gonderilen degiskene deger atanip atanmadigini kontrol
         * etmeyi saglar.
         * @param svar
         * @returns {boolean}
         */
        hasValue : function(svar){
            if(svar != undefined && svar != "" && svar != null && svar != "undefined"){
                return true
            } else {
                return false
            }
        },
        /**
         * belirtilen options degerleri ile senkron jquery ajax
         * islemi yaparak gelen datayi return eder
         * @param options
         * @returns {Array}
         */
        loadData : function(options){
            var settings = $.extend({
                dataUrl: "",
                dataType: "json",
                method: "POST",
                parameters: {},
                showResponseMessage : false
            }, options);

            var loadedData = []

            var ajaxOptions = {
                url: settings.dataUrl,
                type: settings.method,
                async : false,
                success: function (data, textStatus, xhr) {
                    loadedData = data
                    if(settings.showResponseMessage) {
                        JQU.showMessage(JQU.messageType.SUCCESS, data.message)
                    }
                },
                error: function (request, status, error) {
                    try {
                        if (settings.showResponseMessage) {
                            var data = JQU.parseJSON(request.responseText)
                            JQU.showMessage(JQU.messageType.ERROR, data.message)
                            loadedData = "[AJAX_ERROR]"
                        }
                    }catch(err){
                        JQU.showMessage(JQU.messageType.ERROR,"JQU.loadData | responseText :"+request.responseText+" - status:"+status+" - error:"+error)
                    }
                }
            };

            if(settings.dataType == 'json'){
                ajaxOptions['dataType'] = 'json'
                ajaxOptions['data'] = JSON.stringify(settings.parameters)
                ajaxOptions['contentType'] = 'application/json'
            }
            else {
                ajaxOptions['data'] = settings.parameters;
            }

            $.ajax( ajaxOptions );
            return loadedData
        },
        /**
         * dynamic parametereler ile array olusturmayi saglar
         * Orn : JQU.array("type","GENDER")
         * @returns {Array}
         */
        array : function(){
            var arr = []
            for (var i = 0; i < arguments.length; i++) {
                arr.push(arguments[i]);
            }

            return arr
        },
        /**
         * dynamic parametereler ile json olusturmayi saglar
         * Orn : JQU.json("type","GENDER")
         * type,GENDER > {type:GENDER}
         * @returns {*}
         */
        json : function(){
            var prepareJson = function(key,value){
                return "{\""+key+"\":\""+value+"\"}"
            }
            var json = ""
            for (var i = 0; i < arguments.length; i = i + 2) {
                if(json == ""){
                    json = prepareJson(arguments[i],arguments[i+1])
                } else {
                    json += ","+prepareJson(arguments[i],arguments[i+1])
                }
            }
            return $.parseJSON(json)
        },
        /**
         * formId'si belirtilen formu resetlemyi saglar
         * @param formId
         */
        resetForm : function(formId){
            $("#"+formId).trigger('reset');
            /*$(".jquDatePicker","#"+formId).datepicker("setDate",new Date())
            $(".jquDatePicker","#"+formId).datepicker("setDate",null)
            $(".jquColorPicker","#"+formId).spectrum("set","#fff")*/
            $("#"+formId).find("input[type=hidden]").each(function () {
                $(this).val("")
            });
        },
        /**
         * date.js ile kullanilmaktadir
         * @param date
         * @param format
         * @returns {*}
         */
        formatDate : function(date,format){
            return new Date(date).format(format)
        }
        ,
        /**
         * Belirtilen conditionu evaluate etmeyi saglar.
         * @param clause
         * @param statement1
         * @param statement2
         * @returns {*}
         */
        condition : function(clause,statement1,statement2){
            var clause = eval(clause)
            if (clause) {
                return statement1
            } else {
                return statement2
            }
        },
        /**
         * uygulamanin context path ile url'ini saglar
         * @returns {*}
         */
        baseUrl : function(){
            if (!location.origin) {
                location.origin = location.protocol + "//" + location.host;
            }
            return location.origin+imodTagLibContextRoot
        },

        /**
         * Json olarak girilmiş parametreleri url ile concate yapıp yönlendirmeyi yapar.
         * @param url
         * @param params
         */
        redirect : function(url,params){
            var urlBuilder = JQU.baseUrl().concat(url,"?",$.param(params));
            window.location.href = urlBuilder;
        },
        /**
         * Array olarak girilen parametreleri ve urli rest olarak redirect eder.
         * @param url
         * @param params
         */
        redirectRest : function (url,params){
            var urlBuilder = JQU.baseUrl().concat(url);

            $(params).each(function(i,item){
                    urlBuilder = urlBuilder.concat("/",item);
                }
            )

            window.location.href=urlBuilder;
        },
        /**
         * Parametre olarak gonderilen array icerisindeki
         * elemanlari silmeyi saglar.
         * @param array
         */
        clearArray : function(array){
            array.splice(0,array.length)
        }
        ,
        /**
         * String olarak gelen icerigi bir fonksiyonun body'si
         * olarak degerlendirip calistirmayi saglar.
         * @param js
         * @returns {Function}
         * @constructor
         */
        JavaScript : function(js){
            var fnc = new Function(js);
            return fnc
        },
        /**
         * Modal dialoglarin z-index degerini yonetmek
         * icin openDialog metodunda kullanilir.
         */
        dialogZIndex : 9000,
        getScriptFormId : function(id){
            var scrt = JQU.EL(id)
            return $(scrt).closest("form").attr("id")
        },
        /**
         * 4 farklı tipte JSON data toplamayi saglar
         * requestParameters : static json data
         * requestParameterElements : DOM elementleri listsi Orn : "input1","input2"
         * requestParametersFormId : Form ID
         * requestParametersDataFunction : JS Fonskiyosunu
         * @param settings
         * @returns {*}
         */
        prepareData : function(settings){
            var options = {
                dataType : "array",
                requestParameters : undefined,
                requestParameterElements : [[]],
                requestParametersFormId : "",
                requestParametersDataFunction : function(){}
            }

            options = $.extend({},options, settings);
            /*
             1- requestParameters [sample ; [{"cinsiyet":"KADIN"}]]
             2- requestParametersDataFunction [sample ; function(){return JQU.prepareBasicJSONArrayFromDOM(["persAdi","gecerli","cinsiyet"],"searchForm")}]
             3- requestParameterElements [sample ; ["cinsiyet"]]
             4- requestParametersFormId [sample ; searchForm]
             */

            //1
            var parameters = options.requestParameters

            if(!JQU.hasValue(options.requestParameters)) {
                //2
                parameters = options.requestParametersDataFunction()

                //3
                if (parameters == undefined) {
                    if (JQU.hasValue(options.requestParameterElements) && options.requestParameterElements.length > 0) {
                        parameters = JQU.prepareJSONFromDOM({"elements":options.requestParameterElements,"jsonType" : options.dataType.toUpperCase()})
                    }
                }

                //4
                if (parameters == undefined) {
                    if (JQU.hasValue(options.requestParametersFormId)) {
                        parameters = JQU.EL(options.requestParametersFormId).serializeFormToJSON(options.dataType)
                    }
                }

                //default
                if (parameters == undefined) {
                    parameters = {}
                }

            }

            if(options.dataType.indexOf("array") != -1) {
                //{ "name": "more_data", "value": "my_value" }
                var exJson = ""
                var prepareExJson = function (key, value) {
                    return '{"name":"' + key + '","value":"' + value + '"}'
                }

                $.each(parameters, function (i, item) {
                    for (var key in item) {
                        var value = item[key]
                        if (exJson == "") {
                            exJson = prepareExJson(key, value)
                        } else {
                            exJson += "," + prepareExJson(key, value)
                        }
                    }
                })

                exJson = "[" + exJson + "]"

                return JQU.parseJSON(exJson)
            } else {
                return parameters
            }
        },
        contextMap : [],
        formatMessage : function(messageCode){
            var message = JQU.messages[messageCode]
            for (var i = 1; i < arguments.length; i = i + 1) {
                message = message.replace("#"+i+"#",arguments[i])
            }
            return message
        },
        dsl : function(){
            return new jqudsl()
        },
        exl : function(){
            return new jquexl()
        },
        context : function(){
            return new jqucontext()
        },
        /**
         * Dom elementin icinde bulundugu formun id bilgisini bulmayi saglar.
         * @param el dom Eelement
         * @returns {*}
         */
        getElementFormId : function(el){
            return $(el).closest("form").attr("id")
        },
        /**
         * parametre olarak gonderilen 2 arrayi concat etmeyi saglar
         * @param first
         * @param second
         * @returns {*}
         */
        concatArray : function(first,second){
            if(JQU.hasValue(second)){
                if(JQU.hasValue(first)){
                    first = first.concat(second)
                } else{
                    first = second
                }
            }
            return first
        },
        unescapeHtml : function(input){
            var e = document.createElement('div');
            e.innerHTML = input;
            return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
        },
        convertToUtc : function(date){
            try {
                return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
            }catch(err){
                return new Date(date)
            }
        },
        setElementValidationMessage : function(el,message){
            el.setCustomValidity(message)
        }
    };

    //expose globally
    window.JQU = JQU;

})(window);