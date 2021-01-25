var startDate = 0;
var REGRETSage = ["0,0", "0,9", "0,10", "2,3", "2,4", "4,6", "4,7", "7,6", 
                  "7,6", "11,2", "11,3", "15,8", "15,9", "20,11", "20,12", "26,11", 
                  "26,12", "33,8", "33,9", "41,2", "41,3", "49,5", "49,6", "58,5", 
                  "58,6", "68,2", "68,3", "78,8", "78,9", "89,11", "89,12", "101,0"];

document.getElementById("ddlLanguage").addEventListener("change", function() {
    //language change
});


function moveOnMax(field, nextFieldID) {

    if (field.value.length >= field.maxLength) {
        document.getElementById(nextFieldID).focus();    
        } 
}


function checkDate() { //валидация ввода
    if (($('#dateInputYear').val().length !== 0) && ($('#dateInputMonth').val().length !== 0) && ($('#dateInputDay').val().length !== 0)) {
        datestring = $('#dateInputYear').val() + '-' + $('#dateInputMonth').val() + '-' + $('#dateInputDay').val();
        $('#lertx').remove(); //очистить ошибки если их нет

        if ($('select#tableSelector option:checked').val() == 1) { //определение выбранной таблицы
            $('#contentREGRETS').css('display', 'none');    
            $('#contentOPV').css('display', 'initial');    
        } 

        if ($('select#tableSelector option:checked').val() == 2) { //определение выбранной таблицы
            $('#contentOPV').css('display', 'none');
            $('#contentREGRETS').css('display', 'initial');
        }

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
    var now = luxon.DateTime.local();
    // Рассчеты аркана
    var dayArcane = ttrule(startDate.day);
    var monthArcane = ttrule(sumDigits(startDate.month));
    var yearArcane = ttrule(sumDigits(startDate.year));
    // Рассчеты ОПВ и сожаления
    var OPV1 = [0];
    OPV1[0] = ttrule(dayArcane - monthArcane);
    var OPV2 = [0];
    var OPV3 = [0];
    var KCH = ttrule(yearArcane - dayArcane);
    var IEB = ttrule(yearArcane - monthArcane);
    var REGRETS = [0];
    REGRETS[0] = ttrule(dayArcane + (OPV1[0] * 2));

    var dateCounter = [0];
    dateCounter[0] = startDate;

    let i = 0;
    let j = 0;
    let k = 0;
    let intervals = 22; //количество сотен в цикле
    let cycle = 1;
    let diffInTime = [0];

    if (startDate.isValid) { //проверка даты на валидность

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
            diffInTime[i] = dateCounter[i + 1].diff(dateCounter[0], ['years', 'months']);
            diffInTime[i].toObject(); 

            //cоздает таблицу ОПВ
            $('#table1').find('tbody').append (
                '<tr>' +
                    '<td>' + dateCounter[i].toFormat('dd.MM.yyyy') + ' – ' + dateCounter[i + 1].toFormat('dd.MM.yyyy') + '</td>' +
                    '<td>' + diffInTime[i].years.toFixed(0) + ', ' + diffInTime[i].months.toFixed(0) + '</td>' +
                    '<td>' + OPV1[i] + '</td>' + '<td>' + OPV2[i] + '</td>' + '<td>' + OPV3[i] + '</td>' + 
                '</tr>'
            );
            i = i + 1;
        }
        //cоздает таблицу СЖ
        $("#table2 tbody tr").remove();
        while (j < REGRETSage.length)  {
            REGRETS[k + 1] = ttrule(REGRETS[k] + 1);
            $('#table2').find('tbody').append (
                '<tr>' +
                    '<td>' + dateCounter[0].plus({ years: REGRETSage[j].split(",")[0], month: REGRETSage[j].split(",")[1] }).toFormat('dd.MM.yyyy') + 
                            ' – ' 
                           + dateCounter[0].plus({ years: REGRETSage[j + 1].split(",")[0], month: REGRETSage[j + 1].split(",")[1] }).toFormat('dd.MM.yyyy') +
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
            'Дата вверна некорректно.' +
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