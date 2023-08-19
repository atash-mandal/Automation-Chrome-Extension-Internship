var rec=document.getElementById('record')
var run=document.getElementById('run')
var pause = document.getElementById('pause')
var url=document.getElementById('url')
var table=document.getElementById('table')
var tbody=document.getElementById('tbody')
var speed = document.getElementById('speedselect')
var save = document.getElementById('save')
var file_open = document.getElementById('file-open')
var iteration = document.getElementById('iter_val')
var iter_idx=1
var iter_map = new Map()
var record=""
var pause_state = "pause"
var inc=0
var rowno = 1
var close_flag = false
var log_msg = document.getElementById('log-msg') 

pause.setAttribute("disabled",true)
// recording button functions
rec.addEventListener('click',async function(){
    iter_idx=1
    iter_map.clear()
    if(rec.classList.contains('fa-beat-fade')){
        record="stop"
        rec.classList.toggle('fa-beat-fade')
        log_msg.innerHTML = `<div id="log-txt" style="color: orange;">
                                Recording stopped...
                            </div>`
        await chrome.runtime.sendMessage({msg:"Stop Recording!"});
        return
    }else{
        log_msg.innerHTML = `<div id="log-txt" style="color: #e41b1b;">
                                Recording...
                            </div>`
    }
    
    rec.classList.toggle('fa-beat-fade')
    if(record===""){
        record="start"
        await chrome.windows.create({
            url: url.value,
            'width': 1200,
            'height': 650,
            'left': 60,
            'top': 20,
            'focused': true,
            // state: "maximized"
        });
    }
    await chrome.runtime.sendMessage({msg:"Start Recording!"});
});

run.addEventListener('click',async function(){
    inc=0
    close_flag = false
    pause_state = "pause"
    var x = tbody.children
    x=[...x]
    var flag = false
    log_msg.innerHTML = ""
    var index = 1
    x.forEach((row) => {
        row.children[0].style.color = "black"
        row.children[1].children[0].style.color = "black"
        row.children[2].children[0].style.color = "black"
        row.children[3].children[0].style.color = "black"
        row.children[4].children[0].style.color = "black"
        row.children[5].children[0].style.color = "black"
        if(row.children[4].children[0].value === "" && row.children[5].children[0].value!==""){
            alert("Error: Please provide a valid start value in range of step "+index)
            flag=true
            return
        }
        if(row.children[5].children[0].value === "" && row.children[4].children[0].value!==""){
            alert("Error: Please provide a valid end value in range of step "+index)
            flag=true
            return
        }
        if(row.children[4].children[0].value !== ""  && isNaN(row.children[4].children[0].value)){
            alert("Error: Please give a valid integer in start field of step "+index)
            flag=true
            return
        }
        if(row.children[5].children[0].value !== ""  && isNaN(row.children[5].children[0].value)){
            alert("Error: Please give a valid integer in end field of step "+index)
            flag=true
            return
        }
        if(Number(row.children[5].children[0].value) < Number(row.children[4].children[0].value)){
            [row.children[5].children[0].value , row.children[4].children[0].value] = [row.children[4].children[0].value , row.children[5].children[0].value]
        }
        if(isNaN(iteration.value)){
            alert("Error: Please give a valid integer in iteration")
            flag=true
            return
        }
        if(iter_idx===1 && row.children[4].children[0].value !== ""){
            iter_map.set(index,{start: Number(row.children[4].children[0].value),end: Number(row.children[5].children[0].value),current: Number(row.children[4].children[0].value)})
        }
        index++
    });
    if(flag){
        return
    }
    if(run.classList.contains('fa-play')){
        pause.removeAttribute("disabled")
        run.classList.remove('fa-play')
        run.classList.add('fa-stop')
        log_msg.innerHTML = `<div id="log-txt" style="color: #4169E1;">
                                Playing Script...
                            </div>`
    }else{
        pause.setAttribute("disabled",true)
        run.classList.remove('fa-stop')
        run.classList.add('fa-play')
        iter_idx=1
        iter_map.clear()
        log_msg.innerHTML = `<div id="log-txt" style="color: orange;">
                                Test Aborted...
                            </div>`
        await chrome.runtime.sendMessage({msg: "done playing"})
        return
    }

    await chrome.runtime.sendMessage({msg: "done playing"})
    if(rec.classList.contains('fa-beat-fade')){
        record="stop"
        rec.classList.toggle('fa-beat-fade')
        await chrome.runtime.sendMessage({msg:"Stop Recording!"});
    }
    
    await chrome.runtime.sendMessage({msg: "runWin",url: url.value,speed: speed.value})
    await chrome.windows.create({
        'url': url.value,
        'width': 1200,
        'height': 650,
        'left': 60,
        'top': 20,
        'focused': true,
        // state: "maximized"
    });
});

pause.addEventListener('click',async function(e){ 
    if(pause_state != "paused"){
        pause_state = "paused"
        pause.style.color = "#FC4C02"
        log_msg.innerHTML = `<div id="log-txt" style="color: #3F00FF;">
                                Playing Paused...
                            </div>`
        await chrome.runtime.sendMessage({msg: "Pause Running"})
    }else{
        pause_state = "pause"
        pause.style.color = "#727472"
        log_msg.innerHTML = `<div id="log-txt" style="color: #4169E1;">
                                Playing Script...
                            </div>`
        await chrome.runtime.sendMessage({msg: "Resume Running"})
    }
});

save.addEventListener('click',async function(){
    iter_idx=1
    iter_map.clear()
    try{
        downloadCSS();
    }
    catch (err) {
        alert("Error: "+err.message);
    }
})

var downloadCSS = function () {
    var script = []
    var rows = tbody.children
    rows = [...rows]
    var x=rows.length
    var flag = false
    for(var i=0;i<x;i++){
        if(rows[i].children[1].children[0].value !== ""){
            flag=true
            break
        }
    }
    if(flag === false){
        alert("Record script to save")
        return
    }
    var url_value = document.getElementById('url').value
    // console.log(url_value)
    script.push({url: url_value})
    for (i = 0; i < x; i++) { 
        script.push({
            command: rows[i].children[1].children[0].value,
            target: rows[i].children[2].children[0].value,
            value: rows[i].children[3].children[0].value,
            start: rows[i].children[4].children[0].value,
            end: rows[i].children[5].children[0].value
        });
    }
    console.log([...script])
    var blob = new Blob([JSON.stringify(script, null, 2)], { type : 'application/json'})
    var url = URL.createObjectURL(blob);
    chrome.downloads.download({
        url: url, // The object URL can be used as download URL
        filename: 'New Project.json',
        saveAs: true
    });
}

file_open.addEventListener('click',async function(){
    iter_idx=1
    iter_map.clear()
    const pickerOpts = {
        types: [
            {
                accept: {
                    "application/json": [".json"],
                },
            },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
    };
    var [filehandler] = await window.showOpenFilePicker(pickerOpts)
    var filedata = await filehandler.getFile()
    var text = await filedata.text()
    document.getElementById('project-name').value = filedata.name
    var obj = JSON.parse(text)
    obj = [...obj]
    document.getElementById('url').value = obj[0].url
    var x = obj.length
    tbody.innerHTML=""
    for(var i=1; i<x; i++){
        tbody.innerHTML+=(
            `<tr>
                <td style="text-align: center;"></td>
                <td><input id="tdata" value=${obj[i].command}></td>
                <td><input id="tdata" value=${obj[i].target}></td>
                <td><input id="tdata" value=${obj[i].value}></td>
                <td><input id="tdata" value=${obj[i].start}></td>
                <td><input id="tdata" value=${obj[i].end}></td>
                <td id="add" style="width:5%; text-align: center;"><i class="fas fa-regular fa-square-plus" title="Add row below"></i></td>
                <td id="delete" style="width:5%; text-align: center;"><i class="fas fa-sharp fa-solid fa-trash" title="Delete this row"></i></td>
            </tr>`
        )
    }
    var rowno=1
    var row = tbody.children
    row = [...row]
    row.forEach((row) => {
        row.children[0].textContent=rowno
        rowno++
    });
})


// table insert and delete functions
tbody.addEventListener('click',function(e){
    var idx=e.target.parentNode.parentNode.rowIndex // index of the current row
    if(e.target.classList.contains('fa-square-plus')===true)
    {
        var row = table.insertRow(idx+1);
        row.innerHTML=(`
            <tr>
                <td style="text-align: center;"></td>
                <td><input id="tdata" value=""></td>
                <td><input id="tdata" value=""></td>
                <td><input id="tdata" value=""></td>
                <td><input id="tdata"></td>
                <td><input id="tdata"></td>
                <td id="add" style="width:5%; text-align: center;"><i class="fas fa-regular fa-square-plus" title="Add row below"></i></td>
                <td id="delete" style="width:5%; text-align: center;"><i class="fas fa-sharp fa-solid fa-trash" title="Delete this row"></i></td>
            </tr>`)
            console.log("row inserted at ",idx+1)
    }
    else if(e.target.classList.contains('fa-trash')===true){
        table.deleteRow(idx)
        console.log("row deleted at ",idx)
        if(tbody.children.length===0){
            tbody.innerHTML=`
                <tr>
                    <td style="text-align: center;"></td>
                    <td><input id="tdata" value=""></td>
                    <td><input id="tdata" value=""></td>
                    <td><input id="tdata" value=""></td>
                    <td><input id="tdata"></td>
                    <td><input id="tdata"></td>
                    <td id="add" style="width:5%; text-align: center;"><i class="fas fa-regular fa-square-plus" title="Add row below"></i></td>
                    <td id="delete" style="width:5%; text-align: center;"><i class="fas fa-sharp fa-solid fa-trash" title="Delete this row"></i></td>
                </tr>`;
        }
    }
    var rowno=1
    var row = tbody.children
    row = [...row]
    row.forEach((row) => {
        row.children[0].textContent=rowno
        rowno++
    });
})




// messaging
chrome.runtime.sendMessage({msg: "Main.js"})
chrome.runtime.onMessage.addListener(async (message,sender,response)=>{
    console.log(message)
    if(message.msg==="url"){
        console.log(message.url)
        url.value = message.url
    }
    if(message.msg==="verified data"){
        if(tbody.children.length===1 && tbody.children[0].children[1].children[0].value===""){
            tbody.innerHTML="";
        }
        if(message.command === "type"){
            var x=tbody.children.length
            message.value = message.value.replaceAll(' ', '&nbsp;')
            if(message.command===tbody.children[(x-1)].children[1].children[0].value && message.target === tbody.children[(x-1)].children[2].children[0].value)
            {
                table.deleteRow(x)
                console.log("row deleted at ",x)
            }
            if(message.value==="")
                return
        }
        if(message.command === "quit"){
            var x=tbody.children.length
            if(x>0 && tbody.children[x-1].children[1].children[0].value==="quit"){
                return
            }
        }
        if(message.command === "close"){
            var x=tbody.children.length
            if(x>0 && tbody.children[x-1].children[1].children[0].value==="close"){
                return
            }
        }
        if(message.command==="enter"){
            var x=tbody.children.length
            if(x>0){
                message.target=tbody.children[x-1].children[2].children[0].value
            }
        }
        if(message.command === "Set&nbsp;window&nbsp;size"){
            var x=tbody.children.length
            if(x>0 && tbody.children[x-1].children[1].children[0].value.substr(0,3)==="Set"){
                table.deleteRow(x)
            }
        }
        
        tbody.innerHTML+=(
            `<tr>
                <td style="text-align: center;"></td>
                <td><input id="tdata" value=${message.command}></td>
                <td><input id="tdata" value=${message.target}></td>
                <td><input id="tdata" value=${message.value}></td>
                <td><input id="tdata"></td>
                <td><input id="tdata"></td>
                <td id="add" style="width:5%; text-align: center;"><i class="fas fa-regular fa-square-plus" title="Add row below"></i></td>
                <td id="delete" style="width:5%; text-align: center;"><i class="fas fa-sharp fa-solid fa-trash" title="Delete this row"></i></td>
            </tr>`
        )
        var rowno=1
        var row = tbody.children
        row = [...row]
        row.forEach((row) => {
            row.children[0].textContent=rowno
            rowno++
        });
    }
    if(message.msg==="done playing from back"){
        // inc=0
        run.classList.remove('fa-stop')
        run.classList.add('fa-play')
        if(!close_flag){
            iter_idx=1
            iter_map.clear()
        }
        log_msg.innerHTML = `<div id="log-txt" style="color: #4CBB17;">
                                Test Completed...
                            </div>`
        // pause.setAttribute("disabled")
        return
    }
    if(message.msg === "next"){
        var rows = tbody.children
        rows = [...rows]
        var x=rows.length
        console.log("i---->",inc,"   rows---->",x)
        if(iter_idx===1 && Number(iteration.value) > 1 && inc < x && (rows[inc].children[1].children[0].value==="close" || rows[inc].children[1].children[0].value==="quit")){
            rows[inc-1].children[0].style.color = "#04AF70"
            rows[inc-1].children[1].children[0].style.color = "#04AF70"
            rows[inc-1].children[2].children[0].style.color = "#04AF70"
            rows[inc-1].children[3].children[0].style.color = "#04AF70"
            rows[inc-1].children[4].children[0].style.color = "#04AF70"
            rows[inc-1].children[5].children[0].style.color = "#04AF70"

            run.classList.remove('fa-stop')
            run.classList.add('fa-play')
            await chrome.runtime.sendMessage({msg: "done playing"})
            if(iter_idx < iteration.value){
                iter_idx++
                setTimeout(() => {
                    run.click()
                }, 2000);
            }
            return
        }
        if(inc >= x){
            rows[inc-1].children[0].style.color = "#04AF70"
            rows[inc-1].children[1].children[0].style.color = "#04AF70"
            rows[inc-1].children[2].children[0].style.color = "#04AF70"
            rows[inc-1].children[3].children[0].style.color = "#04AF70"
            rows[inc-1].children[4].children[0].style.color = "#04AF70"
            rows[inc-1].children[5].children[0].style.color = "#04AF70"
            // inc=0
            run.classList.remove('fa-stop')
            run.classList.add('fa-play')
            log_msg.innerHTML = `<div id="log-txt" style="color: #4CBB17;">
                                Test Completed...
                                </div>`
            pause.setAttribute("disabled",true)
            await chrome.runtime.sendMessage({msg: "done playing"})
            if(iter_idx === Number(iteration.value)){
                iter_idx = 1
                iter_map.clear()
                return
            }
            if(iter_idx < Number(iteration.value)){
                iter_idx++
                setTimeout(() => {
                    run.click()
                }, 2000);
            }
            return
        } 
        
        if(inc > 0){
            rows[inc-1].children[0].style.color = "#04AF70"
            rows[inc-1].children[1].children[0].style.color = "#04AF70"
            rows[inc-1].children[2].children[0].style.color = "#04AF70"
            rows[inc-1].children[3].children[0].style.color = "#04AF70"
            rows[inc-1].children[4].children[0].style.color = "#04AF70"
            rows[inc-1].children[5].children[0].style.color = "#04AF70"
        }
        if(iter_map.has(inc+1)){
            var map_data = iter_map.get(inc+1)
            var append = iter_map.get(inc+1).current
            iter_map.get(inc+1).current++
            if(map_data.current > map_data.end){
                iter_map.get(inc+1).current = iter_map.get(inc+1).start
            }
        }else{
            var append=""
        }
        close_flag = false
        if(rows[inc].children[1].children[0].value === "close" || rows[inc].children[1].children[0].value === "quit"){
            close_flag = true
        }
        await chrome.runtime.sendMessage({msg: "run",command: rows[inc].children[1].children[0].value,
                                                    target: rows[inc].children[2].children[0].value,
                                                    value: rows[inc].children[3].children[0].value+append})
        
        inc=inc+1
        
    }
    if(message.msg === "fail"){
        await chrome.runtime.sendMessage({msg: "done playing"})
        // inc=0
        iter_idx=1
        iter_map.clear()
        run.classList.remove('fa-stop')
        run.classList.add('fa-play')
        log_msg.innerHTML = `<div id="log-txt" style="color: #FF2400;">
                                Test Failed...
                            </div>`
    }
})

