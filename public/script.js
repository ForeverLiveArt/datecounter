var startDate = 0;
var REGRETSarray = [];
var REGRETSage = ["0,0", "0,9", "0,10", "2,3", "2,4", "4,6", "4,7", "7,6",
    "7,6", "11,2", "11,3", "15,8", "15,9", "20,11", "20,12", "26,11",
    "26,12", "33,8", "33,9", "41,2", "41,3", "49,5", "49,6", "58,5",
    "58,6", "68,2", "68,3", "78,8", "78,9", "89,11", "89,12", "101,0"
];



function make2Darray(cols, rows) {
    var arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

function makeREGRETSarray() {
    REGRETSarray = make2Darray(12, 22); 
    for (let i = 0; i < 12; i++) { 
        for (let j = 0; j < 22; j++) { 
            if (j <= i) {
                REGRETSarray[i][j] = i + 1; 
            } else {
                REGRETSarray[i][j] = ttrule(REGRETSarray[i][j - 1] + 2); 
            }
        }
    }
}

function moveOnMax(field, nextFieldID) {
    if (field.value.length >= field.maxLength) {
        document.getElementById(nextFieldID).focus();
    }
}


function checkDate() { //валидация ввода
    if (($('#dateInputYear').val().length > 1) && ($('#dateInputMonth').val().length > 1) && ($('#dateInputDay').val().length > 1)) {
        datestring = $('#dateInputYear').val() + '-' + $('#dateInputMonth').val() + '-' + $('#dateInputDay').val();

        $('#lertx').remove(); //очистить ошибки если их нет
        calculateOPV(datestring);        
    }
}


function sumDigits(n) { //cуммирует цифры числа
    let sum = 0;
    while (n) {
        digit = n % 10;
        sum += digit;
        n = (n - digit) / 10;
    }
    return sum;
}


function ttrule(z) { //22 по модулю
    z = parseInt(z);
    while (z > 22) {
        z -= 22;
    }
    if (z == 0) {
        z = 22;
    }
    return Math.abs(z);
}


function calculateOPV(x) {

    startDate = luxon.DateTime.fromFormat(x, 'yyyy-MM-dd');
    //var now = luxon.DateTime.local(); 
    
    if (startDate.isValid) { //проверка даты на валидность
        if ($('select#tableSelector option:checked').val() == 1) { //определение выбранной таблицы
            $('#contentREGRETS').css('display', 'none');
            $('#contentOPV').css('display', 'initial');
        }

        if ($('select#tableSelector option:checked').val() == 2) { //определение выбранной таблицы
            $('#contentOPV').css('display', 'none');
            $('#contentREGRETS').css('display', 'initial');
        }    

        // Рассчеты аркана
        let dayArcane = ttrule(startDate.day);
        let monthArcane = ttrule(startDate.month);
        let yearArcane = ttrule(sumDigits(startDate.year));
        // Рассчеты ОПВ и CЖ
        var OPV1 = [];
        OPV1[0] = ttrule(dayArcane - monthArcane);
        var OPV2 = [];
        var OPV3 = [];
        var KCH = ttrule(yearArcane - dayArcane);
        var KCH2 = dayArcane + (8 * monthArcane) + yearArcane;
        var IEB = ttrule(yearArcane - monthArcane);
        var OGE = dayArcane + (7 * monthArcane) + yearArcane;
        var ELS = 
        var TPE = dayArcane + monthArcane;
        var HTP = dayArcane + (9 * monthArcane) + yearArcane;
        var DTP = dayArcane + (3 * monthArcane) + yearArcane;
        var PTP = ESZ - OPV1[0];
        var TPD = TPE + monthArcane;
        var KAS = OPV1[0] - IEB;
        var ZKA = dayArcane + (2 * monthArcane) + yearArcane;
        var ZDE = dayArcane + (5 * monthArcane) + yearArcane;
        var ZES = dayArcane + yearArcane;
        var ESZ = dayArcane + monthArcane + yearArcane;
        //var PER = 
        //var TI = 6 * 
        //var TIE
        //var PRPJ
        //var ZEO
        //var ZEZE

        var REGRETS = [];
        REGRETS[0] = ttrule(REGRETSarray[ttrule(parseInt(startDate.month)) - 1][ttrule(parseInt(startDate.day)) - 1] + OPV1[0]);

        var dateCounter = [];
        dateCounter[0] = startDate;

        let i = 0;
        let intervals = 22; //количество сотен в цикле
        let cycle = 1;
        let diffInTime = [];

        $("#table1 tbody tr").remove(); // очистить таблицу перед новой датой
        $('#table1').find('tbody').append( //пишет первую дату
            '<tr>' +
            '<td colspan="2 "><h4>' + dateCounter[0].toFormat('dd.MM.yyyy') + '</h4></td>' +
            '<td colspan="4"><h4>Цикл ' + cycle + '</h3></td>' +
            '</tr>'
        );
        while (i != 220) { //Цикл заполнения таблицы
            dateCounter[i + 1] = dateCounter[i].plus({ days: 100 });
            if (i == intervals) { //отделяет 22 цикла
                intervals += 22;
                cycle += 1;
                $('#table1').find('tbody').append(
                    '<tr>' +
                    '<td colspan="2"><h4>' + dateCounter[i].year + '</h4></td>' +
                    '<td colspan="4"><h4>Цикл ' + cycle + '</h4></td>' +
                    '</tr>'
                );
            }
            OPV1[i + 1] = ttrule(OPV1[i] - 1);
            OPV2[i] = ttrule(OPV1[i] - KCH);
            OPV3[i] = ttrule(OPV1[i] + OPV2[i] + KCH + IEB);
            //считает возраст в годах и месяцах
            diffInTime[i] = dateCounter[i + 1].diff(dateCounter[0], ['years', 'months', 'days']);
            diffInTime[i].toObject();
            //cоздает таблицу ОПВ
            $('#table1').find('tbody').append(
                '<tr>' +
                '<td>' + dateCounter[i].toFormat('dd.MM.yyyy') + ' – ' + dateCounter[i + 1].toFormat('dd.MM.yyyy') + '</td>' +
                '<td>' + diffInTime[i].years.toFixed(0) + ', ' + diffInTime[i].months.toFixed(0) + ', ' + diffInTime[i].days.toFixed(0) + '</td>' +
                '<td>' + OPV1[i] + '</td>' + '<td>' + OPV2[i] + '</td>' + '<td>' + OPV3[i] + '</td>' +
                '</tr>'
            );
            i = i + 1;
        }

        let j = 0;
        let k = 0;
        //cоздает таблицу СЖ
        $("#table2 tbody tr").remove();
        while (j < REGRETSage.length) {
            REGRETS[k + 1] = ttrule(REGRETS[k] + 1);
            $('#table2').find('tbody').append(
                '<tr>' +
                '<td>' + dateCounter[0].plus({ years: REGRETSage[j].split(",")[0], month: REGRETSage[j].split(",")[1] }).toFormat('dd.MM.yyyy') +
                ' – ' +
                dateCounter[0].plus({ years: REGRETSage[j + 1].split(",")[0], month: REGRETSage[j + 1].split(",")[1] }).toFormat('dd.MM.yyyy') +
                '<td>' + REGRETSage[j] + ' – ' + REGRETSage[j + 1] + '</td>' +
                '<td>' + REGRETS[k] + '</td>' +
                '</tr>'
            );
            j = j + 2;
            k = k + 1;
        }



    } else {
        $('#alerts').prepend( //текст ошибки даты
            '<div id="lertx" class="alert alert-light alert-dismissible fade show" role="alert">' +
            'Дата введена некорректно.' +
            '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
            '</div>');
    }
}


function savePDF() {
    var doc = new jsPDF();

    doc.autoTable({ html: '#table1' });
    doc.autoTable({ html: '#table2' });
    doc.save(startDate.toFormat('dd.MM.yyyy') + '.pdf');
}