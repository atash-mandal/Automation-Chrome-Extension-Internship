function getSelector1(elt,context){
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
        if(element.hasAttribute("data-testid")){
            var elmid = element.getAttribute("data-testid")
            if(context.querySelectorAll(`[data-testid="${elmid}"]`).length <= 1){
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
    // selector = selector.trim()
    // if(context!==document){
    //   selector = "*"+selector
    // }
    // selector = selector.replace(/\s/g, '/') 
    console.log(selector)
    
    return selector
  }
  
function getSelector2(elt,context){
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
        if(element.hasAttribute("data-test-id")){
            var elmid = element.getAttribute("data-test-id")
            // console.log(context.querySelectorAll(`[data-test-id="${elmid}"]`).length)
            if(context.querySelectorAll(`[data-test-id="${elmid}"]`).length <= 1){
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
    // selector = selector.trim()
    // if(context !== document){
    //   selector = "*"+selector
    // }
    console.log(selector)
    return selector
}


