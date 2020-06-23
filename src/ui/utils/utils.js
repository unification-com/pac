export function hashesAreEqual(){
    let len = arguments.length;
    for (let i = 1; i< len; i++){
        if (arguments[i] === null || arguments[i] !== arguments[i-1])
            return false;
    }
    return true;
}