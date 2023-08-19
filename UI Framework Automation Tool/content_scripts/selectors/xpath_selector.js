function getXPathForElement(element) {
    var temp = element
    while(temp!==null && temp.tagName!=="BODY"){
        if(temp.tagName==="BUTTON"){
            element = temp
            break
        }
        temp = temp.parentNode
    }
    const idx = (sib, name) => sib 
        ? idx(sib.previousElementSibling, name||sib.localName) + (sib.localName == name)
        : 1;
    const segs = elm => !elm || elm.nodeType !== 1 
        ? ['']
        : elm.id && document.getElementById(elm.id) === elm
            ? [`id("${elm.id}")`]
            : [...segs(elm.parentNode), `${elm.localName.toLowerCase()}[${idx(elm)}]`];
    return segs(element).join('/');
}