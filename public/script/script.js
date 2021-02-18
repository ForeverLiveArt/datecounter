let DateTime = luxon.DateTime;
let Dateimp = luxon.DateTime.fromISO;
let Duration = luxon.Duration;
let Durimp = luxon.Duration.fromISO;
let startDate = 0;


//______________________________________________________________________AUTO TAB FIELDS

function leadingZeros(input) {
    if(!isNaN(input.value) && input.value.length === 1) {
      input.value = '0' + input.value;
    }
}

function moveOnMax(field, nextFieldID) {
    if (field.value.length >= field.maxLength) {
        document.getElementById(nextFieldID).focus();
    }
}

//______________________________________________________________________
//______________________________________________________________________DATE FIRST VALIDATION

function checkDate() { //валидация ввода
    if (($('#dateInputYear').val().length > 1) && ($('#dateInputMonth').val().length > 1) && ($('#dateInputDay').val().length > 1)) {
        let dateString = $('#dateInputYear').val() + '-' + $('#dateInputMonth').val() + '-' + $('#dateInputDay').val();
        let nameString = $('#nameString').val();
        let langString = $('#langString').val();
        $('#lertx').remove(); //очистить ошибки если их нет
        calculateOPV(dateString, nameString, langString);
    }
}

//______________________________________________________________________
//______________________________________________________________________MAIN FUNC

async function calculateOPV(dateString, nameString, langString) {
    startDate = DateTime.fromFormat(dateString, 'yyyy-MM-dd');
    //var now = luxon.DateTime.local(); 
    if (startDate.isValid) { //проверка даты на валидность

        //______________________________________________________________________SERVER REQUEST
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dateString, nameString, langString })
        };
        const response = await fetch('/api', options);
        const answer = await response.json();

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

        $("#regrets_container").empty();

        $("#regrets_container").append(
            '<h4>Знак сожалений — ' + answer.regrets[0] +'</h4>' +
            '<article class="readmore">' + regretsTextArray[answer.regrets[0]] + '</article>'
        );

        $("#table2 tbody tr").remove();

        for (let k = 0, j = 0; j < answer.regretsAge.length; k++, j = j + 2) {
            $('#table2').find('tbody').append(
                '<tr>' +
                        '<td>' + startDate.plus({ years: answer.regretsAge[j].split(",")[0], month: answer.regretsAge[j].split(",")[1] }).toFormat('dd.MM.yyyy') +
                        ' — ' + startDate.plus({ years: answer.regretsAge[j + 1].split(",")[0], month: answer.regretsAge[j + 1].split(",")[1] }).toFormat('dd.MM.yyyy') +
                        '<td>' + answer.regretsAge[j] + ' — ' + answer.regretsAge[j + 1] + '</td>' +
                        '<td>' + answer.regrets[k] + '</td>' +
                '</tr>'
            );
        }

        //_____________________________________________________________________THIRD TABLE
        $("#table3 tbody tr").remove();
        $('#table3').find('tbody').append(
            (answer.nameArcane == 0 ? 
                '<tr><td>Аркан Имени</td><td>Введите имя</td>' +
                '<tr><td>ПР</td><td>—</td>' +
                '<tr><td>ТИ</td><td>—</td>' +
                '<tr><td>ЗО</td><td>—</td>' +
                '<tr><td>ЗЗ</td><td>—</td>'
                : 
                '<tr><td>Аркан Имени</td><td>' + answer.nameArcane + '</td>' +
                '<tr><td>ПР</td><td>' + answer.per + '</td></tr>' +
                '<tr><td>ТИ</td><td>' + answer.tie + '</td></tr>' +
                '<tr><td>ЗО</td><td>' + answer.zeo + '</td></tr>' +
                '<tr><td>ЗЗ</td><td>' + answer.zez + '</td></tr>') +
            '<tr><td>ОПВ 1</td>' + '<td>' + answer.opv1[0] + '</td></tr>' +
            '<tr><td>ОПВ 2</td>' + '<td>' + answer.opv2[0] + '</td></tr>' +
            '<tr><td>ОПВ 3</td>' + '<td>' + answer.opv3[0] + '</td></tr>' +
            '<tr><td>КЧХ 1</td>' + '<td>' + answer.kch + '</td></tr>' +
            '<tr><td>КЧХ 2</td>' + '<td>' + answer.kch2 + '</td></tr>' +
            '<tr><td>ЭБ</td>' + '<td>' + answer.ieb + '</td></tr>' +
            '<tr><td>ОГ</td>' + '<td>' + answer.oge + '</td></tr>' +
            '<tr><td>ЛС</td>' + '<td>' + answer.els + '</td></tr>' +
            '<tr><td>ТП</td>' + '<td>' + answer.tpe + '</td></tr>' +
            '<tr><td>ЧТП</td>' + '<td>' + answer.htp + '</td></tr>' +
            '<tr><td>ДТП</td>' + '<td>' + answer.dtp + '</td></tr>' +
            '<tr><td>ПТП</td>' + '<td>' + answer.ptp + '</td></tr>' +
            '<tr><td>ТПД</td>' + '<td>' + answer.tpd + '</td></tr>' +
            '<tr><td>КС</td>' + '<td>' + answer.kas + '</td></tr>' +
            '<tr><td>ЗК</td>' + '<td>' + answer.zka + '</td></tr>' +
            '<tr><td>ЗД</td>' + '<td>' + answer.zde + '</td></tr>' +
            '<tr><td>ЗС</td>' + '<td>' + answer.zes + '</td></tr>' +
            '<tr><td>СЗ</td>' + '<td>' + answer.esz + '</td></tr>' +
            '<tr><td>Т</td>' + '<td>' + answer.tii + '</td></tr>' +
            '<tr><td>ПрПж</td>' + '<td>' + answer.prpj + '</td></tr>'      
        );

        //_____________________________________________________________________
        $readMoreJS.init({
            target: '.readmore', 
            numOfWords: 25,     
            // If true, user can toggle between 'read more' and 'read less'. 
            toggle: true,              
            moreLink: 'Читать далее ↓', 
            lessLink: 'Cвернуть ↑',      
            // The class given to the read more link. 
            linkClass: 'btn btn-outline-primary',    
            // The class given to the div container of the read more link.
            containerClass: 'readmorecls'
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



