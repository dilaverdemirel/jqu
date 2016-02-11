/**
 * @author dilaverdemirel
 * @license MIT dilaverdemirel <https://github.com/dilaverdemirel>
 
 * version 1.0.0
 */
 
(function($){
    if(!$.jqutilities){
        $.jqutilities = new Object();
    };

    $.jqutilities.jquFormSerializer = function(el, type){
        var base = this;

        base.jqel = $(el);
        base.el = el;

        base.jqel.data("jqutilities.jquFormSerializer", base);

        base.init = function(){
            if( typeof( type ) === "undefined" || type === null ) type = "single";
            base.type = type;

            var o = {};
            var a = base.el.serializeArray();

            if(base.type == "array" || base.type == "text"){
                var exJson = "",text = ""
                var prepareExJson = function(key,value){
                    return '{"'+key+'":"'+value+'"}'
                }

                var prepareText = function(key,value){
                    return key+'='+value
                }

                $.each(a,function(i,item){
                    if (exJson == "") {
                        exJson = prepareExJson(item.name, item.value)
                        text = prepareText(item.name, item.value)
                    } else {
                        exJson += "," + prepareExJson(item.name, item.value)
                        text += "&"+prepareText(item.name, item.value)
                    }
                })

                if(base.type == "array") {
                    return JQU.parseJSON("[" + exJson + "]")
                } else {
                    return text;
                }
            }

            var formId = $(base.el).attr("id")
            $.each(a, function () {
                var elementType = $("#"+formId).find("[name='"+this.name+"']",this).attr("type")
                var datePicker = $("#"+formId).find("[name='"+this.name+"']",this).hasClass("sisDatePicker")
                var pickList = $("#"+formId).find("[name='"+this.name+"']",this).hasClass("sisPicklist")
                var checkbox = $("#"+formId).find("[name='"+this.name+"']",this).hasClass("sischeckbox")
                var radio = $("#"+formId).find("[name='"+this.name+"']",this).hasClass("sisradio")
                var checkboxRadioItemSize = $("#"+formId).find("[name='"+this.name+"']",this).attr("item-size")
                var datePickerDateFormat = $("#"+formId).find("[name='"+this.name+"']",this).attr("data-date-format")

                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }

                    if(elementType == "time"){
                        o[this.name].push(Date.parseString(this.value,'H:m'));
                    } else if(elementType == "month"){
                        o[this.name].push(Date.parseString(this.value,'yyyy-mm'));
                    }else if(datePicker){
                        o[this.name].push(Date.parseString(this.value,datePickerDateFormat));
                    }else if(pickList){
                        o[this.name].push(this.value);
                    }else if(checkbox || radio) {
                        o[this.name].push(this.value);
                    }else {
                        if(this.name.indexOf(".") != -1){
                            var path = this.name.split(".")
                            var temp = "{\""+path[1]+"\" : \""+this.value+"\" }"
                            o[path[0]].push(JQU.parseJSON(temp))
                        } else {
                            o[this.name].push(this.value || '');
                        }
                    }
                } else {
                    if(elementType == "time"){
                        o = base.prepareValue(o,this.name,Date.parseString(this.value,'H:m'))
                    } else if(elementType == "month"){
                        o = base.prepareValue(o,this.name,Date.parseString(this.value,'yyyy-mm'))
                    }else if(datePicker){
                        o = base.prepareValue(o,this.name,Date.parseString(this.value,datePickerDateFormat))
                    }else if(pickList){
                        if(JQU.hasValue(this.value)) {
                            o = base.prepareValue(o,this.name,[this.value])
                        }
                    }else if(checkbox || radio){
                        if(JQU.hasValue(this.value)) {
                            if(checkboxRadioItemSize > 1) {
                                o = base.prepareValue(o,this.name,JQU.array(this.value))
                            } else {
                                o = base.prepareValue(o,this.name,this.value)
                            }
                        }
                    } else {
                        o = base.prepareValue(o,this.name,this.value || '')
                    }
                }
            });
            return o;
        };

        base.prepareValue = function(mainObject,name,value){
            if(name.indexOf(".") != -1){
                var path = name.split(".")
                if(JQU.hasValue(mainObject[path[0]]) == true) {
                    var obj = mainObject[path[0]]
                    obj[path[1]] =  value
                } else {
                    var temp = "{\"" + path[1] + "\" : \"" + value + "\" }"
                    mainObject[path[0]] = (JQU.parseJSON(temp))
                }
            } else {
                mainObject[name] = value;
            }

            return mainObject
        }
    };

    $.fn.serializeFormToJSON = function(type){
        return (new $.jqutilities.jquFormSerializer(this, type)).init();
    };

})(jQuery);