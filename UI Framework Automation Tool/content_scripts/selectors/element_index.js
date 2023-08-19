function getElementIdx(elt){
    var child = elt;
    var parent = child.parentNode;
    var children = parent.children;
    var count = children.length;
    var child_index;
    for (var i = 0; i < count; ++i) {
        // console.log("child--->",children[i])
        if (child === children[i]) {
            child_index = i;
            break;
        }
    }
    return child_index
}