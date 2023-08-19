function idSelector(elt,context){
    var element = elt
    // console.log("before  element-->",element)
    while(element.tagName==="path" || element.tagName==="svg"){
        element = element.parentNode
    }
    var temp = element
    while(temp!==null && temp.tagName!=="BODY"){
        if(temp.tagName==="BUTTON"){
            element = temp
            break
        }
        temp = temp.parentNode
    }
    // console.log("after  ",element)
    var selector=""
    while(element!==null)
    {
        // console.log(element)
        if(element.hasAttribute("id")){
            var elmid = element.getAttribute("id")
            if(context.querySelectorAll(`[id="${elmid}"]`).length <= 1){
                selector = elmid + "/" + selector
                element = null
            
            }else{
                var idx = getElementIdx(element)
                selector = `[${idx}]` + "/" + selector
                element = element.parentNode
            }
        
        }else{
            var idx = getElementIdx(element)
            selector = `[${idx}]` + "/" + selector
            element=element.parentNode
        }
    // console.log(selector)
    }
    selector=selector.slice(0,selector.length-1)
    console.log(selector)
    return selector
}