// variables
NUM_COLORS = 3;
MAX_SUM = 10;
GREEN_PERCENT = [];
GUESS_LEEWAY = 5;
PAYMENT_SCHEME = 'increasing';

var colors_hex = ['#9F9', '#FF9', '#66B2FF'];
var color_labels = ['green', 'yellow', 'blue'];
var attempts = [];

// chart

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);
function drawChart() {

  for (var i = 0; i < 5; i++) {
    var data = google.visualization.arrayToDataTable(randomDist(MAX_SUM, NUM_COLORS, i));

    var options = {
      enableInteractivity: false,
      pieSliceText: 'none',
      legend: {
        position: 'none'
      },
      colors: colors_hex,
      chartArea: {
        width: '100%',
        height: '100%',
      },
      pieStartAngle: Math.floor(Math.random() * 360)
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart' + i.toString()));
    chart.draw(data, options);
  }
  
}

// put distribution in format of google charts
function randomDist (max, thecount, id) {

  var dist = generate(max, thecount);
  var random_dist = [['color', 'portion']];

  for (var i = 0; i < dist.length; i++) {
    random_dist.push([color_labels[i], dist[i]]);
    if (color_labels[i] == 'green') {
      GREEN_PERCENT[id] = dist[i] * 10;
    }
  }

  console.log('random_dist',random_dist);
  return random_dist;

}

// generate a list of n random numbers sum = 10
// From StackExchange, Generating n unique random numbers with a specific sum
function generate(t, n) {

  var max = n*(n+1)/2;
  var list = [], sum = 0, i = n;
  while(i--){
    var r = Math.random();
    list.push(r);
    sum += r;
  }
  var factor = t / sum;
  sum = 0;
  i = n;
  while(--i){
    list[i] = parseInt(factor * list[i], 10);
    sum += list[i];
  }
  list[0] = t - sum;
  console.log('list', list);
  return list;
}

// page handling code

// check if guess is correct!
function checkGuess(id) {

  // adjust attempts text
  var loc = $('#attempt-text');
  loc.text(parseInt(loc.text(), 10) + 1);

  // adjust payment text
  $('#plus-text').text('');
  $('#minus-text').text('');

  // check if this is within the correct bounds
  var val = $('#guess' + id).val();
  console.log(val, GREEN_PERCENT[id] + GUESS_LEEWAY, GREEN_PERCENT[id] - GUESS_LEEWAY);
  var is_correct = false;
  if (val <= GREEN_PERCENT[id] + GUESS_LEEWAY &&
      val >= GREEN_PERCENT[id] - GUESS_LEEWAY) {
    is_correct = true;
  }

  attempts.push(is_correct);

  // adjust payment based outcome
  adjustPayment(is_correct, PAYMENT_SCHEME);

  // disable the current pie chart and enable the next
  var j = id.toString();
  var k = (id + 1).toString();

  console.log(j,k);

  $('#guess' + j).prop('disabled', true);
  $('#guessbutton' + j).prop('disabled', true);

  $('#guess' + k).prop('disabled', false);
  $('#guessbutton' + k).prop('disabled', false);

  // drawChart();
  if (id == 4) {
    $('#try-button').show();
  }

}

function adjustPayment(is_correct, payment_scheme) {

  var loc = $('#payment-text');
  var val = parseFloat(loc.text());

  // if correct and increasing scheme
  if (payment_scheme == 'increasing' && is_correct) {

    var n = attempts.length;
    var change_in = 0.1 * Math.pow(0.8, n);
    $('#plus-text').text('+' + change_in.toFixed(4));
    loc.text((change_in + val).toFixed(4));

    // TODO: track change in payment 
    // (well this can be inferred by payment, is necessary?)

  }
  // if incorrect and decreasing scheme
  else if (payment_scheme == 'decreasing' && !is_correct) {

    // TODO: track change in payment

  }

}

function tryAnotherFive() {
  drawChart();

  for (var i = 0; i < 5; i++) {
    var j = i.toString();
    $('#guess' + j).val('');
  }

  $('#guess0').prop('disabled', false);
  $('#guessbutton0').prop('disabled', false);
}
