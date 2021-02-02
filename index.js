const express = require('express');
const app = express();
app.listen(8080, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

var { DateTime } = require('luxon');
DateTime.local();

var startDate = 0;

//_____________________________________________________________________make 2d array func

function make2Darray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}
//_____________________________________________________________________

//_____________________________________________________________________generate regrets dates array

var regretsAge = ["0,0", "0,9", "0,10", "2,3", "2,4", "4,6", "4,7", "7,6",
			      "7,6", "11,2", "11,3", "15,8", "15,9", "20,11", "20,12",
			      "26,11", "26,12", "33,8", "33,9", "41,2", "41,3", "49,5",
			      "49,6", "58,5", "58,6", "68,2", "68,3", "78,8", "78,9",
			      "89,11", "89,12", "101,0"
];
//_____________________________________________________________________

//_____________________________________________________________________make regrets table

var regretsArray = [];

function makeregretsArray() {
    regretsArray = make2Darray(12, 22);
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 22; j++) {
            if (j <= i) {
                regretsArray[i][j] = i + 1;
            } else {
                regretsArray[i][j] = ttrule(regretsArray[i][j - 1] + 2);
            }
        }
    }
}
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


app.post('/api', (request, response) => {

    const dateString = request.body.dateString;
    const startDate = DateTime.fromFormat(dateString, 'yyyy-MM-dd');
    //______________________________________________________________________ARCANES CALC
    let dayArcane = ttrule(startDate.day);
    let monthArcane = ttrule(startDate.month);
    let yearArcane = ttrule(sumDigits(startDate.year));
    //______________________________________________________________________OPV 0 CALC
    let opv1 = [];
    opv1[0] = ttrule(dayArcane - monthArcane);
    let opv2 = [];
    let opv3 = [];
    //______________________________________________________________________
    let ieb = ttrule(yearArcane - monthArcane);

    let kch = ttrule(yearArcane - dayArcane);
    let kch2 = dayArcane + (8 * monthArcane) + yearArcane;
	
    let oge = dayArcane + (7 * monthArcane) + yearArcane;
    let htp = dayArcane + (9 * monthArcane) + yearArcane;
    let zka = dayArcane + (2 * monthArcane) + yearArcane;
    let dtp = dayArcane + (3 * monthArcane) + yearArcane;
    let prpj = dayArcane + (4 * monthArcane) + yearArcane;    
    let zde = dayArcane + (5 * monthArcane) + yearArcane; 
    let tii = (6 * dayArcane) + (6 * monthArcane) + (5 * yearArcane);  
    let tpe = dayArcane + monthArcane;
    let zes = dayArcane + yearArcane;
    let tpd = tpe + monthArcane;
    let kas = opv1[0] - ieb;
    let esz = dayArcane + monthArcane + yearArcane;
    let ptp = esz - monthArcane;
    let els = esz - opv1[0];
    //let per = nameArcane + (9 * monthArcane) + yearArcane;

    //let tie = esz + zka + nameArcane;   
    //let zeo = esz + per
    //let zez = esz - per

    //______________________________________________________________________OPV 123 ARRAYS
    let dateCounter = [];
    dateCounter[0] = startDate;
    let i = 0;
    let intervals = 22; //количество 22 в цикле
    let cycle = 1;
    let diffInTime = [];

    while (i != 220) { //Цикл заполнения массива опв
        dateCounter[i + 1] = dateCounter[i].plus({ days: 100 });
        opv1[i + 1] = ttrule(opv1[i] - 1);
        opv2[i] = ttrule(opv1[i] - kch);
        opv3[i] = ttrule(opv1[i] + opv2[i] + kch + ieb);
        //считает возраст в годах и месяцах
        diffInTime[i] = dateCounter[i + 1].diff(dateCounter[0], ['years', 'months', 'days']);
        diffInTime[i].toObject();
        i = i + 1;
    }

    //______________________________________________________________________REGRETS        
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
    let regrets = [];
    regrets[0] = ttrule(regretsArray[ttrule(parseInt(startDate.month)) - 1][ttrule(parseInt(startDate.day)) - 1] + opv1[0]);

    for (let k = 0, j = 0; j < regretsAge.length; k++, j = j + 2) {
        regrets[k + 1] = ttrule(regrets[k] + 1);
    }
    //______________________________________________________________________

    response.json({
        dateCounter: dateCounter,
        opv1: opv1,
        opv2: opv2,
        opv3: opv3,
        regrets: regrets,
        diffInTime: diffInTime
    });
});