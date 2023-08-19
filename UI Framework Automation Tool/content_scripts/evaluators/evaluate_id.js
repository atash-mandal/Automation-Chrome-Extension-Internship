function eval_id(id_data){
    // data = data.replace('/', ' ') 
    // console.log(id_data)
    var element=document
    if(id_data[0]==="*"){
        element = top.frames[0].document
        id_data = id_data.substr(1,id_data.length-1)
    }
    if(id_data.slice(0,7)==="{block}"){
        element = top.frames[0].document.querySelector('navigation-plugin-block').shadowRoot
        id_data = id_data.slice(7,id_data.length)
    }
    if(id_data.slice(0,5)==="{dom}"){
        element = top.frames[0].document.querySelector('navigation-plugin-dom').shadowRoot
        id_data = id_data.slice(5,id_data.length)
    }
    id_data = id_data.slice(1,id_data.length)
    var x = id_data.length
    for(var i=0;i<x;i++){
        var id=""
        var idx="0"
        while(id_data[i] !== '/' && i < x){
            if(id_data[i]==='['){
                i++;
                while(id_data[i]!==']'){
                    idx+=id_data[i]
                    i++;
                }
                idx=Number(idx)
            }else{
                id+=id_data[i]
            }
            i++
        }
        // console.log("element--->",element)
        // console.log("id---->",id)
        // console.log("idx--->",idx)
        // element = element.querySelectorAll(`[data-test-id="${id}"]`)[idx]
        if(id===""){
            // console.log(element)
            if(element!==document && element.children[idx].tagName === "svg"){
                return element
            }
            element = element.children[idx]
        }else{
            // console.log(element)
            if(element!==document && element.querySelectorAll(`[id="${id}"]`)[0].tagName === "svg"){
                return element
            }
            element = element.querySelectorAll(`[id="${id}"]`)[0] 
        }
    }
    return element
}
  