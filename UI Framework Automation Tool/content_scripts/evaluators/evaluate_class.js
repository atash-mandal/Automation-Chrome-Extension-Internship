function eval_class(class_data){
    class_data = class_data.replaceAll('/', ' ') 
    console.log(class_data)
    var element=document
    if(class_data[0]==="*"){
        element=top.frames[0].document
        class_data=class_data.slice(1,class_data.length)
    }
    if(class_data.slice(0,7)==="{block}"){
        element = top.frames[0].document.querySelector('navigation-plugin-block').shadowRoot
        class_data = class_data.slice(7,class_data.length)
    }
    if(class_data.slice(0,5)==="{dom}"){
        element = top.frames[0].document.querySelector('navigation-plugin-dom').shadowRoot
        class_data = class_data.slice(5,data.length)
    }
    // class_data = class_data.slice(1,class_data.length)
    var x = class_data.length
        for(var i=1;i<x;i++){
        var id=""
        var idx="0"
        while(class_data[i] !== '.' && i < x){
            if(class_data[i]==='['){
                i++;
                while(class_data[i]!==']'){
                    idx+=class_data[i]
                    i++;
                }
                idx=Number(idx)
            }else{
                id+=class_data[i]
            }
            i++
        }
        console.log("element--->",element)
        console.log("id---->",id)
        console.log("idx--->",idx)
        // element = element.querySelectorAll(`[data-test-id="${id}"]`)[idx]
        if(id===""){
            console.log(element)
            element = element.children[idx]
        }else{
            console.log(element)
            element = element.getElementsByClassName(`${id}`)[0]
        }
    }
    return element
}
