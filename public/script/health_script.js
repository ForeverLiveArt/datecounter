let DateTime = luxon.DateTime;
let Dateimp = luxon.DateTime.fromISO;
let Duration = luxon.Duration;
let Durimp = luxon.Duration.fromISO;
let startDate = 0;



// AUTO TAB FIELDS

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
//_

// DATE FIRST VALIDATION

function checkDate() { //валидация ввода
    if (($('#dateInputYear').val().length > 1) && 
        ($('#dateInputMonth').val().length > 1) && 
        ($('#dateInputDay').val().length > 1) && 
        ($('#nameString').val().length > 1)) {
        let dateString = $('#dateInputYear').val() + '-' + $('#dateInputMonth').val() + '-' + $('#dateInputDay').val();
        let timeString = $('#dateInputHour').val() + '-' + $('#dateInputMinute').val();
        let nameString = $('#nameString').val();
        let langString = $('#langString').val();
        $('#lertx').remove(); //очистить ошибки если их нет
        calculateGraph(dateString, timeString, nameString, langString);
    }
}
//_

// MAIN FUNC

async function calculateGraph(dateString, timeString, nameString, langString) {
    startDate = DateTime.fromFormat(dateString, 'yyyy-MM-dd');
    startTime = DateTime.fromFormat(timeString, 'HH-mm');
    //var now = luxon.DateTime.local(); 
    if (startDate.isValid) { //проверка даты на валидность

        // SERVER REQUEST
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dateString, timeString, nameString, langString })
        };
        const response = await fetch('/health_api', options);
        const answer = await response.json();
        //_
        

        $('#myTabContent').css('display', 'none');
        $('#spinners').css('display', 'initial');

        //HERE GRAPH
        console.log(answer);
        
        // CONTROL DISPLAY OPTIONS
        $('#spinners').css('display', 'none');
        $('#myTabContent').css('display', 'initial');
        $('#tabulation').css('display', 'initial');
        //_


    } else {
        $('#spinners').css('display', 'none');
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
    doc.autoTable({ html: '#table3' });
    doc.save(startDate.toFormat('dd.MM.yyyy') + '.pdf');
}



