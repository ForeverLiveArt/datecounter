var DateTime = luxon.DateTime;
var Dateimp = luxon.DateTime.fromISO;
var Duration = luxon.Duration;
var Durimp = luxon.Duration.fromISO;
var startDate = 0;


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
        //______________________________________________________________________SERVER REQUEST

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dateString })
        };
        const response = await fetch('/kids_api', options);
        const answer = await response.json();
        //______________________________________________________________________
        //______________________________________________________________________FIRST TABLE

        let i = 0;
        let intervals = 22; //количество сотен в цикле
        let cycle = 1;

        $('#myTabContent').css('display', 'none');
        $('#spinners').css('display', 'initial');

        $("#table1 tbody tr").remove(); // очистить таблицу перед новой датой

        $('#table1').find('tbody').append( //пишет первую дату
            '<tr>' +
            '<td colspan="2 "><h4>' + Dateimp(answer.dateCounter[0]).toFormat('dd.MM.yyyy') + '</h4></td>' +
            '<td colspan="4"><h4>Цикл ' + cycle + '</h3></td>' +
            '</tr>'
        );

        //cюда добавить первое описание

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

        for (let k = 0, j = 0; j < answer.regretsAge.length; k++, j = j + 2) {
            $('#table2').find('tbody').append(
                '<tr data-bs-toggle="collapse"' +
                    'data-bs-target="#collapseExample' + k + '"' +
                    'aria-expanded="false"' +
                    'aria-controls="collapseExample' + k + '">' +
                        '<td>' + startDate.plus({ years: answer.regretsAge[j].split(",")[0], month: answer.regretsAge[j].split(",")[1] }).toFormat('dd.MM.yyyy') +
                        ' – ' + startDate.plus({ years: answer.regretsAge[j + 1].split(",")[0], month: answer.regretsAge[j + 1].split(",")[1] }).toFormat('dd.MM.yyyy') +
                        '<td>' + answer.regretsAge[j] + ' – ' + answer.regretsAge[j + 1] + '</td>' +
                        '<td>' + answer.regrets[k] + '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td colspan="3" class="collapse multi-collapse mt-3" id="collapseExample' + k + '">' +
                        '<div class="fs-6 p-3" ><article class="readmore">' +
                            regretsTextArray[answer.regrets[k]] +
                        '</article></div>' +
                    '</td>' +
                '</tr>'
            );
        }
        //_____________________________________________________________________

        $readMoreJS.init({
              target: '.readmore', 
              numOfWords: 45,     
              // If true, user can toggle between 'read more' and 'read less'. 
              toggle: true,              
              moreLink: 'читать далее ...', 
              lessLink: 'свернуть',      
              // The class given to the read more link. 
              linkClass: 'rm-link',    
              // The class given to the div container of the read more link.
              containerClass: false
        });    
        //_____________________________________________________________________CONTROL DISPLAY OPTIONS
        $('#spinners').css('display', 'none');
        $('#myTabContent').css('display', 'initial');
        $('#tabulation').css('display', 'initial');
        //_____________________________________________________________________


    } else {
        $('#spinners').css('display', 'none');
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



