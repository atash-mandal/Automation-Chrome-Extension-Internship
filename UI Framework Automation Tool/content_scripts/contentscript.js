var mainTab=""
var rec=""
window.onload=async function(){
    var iframe = false
    var block_1 = false
    var block_2 = false
    var block_3 = false
    var dom_1 = false
    var dom_2 = false
    var dom_3 = false
    await chrome.runtime.sendMessage({msg: "Main content"})

    var intervals = setInterval(async () => {
        var context
        iframe = false
        try {
            if(iframe===false && top.frames.length > 0){
                context = top.frames[0].document
                await frameEvents(context,"iframe")
                iframe = true
            }
        } catch (error) {
            console.log(error)
        }        
        if(top.frames.length === 0){
            iframe = false
            block_1 = false
            block_2 = false
            block_3 = false
            dom_1 = false
            dom_2 = false
            dom_3 = false
        }
        // block storage
        if(top.frames.length > 0 && iframe === true && top.frames[0].document.querySelector('navigation-plugin-block') === null){
            block_1 = false
            block_2 = false
            block_3 = false
        }
        
        if(block_1===false && iframe === true && top.frames.length > 0 && top.frames[0].document.querySelector('navigation-plugin-block') !== null && top.frames[0].document.querySelector('navigation-plugin-block').shadowRoot!==null){  
            context = top.frames[0].document.querySelector('navigation-plugin-block').shadowRoot
            await frameEvents(context,"block")
            block_1 = true
        }

        if(top.frames.length > 0 && iframe === true && top.frames[0].document.querySelector('navigation-plugin-block') !== null){
            if(block_2===false && top.frames[0].document.querySelector('navigation-plugin-block').shadowRoot.querySelector('[data-test-id="menu-drawer-block"]') !== null){ 
                context = top.frames[0].document.querySelector('navigation-plugin-block').shadowRoot.querySelector('[data-test-id="menu-drawer-block"]').shadowRoot
                await frameEvents(context,"block")
                block_2 = true
            }else{
                block_2 = false
            }
        }

        if(top.frames.length > 0 && iframe === true && top.frames[0].document.querySelector('navigation-plugin-block') !== null){
            if(block_3===false && top.frames[0].document.querySelector('navigation-plugin-block').shadowRoot.querySelector('[data-test-id="menu-list-block"]') !== null){
                context = top.frames[0].document.querySelector('navigation-plugin-block').shadowRoot.querySelector('[data-test-id="menu-list-block"]').shadowRoot
                await frameEvents(context,"block")
                block_3 = true
            }else{
                block_3 = false
            }
        }

        // dom 
        if(top.frames.length > 0 && iframe === true && top.frames[0].document.querySelector('navigation-plugin-dom') === null){
            dom_1 = false
            dom_2 = false
            dom_3 = false
        }
        if(dom_1===false && top.frames.length > 0 && iframe === true && top.frames[0].document.querySelector('navigation-plugin-dom') !== null && top.frames[0].document.querySelector('navigation-plugin-dom').shadowRoot!==null){    
            context = top.frames[0].document.querySelector('navigation-plugin-dom').shadowRoot
            await frameEvents(context,"dom")
            dom_1 = true
        }

        if(top.frames.length > 0 && iframe === true && top.frames[0].document.querySelector('navigation-plugin-dom') !== null){
            if(dom_2===false && top.frames[0].document.querySelector('navigation-plugin-dom').shadowRoot.querySelector('[data-test-id="menu-drawer-dom"]') !== null){ 
                context = top.frames[0].document.querySelector('navigation-plugin-dom').shadowRoot.querySelector('[data-test-id="menu-drawer-dom"]').shadowRoot
                await frameEvents(context,"dom")
                dom_2 = true
            }else{
                dom_2 = false
            }
        }

        if(top.frames.length > 0 && iframe === true && top.frames[0].document.querySelector('navigation-plugin-dom') !== null){
            if(dom_3===false && top.frames[0].document.querySelector('navigation-plugin-dom').shadowRoot.querySelector('[data-test-id="menu-list-dom"]') !== null){
                context = top.frames[0].document.querySelector('navigation-plugin-dom').shadowRoot.querySelector('[data-test-id="menu-list-dom"]').shadowRoot
                await frameEvents(context,"dom")
                dom_3 = true
            }else{
                dom_3 = false
            }
        }
    }, 1000);


    async function frameEvents(context, addon){
        context.addEventListener('click',async function(e){
            console.log(e.target)
            await event_click(e.target, context, addon)
        })
        context.addEventListener('keyup',async function(e){
            console.log(e.target) 
            await event_key(e.target, context, addon)
        })
    }


    // send msg
    // message listen
    chrome.runtime.onMessage.addListener(async (message,sender,response)=>{
        mainTab = message.mainTab
        console.log(message)
        rec=message.rec
       
        if(message.msg==="playing"){
            console.log(message)
            var command = message.command
            var data = message.target
            var value = message.value
            // var data = message.data

            var element = undefined
            if(data !== ""){
                var i = 0
                while(i < data.length && data[i] !== '|'){
                    i++
                }
                if(data[i]==='|'){
                    var xpath = data.slice(i+2,data.length)
                }
                var data = data.slice(0,i)
                var xpath_element = undefined
                if(data[0]==='*'){
                    data = data.slice(1,data.length)
                    if(data[0]==="."){
                        element = eval_class("*"+data)
                    }else if(data[0]==="#"){
                        element = eval_id("*"+data)
                    }else{
                        element = eval_data("*"+data)
                    }
                    try {
                        xpath_element = eval_xpath(xpath,top.frames[0].document)   
                    } catch (error) {
                        console.log(error)
                    }
                }else if(data.slice(0,7)==="{block}"){
                    data = data.slice(7,data.length)
                    if(data[0]==="."){
                        element = eval_class("{block}"+data)
                    }else if(data[0]==="#"){
                        element = eval_id("{block}"+data)
                    }else{
                        element = eval_data("{block}"+data)
                    }
                    try {
                        xpath_element = eval_xpath(xpath,top.frames[0].document.querySelector('navigation-plugin-block').shadowRoot)   
                    } catch (error) {
                        console.log(error)
                    }
                }else if(data.slice(0,5)==="{dom}"){
                    data = data.slice(5,data.length)
                    if(data[0]==="."){
                        element = eval_class("{dom}"+data)
                    }else if(data[0]==="#"){
                        element = eval_id("{dom}"+data)
                    }else{
                        element = eval_data("{dom}"+data)
                    }
                    try {
                        xpath_element = eval_xpath(xpath, top.frames[0].document.querySelector('navigation-plugin-dom').shadowRoot)   
                    } catch (error) {
                        console.log(error)
                    }
                }else{
                    if(data[0]==="."){
                        console.log("else--->",data)
                        element = eval_class(data)
                        console.log(element)
                    }else if(data[0]==="#"){
                        element = eval_id(data)
                    }else{
                        element = eval_data(data)
                    }
                    try {
                        xpath_element = eval_xpath(xpath, document)   
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
            if(element === undefined && xpath_element !== null && xpath_element!==undefined){
                element = xpath_element
                console.log("found with xpath")
            }
            
            if(element !== undefined && !element.disabled){
                console.log(message.target)
                console.log(element)
                if(command==="click"){
                    // console.log("type---->",element.textContent)
                    const y = element.getBoundingClientRect().top + window.scrollY;
                    window.scroll({
                    top: y*0.6,
                    behavior: 'smooth'
                    });
                    element.style.cssText+="border: 2px solid black;"
                    sleep(300).then(async () => { 
                        element.style.cssText=element.style.cssText.slice(0,element.style.cssText.length - 24)
                        element.click()
                        if(element.tagName === "INPUT"){
                            setTimeout(async () => {
                                element.value=""
                                // console.log("focused eleemnt",element)
                                element.focus()
                                element.value=""
                                await chrome.runtime.sendMessage({msg: "found"})
                            }, 200);
                        }else{
                            await chrome.runtime.sendMessage({msg: "found"})
                        }
                    })
                }
                if(command==="type"){
                    const y = element.getBoundingClientRect().top + window.scrollY;
                    window.scroll({
                    top: y*0.6,
                    behavior: 'smooth'
                    });
                    setTimeout(async () => {
                        element.value=""
                        // console.log("focused eleemnt",element)
                        element.focus()
                        element.value=""
                        await chrome.runtime.sendMessage({msg: "text"})
                    }, 200);
                }
            }
            data = ""
        }
    });

    window.addEventListener("resize", async function(e){
        var w = document.documentElement.clientWidth;
        var h = document.documentElement.clientHeight;
        await chrome.runtime.sendMessage({msg: "data",command: "Set&nbsp;window&nbsp;size",target: "",value: `w:&nbsp;${w}&nbsp;h:&nbsp;${h}`})
    });


    document.addEventListener('click',async function(e) {
        console.log(e.target) 
        await event_click(e.target, document)
    }, true);


    document.addEventListener('keyup',async function(e) {
        console.log(e.target) 
        console.log(e.target.value)
        await event_key(e.target, document)
    }, true);


    async function event_click(element, context, addon){
        var data=await selector(element,context,addon)
        console.log("data--->",data)
        await chrome.runtime.sendMessage({msg: "data",command: "click",target: data,value: ""})
    }

    async function event_key(element, context, addon){
        var data= await selector(element,context,addon)
        console.log(data)
        await chrome.runtime.sendMessage({msg: "data",command: "type",target: data,value: element.value}) 
    }


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
