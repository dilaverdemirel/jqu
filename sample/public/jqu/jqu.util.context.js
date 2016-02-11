/**
 * @author dilaverdemirel
 * @license MIT dilaverdemirel <https://github.com/dilaverdemirel>
 
 * version 1.0.0
 */
 
jqucontext = function (data) {
    var base = this;

    base.activeContext = "default"

    base.context = function (context) {
        base.activeContext = context
        return this
    }

    base.find = function(key){
        var retItem = null
        $.each(JQU.contextMap,function(i,item){
            if(item.context.indexOf(base.activeContext) != -1 && item.key.indexOf(key) != -1){
                retItem = item
            }
        })

        return retItem
    }

    base.get = function(key){
        var item = base.find(key)
        if(JQU.hasValue(item)){
           return item.value
        } else {
            return {}
        }
    }

    base.put = function (key,data) {
        var item = base.find(key)

        if(!JQU.hasValue(item)){
            JQU.contextMap.push({
                context : base.activeContext,
                key : key,
                value : data
            })
        } else {
            item.value = data
        }
        return this
    }
};

context = function () {
    return new jqucontext()
};