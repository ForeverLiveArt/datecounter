var DateTime = luxon.DateTime;
var Dateimp = luxon.DateTime.fromISO;
var Duration = luxon.Duration;
var Durimp = luxon.Duration.fromISO;
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

const regretsAge = ["0,0", "0,9", "0,10", "2,3", "2,4", "4,6", "4,7", "7,6",
                    "7,6", "11,2", "11,3", "15,8", "15,9", "20,11", "20,12",
                    "26,11", "26,12", "33,8", "33,9", "41,2", "41,3", "49,5",
                    "49,6", "58,5", "58,6", "68,2", "68,3", "78,8", "78,9",
                    "89,11", "89,12", "101,0"
];
//_____________________________________________________________________

//_____________________________________________________________________GENERATE regrets FIXED TABLE

var regretsArray = [];
function makeRegretsArray() {
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

//______________________________________________________________________AUTO TAB FIELDS

function moveOnMax(field, nextFieldID) {
    if (field.value.length >= field.maxLength) {
        document.getElementById(nextFieldID).focus();
    }
}

//______________________________________________________________________

//______________________________________________________________________DATE FIRST VALIDATION

function checkDate() { //валидация ввода
    if (($('#dateInputYear').val().length > 1) && ($('#dateInputMonth').val().length > 1) && ($('#dateInputDay').val().length > 1)) {
        datestring = $('#dateInputYear').val() + '-' + $('#dateInputMonth').val() + '-' + $('#dateInputDay').val();

        $('#lertx').remove(); //очистить ошибки если их нет
        calculateOPV(datestring);
    }
}

//______________________________________________________________________

//______________________________________________________________________MAIN FUNC

async function calculateOPV(dateString) {
    startDate = DateTime.fromFormat(dateString, 'yyyy-MM-dd');
    //var now = luxon.DateTime.local(); 
    if (startDate.isValid) { //проверка даты на валидность
        if ($('select#tableSelector option:checked').val() == 1) { //определение выбранной таблицы
            $('#contentregrets').css('display', 'none');
            $('#contentOPV').css('display', 'initial');
        }
        if ($('select#tableSelector option:checked').val() == 2) { //определение выбранной таблицы
            $('#contentOPV').css('display', 'none');
            $('#contentregrets').css('display', 'initial');
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dateString })
        };

        //______________________________________________________________________SERVER REQUEST

        const response = await fetch('/api', options);
        const answer = await response.json();

        //______________________________________________________________________

        //______________________________________________________________________FIRST TABLE

        let i = 0;
        let intervals = 22; //количество сотен в цикле
        let cycle = 1;

        $("#table1 tbody tr").remove(); // очистить таблицу перед новой датой

        $('#table1').find('tbody').append( //пишет первую дату
            '<tr>' +
            '<td colspan="2 "><h4>' + Dateimp(answer.dateCounter[0]).toFormat('dd.MM.yyyy') + '</h4></td>' +
            '<td colspan="4"><h4>Цикл ' + cycle + '</h3></td>' +
            '</tr>'
        );

        while (i != 220) { //Цикл заполнения таблицы
            if (i == intervals) { //отделяет 22 цикла
                intervals += 22;
                cycle += 1;
                $('#table1').find('tbody').append(
                    '<tr>' +
                    '<td colspan="2"><h4>' + DateTime.fromISO(answer.dateCounter[i]).year + '</h4></td>' +
                    '<td colspan="4"><h4>Цикл ' + cycle + '</h4></td>' +
                    '</tr>'
                );
            }
            
            $('#table1').find('tbody').append( //cоздает таблицу ОПВ
                '<tr>' +
                '<td>' + Dateimp(answer.dateCounter[i]).toFormat('dd.MM.yyyy') + ' – ' +
                Dateimp(answer.dateCounter[i + 1]).toFormat('dd.MM.yyyy') + '</td>' +
                '<td>' + Durimp(answer.diffInTime[i]).years.toFixed(0) + ', ' +
                Durimp(answer.diffInTime[i]).months.toFixed(0) + ', ' +
                Durimp(answer.diffInTime[i]).days.toFixed(0) + '</td>' +
                '<td>' + answer.opv1[i] + '</td>' + '<td>' + answer.opv2[i] + '</td>' + '<td>' + answer.opv3[i] + '</td>' +
                '</tr>'
            );
            i = i + 1;
        }
        //______________________________________________________________________

        //______________________________________________________________________SECOND TABLE

        $("#table2 tbody tr").remove();

        for (let k = 0, j = 0; j < regretsAge.length; k++, j = j + 2) {
            $('#table2').find('tbody').append(
                '<tr>' +
                '<td>' + startDate.plus({ years: regretsAge[j].split(",")[0], month: regretsAge[j].split(",")[1] }).toFormat('dd.MM.yyyy') +
                 ' – ' + startDate.plus({ years: regretsAge[j + 1].split(",")[0], month: regretsAge[j + 1].split(",")[1] }).toFormat('dd.MM.yyyy') +
                '<td>' + regretsAge[j] + ' – ' + regretsAge[j + 1] + '</td>' +
                '<td>' + answer.regrets[k] + '</td>' +
                '</tr>'
            );
        }
        //______________________________________________________________________

    } else {
        $('#alerts').prepend( //текст ошибки даты
            '<div id="lertx" class="alert alert-light alert-dismissible fade show" role="alert">' +
            'Дата введена некорректно.' +
            '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
            '</div>');
    }
}

/*function savePDF() {
    var doc = new jsPDF();

    doc.autoTable({ html: '#table1' });
    doc.autoTable({ html: '#table2' });
    doc.save(startDate.toFormat('dd.MM.yyyy') + '.pdf');
}*/