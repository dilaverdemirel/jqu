/**
 * @author dilaverdemirel
 * @license MIT dilaverdemirel <https://github.com/dilaverdemirel>
 
 * version 1.0.0
 
 * JSON datayi 3 farkli tipteki expressionlar ile belirtilen patterne data set etmeyi saglar.
 *
 * Ornek JSON Data : {ad:Dilaver,soyad:Demirel,dogumTarih:01/01/1984}
 * Tipler;
 *  1-Standart : Belirli bir patterni degistirmeyi saglar
 *      Ornek ;
 *          Pattern : Merhaba [[ad]] [[soyad]]
 *          Sonuc : Merhaba Dilaver Demirel
 *  2-DOM : Dom elementlerine deger atamayi saglar
 *      Ornek ;
 *          Pattern : [[form1.ad=ad]][[form1.soyad=soyad]]
 *  3-JavaScript : Pattern içerisindeki expressionlari JS olarak calistirmayi saglar
 *      Ornek ;
 *          Pattern : Kullanici [[ad]] [[soyad]]'in dogum tarihi [JS[JQU.formatDate('[[dogumTarih]]','dd/MM/yyyy')]JS]'dir
 *          Sonuc : Kullanici Dilaver Demirel'in dogum tarihi 01/01/1984'tür.
 *
 */
jquexl = function () {
    var base = this;

    base.JQU_FIELD_EXPRESSION_1 =  /\[\[(\w+)\]\]/g
    base.JQU_FIELD_EXPRESSION_2 =  /\[\[(\w+)+(\.)+(\w+)\]\]/g
    base.JQU_DOM_FIELD_EXPRESSION_1 = /\[\[(\w+)+(\=)+(\w+)\]\]/g
    base.JQU_DOM_FIELD_EXPRESSION_2 = /\[\[(\w+)+(\.)+(\w+)+(\=)+(\w+)\]\]/g
    base.JQU_JS_FIELD_EXPRESSION_1 = /(\[JS\[((.)*?)\]JS\])/g
    base.JQU_JS_FIELD_EXPRESSION_2 = /(\[js\[((.)*?)\]js\])/g

    base.standart = new Object()
    base.standart.fields = []

    base.dom = new Object()
    base.dom.fields = []

    base.js = new Object()
    base.js.patterns = []
    base.js.fields = []
    base.patternValue = ""
    base.data = {}

    base.pattern = function(pattern){
        base.patternValue = pattern
        return this
    }

    /**
     * JQU expressionlari temizlemeyi saglar
     * @param data
     * @returns {string}
     */
    base.clearExpressions = function(data){
        data = data.replace(/\[/g, "")
        data = data.replace(/\]/g, "")
        return data
    }

    /**
     * JQU JS expressionlari temizlemeyi saglar
     * @param data
     * @returns {string}
     */
    base.clearJSExpressions = function(data){
        data = data.toString().replace(/\[JS\[/g, "")
        data = data.toString().replace(/\]JS\]/g, "")
        data = data.toString().replace(/\[js\[/g, "")
        data = data.toString().replace(/\]js\]/g, "")
        return data
    }

    /**
     * JQU DOM expressionlari temizlemeyi saglar
     */
    base.clearDomExpressions = function(){
        if(JQU.hasValue(base.dom.fields)) {
            for (var i = 0; i < base.dom.fields.length; i++) {
                base.patternValue = base.patternValue.replace(base.dom.fields[i], "")
            }
        }
        return this
    }

    /**
     * Standart field expression parse etmeyi saglar,
     * @param pattern "[[field1]] test [[field2]]"
     */
    base.standart.parse = function(){
        base.standart.fields = base.patternValue.match(base.JQU_FIELD_EXPRESSION_1)
        var temp = base.patternValue.match(base.JQU_FIELD_EXPRESSION_2)
        base.standart.fields = JQU.concatArray(base.standart.fields,temp)

        return this
    }

    /**
     * DOM elementleri icin field expression parse etmeyi saglar,
     * @param pattern "[[lovOrgCode=orgCode]],[[lovOrgName=orgName]],[[lovOrgValid=valid]]"
     */
    base.dom.parse = function(){
        base.dom.fields = base.patternValue.match(base.JQU_DOM_FIELD_EXPRESSION_1)
        var fields = base.patternValue.match(base.JQU_DOM_FIELD_EXPRESSION_2)

        if(fields != null){
            if(JQU.hasValue(base.dom.fields)) {
                for (var i = 0; i < fields.length; i++) {
                    base.dom.fields.push(fields[i])
                }
            } else {
                base.dom.fields = fields
            }
        }

        base.clearDomExpressions()

        return this
    }

    /**
     * JavaScript patternleri icin field expression parse etmeyi saglar,
     * @param pattern "[JS[JQU.formatDate('[[dogumTarih]]','dd/MM/yyyy')]JS]"
     */
    base.js.parse = function(){
        base.js.patterns = base.patternValue.match(base.JQU_JS_FIELD_EXPRESSION_1)
        var temp = base.patternValue.match(base.JQU_JS_FIELD_EXPRESSION_2)
        base.js.patterns = JQU.concatArray(base.js.patterns,temp)

        if(JQU.hasValue(base.js.patterns)) {
            for (var i = 0; i < base.js.patterns.length; i++) {
                var fields = base.js.patterns[i].match(base.JQU_FIELD_EXPRESSION_1)
                if(fields != null) {
                    for (var j = 0; j < fields.length; j++) {
                        base.js.fields.push(fields[j])
                    }
                }
            }
        }

        return this
    }

    /**
     * Standart expressionlari evaluate etmeyi saglar
     * @param pattern "[[field1]] test [[field2]]"
     * @param data "{field1:value1,field2:value2}"
     * @returns "value1 test value2"
     */
    base.standart.eval = function (pfields,ppattern) {
        var fields = []
        var pattern = ""

        if(!JQU.hasValue(pfields)) {
            fields = base.standart.fields
            pattern = base.patternValue
        } else {
            fields = pfields
            pattern = ppattern
        }

        if (fields != null) {
            for (var i = 0; i < fields.length; i++) {
                var fieldName = ""
                if (fields[i] == null) {
                    continue
                }

                fieldName = base.clearExpressions(fields[i])
                var temp = fieldName

                pattern = pattern.replace("[[" + temp + "]]", function (_, text) {
                    var value = eval("base.data." + fieldName)
                    return value;
                });
            }
        }

        if(JQU.hasValue(pfields)) {
            return pattern
        } else {
            base.patternValue = pattern
            return this
        }
    }

    /**
     * DOM expressionlari evaluate etmeyi saglar
     * JSON datayi asagidaki pattern ile belirtilen dom elementlerine set eder
     * @param data {orgCode:JQUTILITIES,orgName:JQUTILITIES A.s.,valid:Y}
     * @param pattern [[lovOrgCode=orgCode]],[[lovOrgName=orgName]],[[lovOrgValid=valid]]
     */
    base.dom.eval = function () {
        var data = base.data
        var fields = base.dom.fields
        if (fields != null) {
            for (var i = 0; i < fields.length; i++) {
                var field = ""
                if (fields[i] == null) {
                    continue
                }
                field = base.clearExpressions(fields[i])
                var fieldInfo = field.split("=")

                if(fieldInfo[0].indexOf(".") != -1){
                    var elements = fieldInfo[0].split(".")
                    $("#"+elements[1],"#"+elements[0]).val(eval("data."+fieldInfo[1]))
                } else {
                    $("#"+fieldInfo[0]).val(eval("base.data."+fieldInfo[1]))
                }
            }
        }
    }

    /**
     * JS expressionlari evaluate etmeyi saglar
     * @param pattern "[JS[alert("[[field2]]")]]"
     * @param data "{field1:value1,field2:value2}"
     * @returns "value1 test value2"
     */
    base.js.eval = function () {
        if (JQU.hasValue(base.js.patterns)) {
            for (var i = 0; i < base.js.patterns.length; i++) {
                var temp = base.js.patterns[i]
                base.js.patterns[i] = base.clearJSExpressions(base.js.patterns[i])
                var value
                if(JQU.hasValue(base.js.fields)) {
                    value = eval(base.standart.eval(base.js.fields, base.js.patterns[i]))
                } else {
                    value = eval(base.js.patterns[i])
                }
                base.patternValue = base.patternValue.replace(temp,value);
            }
        }
        return this
    }

    base.eval = function(data){
        base.data = data
        base.dom.parse()
        base.dom.eval()
        base.js.parse()
        base.js.eval()
        base.standart.parse()
        base.standart.eval()

        return base.patternValue
    }
};

exl = function () {
    return new jquexl()
};