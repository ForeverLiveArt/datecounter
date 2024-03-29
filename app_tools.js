
//______________________________________________________________________generate regrets dates array 

const regretsAge = ["0,0", "0,9", "0,10", "2,3", "2,4", "4,6", "4,7", "7,6",
			      "7,6", "11,2", "11,3", "15,8", "15,9", "20,11", "20,12",
			      "26,11", "26,12", "33,8", "33,9", "41,2", "41,3", "49,5",
			      "49,6", "58,5", "58,6", "68,2", "68,3", "78,8", "78,9",
			      "89,11", "89,12", "101,0"];
//______________________________________________________________________

let langArray = [];

/*ENG*/ langArray[0] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 
                        'h', 'i', 'j', 'k', 'l', 'm', 'n', 
                        'o', 'p', 'q', 'r', 's', 't', 'u', 
                        'v', 'w', 'x', 'y', 'z'];

/*RUS*/ langArray[1] = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 
                        'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 
                        'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 
                        'ь', 'ы', 'ъ', 'э', 'ю', 'я'];

/*SLK*/ langArray[2] = ['a', 'á', 'ä', 'b', 'c', 'č', 'd', 'ď', 'dz', 
                        'dž', 'e', 'é', 'f', 'g', 'h', 'ch', 'i', 'í', 
                        'j', 'k', 'l', 'ĺ', 'ľ', 'm', 'n', 'ň', 'o', 
                        'ó', 'ô', 'p', 'q', 'r', 'ŕ', 's', 'š', 't', 
                        'ť', 'u', 'ú', 'v', 'w', 'x', 'y', 'ý', 'z', 'ž',];

/*vowels*/ langArray[3] = ['a', 'e', 'i', 'o', 'u', 'y', 
                          'а', 'е', 'ё', 'и', 'о', 'у', 'ь', 'ы', 'ъ', 'э', 'ю', 'я', 
                          'a', 'á', 'ä', 'e', 'é', 'i', 'í', 'o', 'ó', 'ô', 'u', 'ú', 'y', 'ý'];
                          
//______________________________________________________________________
//______________________________________________________________________RULE 22

function ttrule(z) {
    z = parseInt(z);
    while (z > 22) {
        z -= 22;
    }
    if (z == 0) {
        z = 22;
    }
    return Math.abs(z);
}
//______________________________________________________________________
//_____________________________________________________________________make 2d array func

function make2Darray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}
//_____________________________________________________________________
//_____________________________________________________________________make regrets table

function makeregretsArray() {
    let regretsArray = make2Darray(12, 22);
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 22; j++) {
            if (j <= i) {
                regretsArray[i][j] = i + 1;
            } else {
                regretsArray[i][j] = ttrule(regretsArray[i][j - 1] + 2);
            }
        }
    }
    return(regretsArray);
}
const regretsArray = makeregretsArray();
//______________________________________________________________________
//______________________________________________________________________SUMM DIGITS OF A NUM

function sumDigits(n) {
    let sum = 0;
    while (n) {
        digit = n % 10;
        sum += digit;
        n = (n - digit) / 10;
    }
    return sum;
}
//______________________________________________________________________

function modulo9(n) {
    return (n - 1) % 9 + 1;
}
//______________________________________________________________________

function shift(arr, direction, n) {
    let times = n > arr.length ? n % arr.length : n;
    return arr.concat(arr.splice(0, (direction > 0 ? arr.length - times : times)));
 }


module.exports = { ttrule, make2Darray, regretsArray, regretsAge, sumDigits, langArray, modulo9, shift };

