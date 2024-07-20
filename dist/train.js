"use strict";
function countVowels(str) {
    let unli = ["a", "i", "o", "u", "e"];
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (unli.includes(str[i]))
            count++;
    }
    return count;
}
console.log(countVowels("string1"));
