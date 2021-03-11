const { DateTime } = require('luxon');
DateTime.local();

const { ttrule, regretsArray, regretsAge, sumDigits, langArray } = require('./app_tools.js');

const auth_conf = ({
    authRequired: false,
    auth0Logout: true,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    secret: process.env.SECRET
});

function main_counter(request) {

    const dateString = request.body.dateString;
    let nameString = request.body.nameString;
    const langString = request.body.langString;

    const startDate = DateTime.fromFormat(dateString, 'yyyy-MM-dd');
    //______________________________________________________________________ARCANES CALCy
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
    let htp = ttrule(dayArcane + (9 * monthArcane) + yearArcane);
    let kch2 = ttrule(dayArcane + (8 * monthArcane) + yearArcane);	
    let oge = ttrule(dayArcane + (7 * monthArcane) + yearArcane);
    let tii = ttrule((6 * dayArcane) + (6 * monthArcane) + (5 * yearArcane));  
    let zde = ttrule(dayArcane + (5 * monthArcane) + yearArcane); 
    let prpj = ttrule(dayArcane + (4 * monthArcane) + yearArcane);
    let dtp = ttrule(dayArcane + (3 * monthArcane) + yearArcane);
    let zka = ttrule(dayArcane + (2 * monthArcane) + yearArcane);
    let esz = ttrule(dayArcane + monthArcane + yearArcane);
    let tpe = ttrule(dayArcane + monthArcane);
    let zes = ttrule(dayArcane + yearArcane);
    let tpd = ttrule(tpe + monthArcane);
    let kas = ttrule(opv1[0] - ieb);
    let ptp = ttrule(esz - monthArcane);
    let els = ttrule(esz - opv1[0]);

    //______________________________________________________________________CALCULATE NAME
    let nameArcane = 0;
    nameString = nameString.split("");
    if ( nameString.length != 0 ) {
        outer: for (let q = 0; q < nameString.length; q++) {
            for (let s = 0, nines = 1; s < langArray[langString].length; s++, nines++) {
                if (nines > 9) { nines = nines - 9; }
                if (langString == 2 && q + 1 != nameString.length) {
                    if (nameString[q].toLowerCase() === 'd') {
                        if (nameString[q].toLowerCase().concat(nameString[q + 1].toLowerCase()) === 'dz') {
                            nameArcane += 9;
                            q++;
                            continue outer;
                        } else if (nameString[q].toLowerCase().concat(nameString[q + 1].toLowerCase()) === 'dž') {
                            nameArcane += 1;
                            q++;
                            continue outer;
                        } else {
                            nameArcane += 7;
                        }
                    } else if (nameString[q].toLowerCase() === 'c') {
                        if (nameString[q].toLowerCase().concat(nameString[q + 1].toLowerCase()) === 'ch') {
                            nameArcane += 7;
                            q++;
                            continue outer;
                        } else {
                            nameArcane += 5;
                        }
                    } else if (nameString[q].toLowerCase() === langArray[langString][s]) {
                        nameArcane += nines;
                    }
                } else if (nameString[q].toLowerCase() === langArray[langString][s]) {
                    nameArcane += nines;
                }
            }
        }
        nameArcane = ttrule(nameArcane);
    } else {
        nameArcane = 0;
    }

    

    let per = ttrule(nameArcane + (9 * monthArcane) + yearArcane);
    let tie = ttrule(esz + zka + nameArcane);   
    let zeo = ttrule(esz + per);
    let zez = ttrule(esz - per);

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

    //______________________________________________________________________SEND RESPONSE
    let response = ({
        dateCounter: dateCounter, diffInTime: diffInTime, opv1: opv1, opv2: opv2, opv3: opv3,
        regrets: regrets, regretsAge: regretsAge, nameArcane: nameArcane, kch: kch, kch2: kch2, 
        ieb: ieb, oge: oge, els: els, tpe: tpe, htp: htp, dtp: dtp, ptp: ptp, tpd: tpd, kas: kas, 
        zka: zka, zde: zde, zes: zes, esz: esz, per: per, tii: tii, tie: tie, prpj: prpj, zeo: zeo, zez: zez
    });

    return(response);
}

function kids_counter(request) {
    const dateString = request.body.dateString;
    const startDate = DateTime.fromFormat(dateString, 'yyyy-MM-dd');
    //______________________________________________________________________ARCANES CALC
    let dayArcane = ttrule(startDate.day);
    let monthArcane = ttrule(startDate.month);
    let yearArcane = ttrule(sumDigits(startDate.year));
    //______________________________________________________________________OPV 0 CALC
    let opv1 = [];
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
    while (i != 22) { //Цикл заполнения массива опв
        dateCounter[i + 1] = dateCounter[i].plus({ days: 100 });
        opv1[i + 1] = ttrule(opv1[i] - 1);
        //считает возраст в годах и месяцах
        diffInTime[i] = dateCounter[i + 1].diff(dateCounter[0], ['years', 'months', 'days', 'minutes', 'seconds']);
        diffInTime[i].toObject();
        i = i + 1;
    }
    //______________________________________________________________________REGRETS        

    let regrets = ttrule(regretsArray[ttrule(parseInt(startDate.month)) - 1][ttrule(parseInt(startDate.day)) - 1] + opv1[0]);

    //______________________________________________________________________
    //______________________________________________________________________SEND RESPONSE
    let response = ({
        dateCounter: dateCounter,
        opv1: opv1,
        regrets: regrets,
        diffInTime: diffInTime,
    });

    return(response);
}

function health_counter_1(request) {

    const dateString = request.body.dateString;
    const timeString = request.body.timeString;
    let nameString = request.body.nameString;
    const langString = request.body.langString;

    const startDate = DateTime.fromFormat(dateString, 'yyyy-MM-dd');
    const startTime = DateTime.fromFormat(timeString, 'HH-mm');
    //______________________________________________________________________ARCANES CALCy
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
    let htp = ttrule(dayArcane + (9 * monthArcane) + yearArcane);
    let kch2 = ttrule(dayArcane + (8 * monthArcane) + yearArcane);	
    let oge = ttrule(dayArcane + (7 * monthArcane) + yearArcane);
    let tii = ttrule((6 * dayArcane) + (6 * monthArcane) + (5 * yearArcane));  
    let zde = ttrule(dayArcane + (5 * monthArcane) + yearArcane); 
    let prpj = ttrule(dayArcane + (4 * monthArcane) + yearArcane);
    let dtp = ttrule(dayArcane + (3 * monthArcane) + yearArcane);
    let zka = ttrule(dayArcane + (2 * monthArcane) + yearArcane);
    let esz = ttrule(dayArcane + monthArcane + yearArcane);
    let tpe = ttrule(dayArcane + monthArcane);
    let zes = ttrule(dayArcane + yearArcane);
    let tpd = ttrule(tpe + monthArcane);
    let kas = ttrule(opv1[0] - ieb);
    let ptp = ttrule(esz - monthArcane);
    let els = ttrule(esz - opv1[0]);

    //______________________________________________________________________CALCULATE NAME
    let nameArcane = 0;
    nameString = nameString.split("");
    if ( nameString.length != 0 ) {
        outer: for (let q = 0; q < nameString.length; q++) {
            for (let s = 0, nines = 1; s < langArray[langString].length; s++, nines++) {
                if (nines > 9) { nines = nines - 9; }
                if (langString == 2 && q + 1 != nameString.length) {
                    if (nameString[q].toLowerCase() === 'd') {
                        if (nameString[q].toLowerCase().concat(nameString[q + 1].toLowerCase()) === 'dz') {
                            nameArcane += 9;
                            q++;
                            continue outer;
                        } else if (nameString[q].toLowerCase().concat(nameString[q + 1].toLowerCase()) === 'dž') {
                            nameArcane += 1;
                            q++;
                            continue outer;
                        } else {
                            nameArcane += 7;
                        }
                    } else if (nameString[q].toLowerCase() === 'c') {
                        if (nameString[q].toLowerCase().concat(nameString[q + 1].toLowerCase()) === 'ch') {
                            nameArcane += 7;
                            q++;
                            continue outer;
                        } else {
                            nameArcane += 5;
                        }
                    } else if (nameString[q].toLowerCase() === langArray[langString][s]) {
                        nameArcane += nines;
                    }
                } else if (nameString[q].toLowerCase() === langArray[langString][s]) {
                    nameArcane += nines;
                }
            }
        }
        nameArcane = ttrule(nameArcane);
    } else {
        nameArcane = 0;
    }

    

    let per = ttrule(nameArcane + (9 * monthArcane) + yearArcane);
    let tie = ttrule(esz + zka + nameArcane);   
    let zeo = ttrule(esz + per);
    let zez = ttrule(esz - per);

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

    //______________________________________________________________________SEND RESPONSE
    let response = ({
        dateCounter: dateCounter, diffInTime: diffInTime, opv1: opv1, opv2: opv2, opv3: opv3,
        regrets: regrets, regretsAge: regretsAge, nameArcane: nameArcane, kch: kch, kch2: kch2, 
        ieb: ieb, oge: oge, els: els, tpe: tpe, htp: htp, dtp: dtp, ptp: ptp, tpd: tpd, kas: kas, 
        zka: zka, zde: zde, zes: zes, esz: esz, per: per, tii: tii, tie: tie, prpj: prpj, zeo: zeo, zez: zez
    });

    return(response);
}

module.exports = { main_counter, kids_counter, health_counter_1, auth_conf };