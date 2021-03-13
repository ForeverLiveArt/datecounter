const {
    DateTime
} = require('luxon');
DateTime.local();

const {
    ttrule,
    regretsArray,
    make2Darray,
    regretsAge,
    sumDigits,
    modulo9,
    langArray
} = require('./app_tools.js');

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
    // ARCANES CALC
    let dayArcane = ttrule(startDate.day);
    let monthArcane = ttrule(startDate.month);
    let yearArcane = ttrule(sumDigits(startDate.year));

    // OPV 0 CALC
    let opv1 = [];
    let opv2 = [];
    let opv3 = [];
    opv1[0] = ttrule(dayArcane - monthArcane);

    // CALC VALUES
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

    // CALCULATE NAME
    let nameArcane = 0;
    nameString = nameString.split("");
    if (nameString.length != 0) {
        outer: for (let q = 0; q < nameString.length; q++) {
            for (let s = 0, nines = 1; s < langArray[langString].length; s++, nines++) {
                if (nines > 9) {
                    nines = nines - 9;
                }
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
    }
    else {
        nameArcane = 0;
    }

    let per = ttrule(nameArcane + (9 * monthArcane) + yearArcane);
    let tie = ttrule(esz + zka + nameArcane);
    let zeo = ttrule(esz + per);
    let zez = ttrule(esz - per);

    // OPV 123 ARRAYS
    let dateCounter = [];
    dateCounter[0] = startDate;
    let intervals = 22; // количество 22 в цикле
    let cycle = 1;
    let diffInTime = [];
    let i = 0;
    while (i != 220) { // Цикл заполнения массива опв
        dateCounter[i + 1] = dateCounter[i].plus({
            days: 100
        });
        opv1[i + 1] = ttrule(opv1[i] - 1);
        opv2[i] = ttrule(opv1[i] - kch);
        opv3[i] = ttrule(opv1[i] + opv2[i] + kch + ieb);
        // считает возраст в годах и месяцах
        diffInTime[i] = dateCounter[i + 1].diff(dateCounter[0], ['years', 'months', 'days']);
        diffInTime[i].toObject();
        i = i + 1;
    }

    // REGRETS        
    let regrets = [];
    regrets[0] = ttrule(regretsArray[ttrule(parseInt(startDate.month)) - 1][ttrule(parseInt(startDate.day)) - 1] + opv1[0]);
    for (let k = 0, j = 0; j < regretsAge.length; k++, j = j + 2) {
        regrets[k + 1] = ttrule(regrets[k] + 1);
    }

    // SEND RESPONSE
    let response = ({
        dateCounter: dateCounter,
        diffInTime: diffInTime,
        opv1: opv1,
        opv2: opv2,
        opv3: opv3,
        regrets: regrets,
        regretsAge: regretsAge,
        nameArcane: nameArcane,
        kch: kch,
        kch2: kch2,
        ieb: ieb,
        oge: oge,
        els: els,
        tpe: tpe,
        htp: htp,
        dtp: dtp,
        ptp: ptp,
        tpd: tpd,
        kas: kas,
        zka: zka,
        zde: zde,
        zes: zes,
        esz: esz,
        per: per,
        tii: tii,
        tie: tie,
        prpj: prpj,
        zeo: zeo,
        zez: zez
    });

    return (response);
}

function kids_counter(request) {
    
    const dateString = request.body.dateString;
    const startDate = DateTime.fromFormat(dateString, 'yyyy-MM-dd');

    // ARCANES CALC

    let dayArcane = ttrule(startDate.day);
    let monthArcane = ttrule(startDate.month);
    let yearArcane = ttrule(sumDigits(startDate.year));

    // OPV 0 CALC

    let opv1 = [];
    opv1[0] = ttrule(dayArcane - monthArcane);

    // OPV 123 ARRAYS

    let dateCounter = [];
    dateCounter[0] = startDate;

    let diffInTime = [];
    let i = 0;
    while (i != 22) { // Цикл заполнения массива опв
        dateCounter[i + 1] = dateCounter[i].plus({
            days: 100
        });
        opv1[i + 1] = ttrule(opv1[i] - 1);
        // Cчитает возраст в годах и месяцах
        diffInTime[i] = dateCounter[i + 1].diff(dateCounter[0], ['years', 'months', 'days', 'minutes', 'seconds']);
        diffInTime[i].toObject();
        i = i + 1;
    }

    // REGRETS        

    let regrets = ttrule(regretsArray[ttrule(parseInt(startDate.month)) - 1][ttrule(parseInt(startDate.day)) - 1] + opv1[0]);

    // SEND RESPONSE

    let response = ({
        dateCounter: dateCounter,
        opv1: opv1,
        regrets: regrets,
        diffInTime: diffInTime,
    });

    return (response);
}

function health_counter(request) {

    const dateString = request.body.dateString,
          timeString = request.body.timeString,
          langString = request.body.langString,
          nameConst = request.body.nameString,
          startDate = DateTime.fromFormat(dateString, 'yyyy-MM-dd'),
          startTime = DateTime.fromFormat(timeString, 'HH-mm');

    // CALCULATE NAME

    let nameString = nameConst.split("");
    let graphRes = 0;

    if (nameString.length != 0) {

        let nameResArr = [];

        for (let z = 0; z < nameString.length; z++) { //remove all the vowels and unused symbols from name
            if (langArray[3].includes(nameString[z].toLowerCase()) || !(langArray[langString].includes(nameString[z].toLowerCase()))) {
                nameString.splice(z, 1);
                z--;
            }
        }

        if (nameString.length != 0) {
        outer: for (let q = 0; q < nameString.length; q++) {
            for (let s = 0, nines = 1; s < langArray[langString].length; s++, nines++) {
                if (nines > 9) {
                    nines = nines - 9;
                }
                if (langString == 2 && q + 1 != nameString.length) {
                    if (nameString[q].toLowerCase() === 'd') {
                        if (nameString[q].toLowerCase().concat(nameString[q + 1].toLowerCase()) === 'dz') {
                            nameResArr.push(9);
                            q++;
                            continue outer;
                        } else if (nameString[q].toLowerCase().concat(nameString[q + 1].toLowerCase()) === 'dž') {
                            nameResArr.push(1);
                            q++;
                            continue outer;
                        } else { nameResArr.push(7); }
                    } else if (nameString[q].toLowerCase() === 'c') {
                        if (nameString[q].toLowerCase().concat(nameString[q + 1].toLowerCase()) === 'ch') {
                            nameResArr.push(7);
                            q++;
                            continue outer;
                        } else { nameResArr.push(5);}
                    } else if (nameString[q].toLowerCase() === langArray[langString][s]) {
                        nameResArr.push(nines);
                    }
                } else if (nameString[q].toLowerCase() === langArray[langString][s]) {
                    nameResArr.push(nines);
                }
            }
        }

        let nameRes2dArr = make2Darray(Math.ceil(nameResArr.length/8 + 1), 8);

        nameRes2dArr[0] = startDate.toFormat('ddMMyyyy').split("");      
        
        for (let j = 1; j < nameRes2dArr.length; j++) {
            nameRes2dArr[j].splice(0, 8, ...nameResArr.splice(0, 8));
        }
        
        graphRes = make2Darray(3, 8);
        console.log("graphRes before:", graphRes);
        for (let j = 0; j < 8; j++) {
            for (let i = 0; i < nameRes2dArr.length; i++) {
                if (graphRes[0][j] === undefined) {
                    graphRes[0][j] = 0;
                }
                if (nameRes2dArr[i][j] === undefined) {
                    nameRes2dArr[i][j] = 0;
                }
                graphRes[0][j] += parseInt(nameRes2dArr[i][j]);
                
            }   
            graphRes[0][j] = modulo9(graphRes[0][j]);
            graphRes[1][j] = modulo9(graphRes[0][j] + 1);
            graphRes[2][j] = modulo9(graphRes[0][j] + 2); 
        }
        console.log("graph:", graphRes); 
        
        } else {
            graphRes = false;
        }

    } else {
        graphRes = false;
    }
    
    // SEND RESPONSE

    let response = ({
        graphRes: graphRes,
        
    });

    return (response);
}

module.exports = {
    main_counter,
    kids_counter,
    health_counter,
    auth_conf
};