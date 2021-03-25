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
        
        if (answer.graphRes != false) {
            
            $('#myChart').css('display', 'none');
            $('#spinners').css('display', 'initial');

            $('#myChart').remove();
            $('#health_main').append('<canvas id="myChart" style="display:none;"><canvas>');

            let multiplier = answer.multiplier;
            let graphRes = answer.graphRes.map(element => Math.round((element - multiplier) * 10) / 10);
            console.log(graphRes);

            Chart.defaults.NegativeTransparentLine = Chart.helpers.clone(Chart.defaults.line);
            Chart.controllers.NegativeTransparentLine = Chart.controllers.line.extend({
            update: function() {
                // get the min and max values
                var min = Math.min.apply(null, this.chart.data.datasets[0].data);
                var max = Math.max.apply(null, this.chart.data.datasets[0].data);
                var yScale = this.getScaleForId(this.getDataset().yAxisID);

                // figure out the pixels for these and the value 0
                var top = yScale.getPixelForValue(max);
                var zero = yScale.getPixelForValue(0);
                var bottom = yScale.getPixelForValue(min);

                // build a gradient that switches color at the 0 point
                var ctx = this.chart.chart.ctx;
                var gradient = ctx.createLinearGradient(0, top, 0, bottom);
                var ratio = Math.min((zero - top) / (bottom - top), 1);
                gradient.addColorStop(0, 'rgba(60,91,87,0)');
                gradient.addColorStop(ratio, '#558b2f');
                gradient.addColorStop(ratio, '#d84315');
                gradient.addColorStop(1, 'rgba(60,91,87,0)');
                this.chart.data.datasets[0].backgroundColor = gradient;

                return Chart.controllers.line.prototype.update.apply(this, arguments);
            }
            });

            var ctx = document.getElementById("myChart").getContext("2d");


            var myLineChart = new Chart(ctx, {
            type: 'NegativeTransparentLine',
            data: {
                labels: ["00:00", "01:00", "02:00", "03:00", 
                         "04:00", "05:00", "06:00", "07:00", 
                         "08:00", "09:00", "10:00", "11:00", 
                         "12:00", "13:00", "14:00", "15:00", 
                         "16:00", "17:00", "18:00", "19:00", 
                         "20:00", "21:00", "22:00", "23:00"],
                datasets: [{
                label: "График",
                strokeColor: "rgba(60,91,87,1)",
                pointColor: "rgba(60,91,87,0)",
                pointStrokeColor: "rgba(60,91,87,0)",
                data: graphRes,
                yAxisID: "y-axis-0"
                }]
            },
            options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                // Include a dollar sign in the ticks
                                callback: function(value, index, values) {
                                        if (value != 0) {
                                    return Math.round(multiplier + value);
                                    } else {
                                    return multiplier + value;
                                    }
                                }
                            },
                            position: "left",
          			        id: "y-axis-0",
                            type: 'linear',
	                        display: true
                        }]
                    },
                }
            });

            // CONTROL DISPLAY OPTIONS
            $('#spinners').css('display', 'none');
            $('#myChart').css('display', 'initial');
            //_
        }    

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



