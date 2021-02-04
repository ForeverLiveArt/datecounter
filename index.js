const express = require('express');
const app = express();
app.listen(8080, () => console.log('listening at 8080'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));







var { DateTime } = require('luxon');
DateTime.local();

const { ttrule, make2Darray, regretsArray, regretsAge, sumDigits } = require('./app_tools.js');
var startDate = 0;


app.post('/api', (request, response) => {

    const dateString = request.body.dateString;
    const startDate = DateTime.fromFormat(dateString, 'yyyy-MM-dd');
    //______________________________________________________________________ARCANES CALC
    let dayArcane = ttrule(startDate.day);
    let monthArcane = ttrule(startDate.month);
    let yearArcane = ttrule(sumDigits(startDate.year));
    //______________________________________________________________________OPV 0 CALC
    let opv1 = [];
    let opv2 = [];
    let opv3 = [];
    opv1[0] = ttrule(dayArcane - monthArcane);
    //______________________________________________________________________CALC VALUES
    let ieb = ttrule(yearArcane - monthArcane);
    let kch = ttrule(yearArcane - dayArcane);
    let htp = dayArcane + (9 * monthArcane) + yearArcane;
    let kch2 = dayArcane + (8 * monthArcane) + yearArcane;	
    let oge = dayArcane + (7 * monthArcane) + yearArcane;
    let tii = (6 * dayArcane) + (6 * monthArcane) + (5 * yearArcane);  
    let zde = dayArcane + (5 * monthArcane) + yearArcane; 
    let prpj = dayArcane + (4 * monthArcane) + yearArcane;
    let dtp = dayArcane + (3 * monthArcane) + yearArcane;
    let zka = dayArcane + (2 * monthArcane) + yearArcane;

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
    let intervals = 22; //количество 22 в цикле
    let cycle = 1;
    let diffInTime = [];
    let i = 0;
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

    let regrets = [];
    regrets[0] = ttrule(regretsArray[ttrule(parseInt(startDate.month)) - 1][ttrule(parseInt(startDate.day)) - 1] + opv1[0]);
    for (let k = 0, j = 0; j < regretsAge.length; k++, j = j + 2) {
        regrets[k + 1] = ttrule(regrets[k] + 1);
    }
    //______________________________________________________________________
    //______________________________________________________________________SEND RESPONSE
    response.json({
        dateCounter: dateCounter,
        opv1: opv1,
        opv2: opv2,
        opv3: opv3,
        regrets: regrets,
        diffInTime: diffInTime,
        regretsAge: regretsAge
    });
});

app.post('/kids_api', (request, response) => {

    const dateString = request.body.dateString;
    const startDate = DateTime.fromFormat(dateString, 'yyyy-MM-dd');
    //______________________________________________________________________ARCANES CALC
    let dayArcane = ttrule(startDate.day);
    let monthArcane = ttrule(startDate.month);
    let yearArcane = ttrule(sumDigits(startDate.year));
    //______________________________________________________________________OPV 0 CALC
    let opv1 = [];
    let opv2 = [];
    let opv3 = [];
    opv1[0] = ttrule(dayArcane - monthArcane);
    //______________________________________________________________________CALC VALUES
    let ieb = ttrule(yearArcane - monthArcane);
    let kch = ttrule(yearArcane - dayArcane);
    let htp = dayArcane + (9 * monthArcane) + yearArcane;
    let kch2 = dayArcane + (8 * monthArcane) + yearArcane;	
    let oge = dayArcane + (7 * monthArcane) + yearArcane;
    let tii = (6 * dayArcane) + (6 * monthArcane) + (5 * yearArcane);  
    let zde = dayArcane + (5 * monthArcane) + yearArcane; 
    let prpj = dayArcane + (4 * monthArcane) + yearArcane;
    let dtp = dayArcane + (3 * monthArcane) + yearArcane;
    let zka = dayArcane + (2 * monthArcane) + yearArcane;

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

    let diffInTime = [];
    let i = 0;
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

    let regrets = [];
    regrets[0] = ttrule(regretsArray[ttrule(parseInt(startDate.month)) - 1][ttrule(parseInt(startDate.day)) - 1] + opv1[0]);
    for (let k = 0, j = 0; j < regretsAge.length; k++, j = j + 2) {
        regrets[k + 1] = ttrule(regrets[k] + 1);
    }
    //______________________________________________________________________
    //______________________________________________________________________SEND RESPONSE
    response.json({
        dateCounter: dateCounter,
        opv1: opv1,
        opv2: opv2,
        opv3: opv3,
        regrets: regrets,
        diffInTime: diffInTime,
        regretsAge: regretsAge
    });
});