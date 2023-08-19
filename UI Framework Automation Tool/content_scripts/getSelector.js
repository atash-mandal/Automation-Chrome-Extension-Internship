async function selector(element, context, addon){
    var data=""
    try{
        try {
            data = getSelector1(element, context)
        } catch (err) {
            data = getSelector2(element, context)
        }
    }catch(err){
        try {
            data = "#" + idSelector(element, context)
        } catch (err) {
            data = "." + classSelector(element, context)
        }
    }
    if(addon === "iframe"){
        data = "*" + data
    }
    if(addon === "block"){  
        data = "{block}" + data
    }
    if(addon === "dom"){
        data = "{dom}" + data
    }
    var xpath = getXPathForElement(element)
    data = data + "||" + xpath
    return data
}