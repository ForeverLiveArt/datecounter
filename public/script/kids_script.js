var DateTime = luxon.DateTime;
var Dateimp = luxon.DateTime.fromISO;
var Duration = luxon.Duration;
var Durimp = luxon.Duration.fromISO;
var startDate = 0;


//______________________________________________________________________AUTO TAB FIELDS

function leadingZeros(input) {
    if(!isNaN(input.value) && input.value.length === 1) {
      input.value = '0' + input.value;
    }
  }

function moveOnMax(field, nextFieldID) {
    if (field.value.length === field.maxLength) {
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
        $("#learnage_container").empty();

        $("#learnage_container").append(
            '<h4>Возраст начала обучения: '+ answer.opv1[0]*0.27 + '</h4>'
        );

        $('#table1').find('tbody').append( //пишет первую дату и столбец

            '<tr data-bs-toggle="collapse" id="tr_slide0"' +
            'data-bs-target="#accord0"' +
            'aria-controls="accord0">' +
                    '<td>' + Dateimp(answer.dateCounter[i]).toFormat('dd.MM.yyyy') + ' – ' +
                            Dateimp(answer.dateCounter[i + 1]).toFormat('dd.MM.yyyy') + '</td>' +
                    '<td>' + Durimp(answer.diffInTime[i]).years.toFixed(0) + ', ' +
                            Durimp(answer.diffInTime[i]).months.toFixed(0) + ', ' +
                            Durimp(answer.diffInTime[i]).days.toFixed(0) + '</td>' +
                    '<td>' + answer.opv1[i] + '</td>' +
            '</tr>' +
            '<tr>' +
                '<td colspan="3" class="collapse show multi-collapse mt-3" data-bs-parent="#table1" id="accord0">' +
                    '<div class="fs-6 p-3" style="background-color:white!important;">' +
                        '<h3>Знак ' + answer.opv1[i] + '</h3>' +
                        '<article class="readmore">' +
                        kidsTextArray[0][answer.opv1[i]] +
                    '</article><a href="#tr_slide' + i + '" role="button" data-bs-toggle="collapse"' +
                    'data-bs-target="#accord1"' +
                    'aria-controls="#accord1" type="button" class="btn btn-outline-primary scroller">Следующий знак →</a></div>' +
                '</td>' +
            '</tr>'            
        );
        i = i + 1;

        while (i != 22) { //Цикл заполнения таблицы
           
            $('#table1').find('tbody').append( //cоздает таблицу ОПВ
            '<tr data-bs-toggle="collapse" id="tr_slide' + i + '"' +
                'data-bs-target="#accord' + i + '"' +
                'aria-expanded="false"' +
                'aria-controls="accord' + i + '">' +
                '<td>' + Dateimp(answer.dateCounter[i]).toFormat('dd.MM.yyyy') + ' – ' +
                         Dateimp(answer.dateCounter[i + 1]).toFormat('dd.MM.yyyy') + '</td>' +
                '<td>' + Durimp(answer.diffInTime[i]).years.toFixed(0) + ', ' +
                         Durimp(answer.diffInTime[i]).months.toFixed(0) + ', ' +
                         Durimp(answer.diffInTime[i]).days.toFixed(0) + '</td>' +
                '<td>' + answer.opv1[i] + '</td>' +
            '</tr>' +
            '<tr>' +
                '<td colspan="3" class="collapse multi-collapse mt-3" data-bs-parent="#table1" id="accord' + i + '">' +
                    '<div class="fs-6 p-3" style="background-color:white!important;">' +
                    '<h3>Знак ' + answer.opv1[i] + '</h3>' +
                    '<article class="readmore">' +
                        kidsTextArray[answer.opv1[i]] +
                    '</article>' +
                    (i != 21 ?  //последняя кнопка ведет на первый знак
                        '<a href="#tr_slide' + i + '" role="button" data-bs-toggle="collapse"' +
                        'data-bs-target="#accord' + (i + 1) + '"' +
                        'aria-controls="#accord' + (i + 1) + '" type="button" class="btn btn-outline-primary scroller">Следующий знак →</a></div>'
                        : 
                        '<a href="#table1" role="button" data-bs-toggle="collapse"' +
                        'data-bs-target="#accord0"' +
                        'aria-controls="#accord0" type="button" class="btn btn-outline-primary scroller">Первый знак →</a></div>') +
                '</td>' +
            '</tr>'
            );
            i = i + 1;
        }

        //______________________________________________________________________
        //______________________________________________________________________SECOND TABLE

        $("#regrets_container").empty();

        $("#regrets_container").append(
            '<h4>Знак сожалений ребёнка — ' + answer.regrets +'</h4>' +
            '<article>' + regretsTextArray[answer.regrets] + '</article>'
        );

        //_____________________________________________________________________

        $readMoreJS.init({
              target: '.readmore', 
              numOfWords: 45,     
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
        $('.scroller').click(function() { //следующий знак прокрутка страницы
            let sectionTo = $(this).attr('href');
            $.scrollTo(sectionTo);

        });

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



