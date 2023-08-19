function eval_data(data){
    // data = data.replace('/', ' ') 
    // console.log(data)
    var element=document
    if(data[0]==="*"){
        element=top.frames[0].document
        data=data.substr(1,data.length-1)
    }
    if(data.slice(0,7)==="{block}"){
        element = top.frames[0].document.querySelector('navigation-plugin-block').shadowRoot
        data = data.slice(7,data.length)
    }
    if(data.slice(0,5)==="{dom}"){
        element = top.frames[0].document.querySelector('navigation-plugin-dom').shadowRoot
        data = data.slice(5,data.length)
    }
    var x = data.length
    for(var i=0;i<x;i++){
        var id=""
        var idx="0"
        while(data[i] !== '/' && i < x){
            if(data[i]==='['){
                i++;
                while(data[i]!==']'){
                    idx+=data[i]
                    i++;
                }
                idx=Number(idx)
            }else{
                id+=data[i]
            }
            i++
        }
        // console.log("element--->",element)
        // console.log("id---->",id)
        // console.log("idx--->",idx)
        // element = element.querySelectorAll(`[data-test-id="${id}"]`)[idx]
        if(id===""){
            // console.log(element)
            if(element!==document && (element.children[idx].tagName === "svg" || element.children[idx]===undefined)){
                return element
            }
            element = element.children[idx]
        }else{
            // console.log(element)
            if(element!==document && (element.querySelectorAll(`[data-testid="${id}"]`)[0] || element.querySelectorAll(`[data-test-id="${id}"]`)[0]).tagName === "svg"){
                return element
            }
            element = (element.querySelectorAll(`[data-testid="${id}"]`)[0] || element.querySelectorAll(`[data-test-id="${id}"]`)[0])
        }
    }
    return element
}
  