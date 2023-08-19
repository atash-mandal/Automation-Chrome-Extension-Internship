import { getOptions } from "./background_input.js"
// init vars
var mainTab=""
var mainWin=""
var contentTab=""
var contentWin=""
var runTab=""
var rec=""
// running vars
var run=""
var command=""
var target=""
var value=""
var inc=0
var play=0
var myinterval=""
var mytimeout=""
// speed vars
var speed=1
// pause vars
var pause="resume"

var abort = false
var aborttimeout="" 

var data_time=""

// message
chrome.runtime.onMessage.addListener(async (message,sender,response)=>{
    console.log(message)
    // console.log(sender)
    if(message.msg==="Main.js"){
        clearInterval(myinterval)
        mainTab=sender.tab.id
        mainWin=sender.tab.windowId
        var tabs = await chrome.tabs.query({active: true, currentWindow: false})
        var url = tabs[tabs.length-1].url;
        await chrome.tabs.sendMessage(mainTab,{msg: "url",url: url})
    }
    if(message.msg === "Start Recording!"){
        rec="start"
        if(contentTab !== ""){
            await chrome.windows.update(contentWin,{'focused': true});
        }
    }
    if(message.msg === "Stop Recording!"){
        rec="stop"  
    }
    if(message.msg === "Main content" && rec === "start"){
        if(inc===0){
            contentTab=sender.tab
            contentWin=sender.tab.windowId
        }
        inc=inc+1
        // console.log("contentTab   ",contentTab.id)
        // console.log("sender       ",sender.tab.id)
    }
    if(rec==="start" && message.msg === "data" && sender.tab.id === contentTab.id){  
        if(message.target === "*#root/[0]/[0]/[0]/[0]||/html[1]/body[1]/div[1]/div[1]/div[1]/div[1]/navigation-plugin-block[1]" ||
            message.target === "*#root/[0]/[0]/[0]/[0]||/html[1]/body[1]/div[1]/div[1]/div[1]/div[1]/navigation-plugin-dom[1]"){
            return
        } 
        clearTimeout(data_time) 
        data_time = setTimeout(async () => {
            await chrome.tabs.sendMessage(mainTab,{msg: "verified data",command: message.command,target: message.target,value: message.value}) 
        }, 200);
        return
    }
    if(message.msg === "Pause Running"){
        pause = "pause"
    }
    if(message.msg === "Resume Running"){
        pause = "resume"
        await chrome.windows.update(runTab.windowId, {focused: true}) 
    }
    if(message.msg === "runWin"){
        run_init()
        run="run"
        speed=Number(message.speed)
        return
    }
    if(run==="run" && message.msg === "Main content" && play === 0){
        runTab=sender.tab
        console.log("run init--->",runTab.id)
        await chrome.tabs.sendMessage(mainTab,{msg: "next"})
        play=play+1
        return
    }
    if(message.msg==="run"){
        console.log("run----------->\n",runTab.id,"      ",message)
        command = message.command
        target = message.target
        value = message.value
        if(command.slice(0,3)==="Set"){
            var str = value
            var w = Number(str.slice(3,7))
            var i=7
            var x= str.length
            while(str[i]!='h'){
                i++
            }
            i+=3
            var h = Number(str.slice(i,x))
            console.log("w: ",w,"  h: ",h)
            var updateInfo = {
                left: 0,
                top: 0,
                width: w,
                height: h
            };
            await chrome.windows.update(runTab.windowId, updateInfo)
            await chrome.tabs.sendMessage(mainTab,{msg: "next"})
            return
        }
        if(command==="close"){
            setTimeout(async () => {
                await chrome.tabs.remove(runTab.id)
                await chrome.runtime.sendMessage({msg: "next"})
            }, 1000*speed);
            return
        }
        if(command==="quit"){
            setTimeout(async () => {
                await chrome.windows.remove(runTab.windowId)
                await chrome.runtime.sendMessage({msg: "next"})
            }, 1000*speed);
            return
        }
        clearInterval(myinterval)
        clearTimeout(mytimeout) 
        clearTimeout(aborttimeout)
        abort=true
        if(runTab.id===undefined){
            console.log("returned")
            return
        }
        mytimeout = setTimeout(async ()=>{  
            myinterval = setInterval(async function(){
                // var tab = await chrome.tabs.get(runTab.id)
                // console.log(tab)
                // runTab = tab
                console.log("interval--run---",runTab.id)
                if(pause==="resume"){
                    chrome.tabs.sendMessage(runTab.id,{msg: "playing",
                                                command: command,
                                                target: target,
                                                value: value})   
                }
                console.log("interval id inside----",myinterval)
            },1000*speed)
        },1000*speed)
        aborttimeout = setTimeout(async()=>{
            if(abort === true){
                clearInterval(myinterval)
                clearTimeout(mytimeout)
                clearTimeout(aborttimeout)
                await chrome.tabs.sendMessage(mainTab,{msg: "fail"})
            }
        },30000)
    }

    if(message.msg==="text"){
        console.log("debug text")
        clearInterval(myinterval)
        clearTimeout(aborttimeout)
        clearTimeout(mytimeout)
        abort=false
        var debuggeeId={
            tabId: runTab.id
        }

        chrome.debugger.attach(debuggeeId, "1.3",async function(){
            if (chrome.runtime.lastError) {
              alert(chrome.runtime.lastError.message);
              return;
            }
            // console.log("inside debugger   11")
            for(var i=0;i<value.length;i++){
                var options = getOptions(value.charAt(i))
                
                await chrome.debugger.sendCommand(debuggeeId, "Input.dispatchKeyEvent", options,async function(){
                    options.type = "keyUp"
                    await chrome.debugger.sendCommand(debuggeeId, "Input.dispatchKeyEvent",options)
                });
            }
        })
        setTimeout(async () => {
            await chrome.debugger.detach(debuggeeId, ()=>{});
            // await chrome.runtime.sendMessage({msg: "found"})
            abort=false
            clearTimeout(aborttimeout)
            console.log("here in clearing interval....................")
            clearInterval(myinterval)
            await chrome.tabs.sendMessage(mainTab,{msg: "next"})
        }, 200);
    }

    if(message.msg==="found"){
        clearInterval(myinterval)
        clearTimeout(mytimeout)
        console.log("interval id---",myinterval)
        abort=false
        clearTimeout(aborttimeout)
        console.log("here in clearing interval....................")
        if(runTab!==""){
            await chrome.tabs.sendMessage(mainTab,{msg: "next"})
        }
    }
    if(message.msg==="close windows"){
        await chrome.windows.remove(runTab.windowId)
    }
    if(message.msg === "done playing"){
        run_init()
    }

    var send=sender.tab.id
    // console.log("main "+mainTab)
    // console.log("send "+send)
    console.log(rec)
    chrome.tabs.sendMessage(send,{msg:"I am sent from back",
                                            mainTab: mainTab,
                                                rec: rec});
});


chrome.tabs.onRemoved.addListener(async function(tab){
    console.log("Tab removed    ")
    if(contentTab != "" && rec==="start"){
        var tabs = await chrome.tabs.query({windowId: Number(contentWin)})
        if(tabs.length === 0){
            await chrome.tabs.sendMessage(mainTab,{msg: "verified data",command: "quit",target: "",value: ""})
            inc=0
            contentTab=""
            contentWin=""
        }else{
            if(!tabs.includes(contentTab.id)){
                await chrome.tabs.sendMessage(mainTab,{msg: "verified data",command: "close",target: "",value: ""}) 
            }
        }
    }
    // maintab quit
    var tabs = await chrome.tabs.query({windowId: Number(mainWin)})
    if(tabs.length === 0){
        rec_init()
    }
    tabs = await chrome.tabs.query({})
    if(!tabs.includes(mainTab) && !tabs.includes(runTab.id)){
        run_init()
        await chrome.tabs.sendMessage(mainTab,{msg: "done playing from back"})
    }
    console.log("run--->",runTab)
});


// pop up on a new window
var popupUrl = chrome.runtime.getURL('main.html');
chrome.action.onClicked.addListener(async function(tab) {
    var tabs = await chrome.tabs.query({url: popupUrl})
    if(tabs.length === 0){
        //The popup doesn't exist
        chrome.windows.create({ 
            'url': chrome.runtime.getURL("main.html"),
            'type': 'popup',
            'width': 850,
            'height': 655,
            'left': 0,
            'top': 20,
            'focused': true
        })
    }else{
        chrome.windows.update(tabs[0].windowId,{'focused': true});
    }
});



function run_init(){
    runTab=""
    run=""
    command=""
    target=""
    value=""
    inc=0
    play=0
    abort = false
    clearInterval(myinterval)
    clearTimeout(aborttimeout)
    clearTimeout(mytimeout)
}

function rec_init(){
    // init vars
    mainTab=""
    mainWin=""
    contentTab=""
    contentWin=""
    runTab=""
    rec=""
    // running vars
    run=""
    command=""
    target=""
    value=""
    inc=0
    play=0
    // speed vars
    speed=1
    // pause vars
    pause="resume"
    abort = false
    clearInterval(myinterval)
    clearTimeout(aborttimeout)
    clearTimeout(mytimeout)
}

