function eval_xpath(xpath, context){
    return document. evaluate( xpath, context, null, XPathResult. FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue
}