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
        document.getElementById(nextFieldID).value='';
        document.getElementById(nextFieldID).focus();
    }
}

//______________________________________________________________________
//______________________________________________________________________DATE FIRST VALIDATION

function checkDate() { //валидация ввода
    if (($('#dateInputYear').val().length > 1) && ($('#dateInputMonth').val().length > 1) && ($('#dateInputDay').val().length > 1)) {
        datestring = $('#dateInputYear').val() + '-' + $('#dateInputMonth').val() + '-' + $('#dateInputDay').val();
        
        calculateOPV(datestring);
    } else {
        $('#birth_date_form').removeClass( 'is-valid' ).addClass( 'is-invalid' );
        $('#main_form_button').removeClass( 'btn-primary' ).addClass( 'btn-danger' );
        $('#alerts').prepend(` 
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <span class="fas fa-bullhorn me-1"></span>
                            <strong>Внимание!</strong> Дата введена в неправильном формате
                            <button type="button" class="btn btn-close btn-sm" data-bs-dismiss="alert" aria-label="Close"><i class="fas fa-times"></i></button>
                            </div>
                            `);
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

        $('#birth_date_form').removeClass( 'is-invalid' ).addClass( 'is-valid' ); //form green
        $('#main_form_button').removeClass( 'btn-primary' ).removeClass( 'btn-danger' ).addClass( 'btn-success' ); //button green
        $('#alerts').empty(); //очистить ошибки если их нет

        $('#myTabContent').hide(); //hide old result if it was visible
        
        $('#spinners').show();


        $("#table1 tbody tr").remove(); // очистить таблицу перед новой датой
        $("#learnage_container").empty();

        $("#learnage_container").append(
            '<h5>В '+ answer.opv1[0]*0.27 + ' ваш ребёнок готов к началу обучения</h5>'
        );

        $('#table1').find('tbody').append( //пишет первую дату и столбец

            '<tr data-bs-toggle="collapse" id="tr_slide0"' +
            'data-bs-target="#accord0"' +
            'aria-controls="accord0">' +
                    '<td>Период с ' +   Dateimp(answer.dateCounter[i]).toFormat('dd.MM.yyyy') + ' до ' +
                                        Dateimp(answer.dateCounter[i + 1]).toFormat('dd.MM.yyyy') + '</td>' +

                    '<td>' + answer.opv1[i] + '</td>' +
            '</tr>' +
            '<tr class="tr_unhoverable">' +
                '<td colspan="3" class="collapse show multi-collapse mt-3" data-bs-parent="#table1" id="accord0">' +
                    '<div class="fs-6 p-0">' +
                        '<h3>Возраст ' +    Durimp(answer.diffInTime[i]).years.toFixed(0) + ', ' +
                                            Durimp(answer.diffInTime[i]).months.toFixed(0) + ', ' +
                                            Durimp(answer.diffInTime[i]).days.toFixed(0) + '</h3>' +
                        '<article class="readmore">' +
                        kidsTextArray[0][answer.opv1[i]] +
                    '</article><a href="#tr_slide' + i + '" role="button" data-bs-toggle="collapse"' +
                    'data-bs-target="#accord1"' +
                    'aria-controls="#accord1" type="button" class="btn btn-outline-secondary scroller mb-3">Следующий период →</a></div>' +
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
                '<td>Период с ' +   Dateimp(answer.dateCounter[i]).toFormat('dd.MM.yyyy') + ' до ' +
                                    Dateimp(answer.dateCounter[i + 1]).toFormat('dd.MM.yyyy') + '</td>' +
                
                '<td>' + answer.opv1[i] + '</td>' +
            '</tr>' +
            '<tr class="tr_unhoverable">' +
                '<td colspan="3" class="collapse multi-collapse mt-3" data-bs-parent="#table1" id="accord' + i + '">' +
                    '<div class="fs-6 p-0" style="background-color:white!important;">' +
                    '<h3>Возраст ' +    Durimp(answer.diffInTime[i]).years.toFixed(0) + ', ' +
                                        Durimp(answer.diffInTime[i]).months.toFixed(0) + ', ' +
                                        Durimp(answer.diffInTime[i]).days.toFixed(0) + '</h3>' +
                    '<article class="readmore">' +
                        kidsTextArray[answer.opv1[i]] +
                    '</article>' +
                    (i != 21 ?  //последняя кнопка ведет на первый знак
                        '<a href="#tr_slide' + i + '" role="button" data-bs-toggle="collapse"' +
                        'data-bs-target="#accord' + (i + 1) + '"' +
                        'aria-controls="#accord' + (i + 1) + '" type="button" class="btn btn-outline-secondary scroller mb-3">Следующий период →</a></div>'
                        : 
                        '<a href="#table1" role="button" data-bs-toggle="collapse"' +
                        'data-bs-target="#accord0"' +
                        'aria-controls="#accord0" type="button" class="btn btn-outline-secondary scroller mb-3">Первый период →</a></div>') +
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
              speed: 120,
              numOfWords: 49,     
              // If true, user can toggle between 'read more' and 'read less'. 
              toggle: true,              
              moreLink: 'Читать полностью ↓', 
              lessLink: 'Cвернуть ↑',      
              // The class given to the read more link. 
              linkClass: 'btn btn-outline-secondary mr-3 mb-3',    
              // The class given to the div container of the read more link.
              containerClass: 'readmorecls'
        });    
        //_____________________________________________________________________CONTROL DISPLAY OPTIONS
        $('#spinners').hide(200);
        $('#myTabContent').show(400);
        $('#tabulation').show(400);
        $('#result_container').show(400); //show result
        $('#spinners').hide(200); //hide spinner in the end
        //_____________________________________________________________________
        $('.scroller').on("click", function() { //следующий знак прокрутка страницы
            let sectionTo = $(this).attr('href');
            $.scrollTo(sectionTo, 800);

        });
        $('.main_form_button').on("click", function() { //следующий знак прокрутка страницы
            $.scrollTo($('result_scroll'), 800);
        });

    } else {
        $('#spinners').hide(200);
        $('#main_form_button').removeClass( 'btn-primary' ).addClass( 'btn-danger' );
        $('#birth_date_form').removeClass( 'is-valid' ).addClass( 'is-invalid' );
        $('#alerts').prepend(` 
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <span class="fas fa-bullhorn me-1"></span>
                            <strong>Внимание!</strong> Дата введена в неправильном формате
                            <button type="button" class="btn btn-close btn-sm" data-bs-dismiss="alert" aria-label="Close"><i class="fas fa-times"></i></button>
                            </div>
                            `);
    }
}

/*function savePDF() {
    var doc = new jsPDF();

    doc.autoTable({ html: '#table1' });
    doc.autoTable({ html: '#table2' });
    doc.save(startDate.toFormat('dd.MM.yyyy') + '.pdf');
}*/



