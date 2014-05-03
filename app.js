$(window).load(function() {
  $('#beginGameModal').modal('show');
});

// variables
NUM_COLORS = 3;
MAX_SUM = 10;
GREEN_PERCENT = [];
GUESS_LEEWAY = 5;
PAYMENT_SCHEME = 'decreasing_step';

var colors_hex = ['#9F9', '#FF9', '#66B2FF'];
var color_labels = ['green', 'yellow', 'blue'];
var attempts = [];

// chart

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

function drawChart() {
  drawChart_id(0);

  if (PAYMENT_SCHEME == 'decreasing' ||
    PAYMENT_SCHEME == 'decreasing_step') {
    $('#payment-text').text(getPaymentUpTo(5).toFixed(4));
  }
}

function drawChart_id(i) {

  // for (var i = 0; i < 5; i++) {
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
  // }
  
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

  // drawChart();
  if (id == 4) {

    $('#try-button').show();

  } else {

    $('#guess' + k).prop('disabled', false);
    $('#guessbutton' + k).prop('disabled', false);

    $('#piechartdiv' + k).show();
    drawChart_id(id + 1);

  }

}

function adjustPayment(is_correct, payment_scheme) {

  var loc = $('#payment-text');
  var val = parseFloat(loc.text());

  var n = getNumCorrect(attempts);

  var change_in = getPayment(n);
  var change_in_text = change_in.toFixed(4);

  // if correct and increasing scheme
  if (payment_scheme == 'increasing' ||
    payment_scheme == 'increasing_step' &&
    is_correct) {

    $('#plus-text').text('+' + change_in_text);
    loc.text((change_in + val).toFixed(4));

    // TODO: track change in payment 
    // (well this can be inferred by payment, is necessary?)

  }
  // if incorrect and decreasing scheme
  else if (payment_scheme == 'decreasing' ||
    payment_scheme == 'decreasing_step' &&
    !is_correct) {

    // TODO: track change in payment
    $('#minus-text').text('-' + change_in_text);
    loc.text((val - change_in).toFixed(4));

  }

}

function getNumCorrect(end) {

  var n = 0;

  for (var i = 0; i < lst.length; i++) {
    if (lst[i]) {
      n++;
    }
  }

  return n;

}

function getPayment(n) {

  if (PAYMENT_SCHEME == 'increasing' ||
    PAYMENT_SCHEME == 'decreasing') {
    return 0.1 * Math.pow(0.8, n);
  }
  else if (PAYMENT_SCHEME == 'increasing_step' ||
    PAYMENT_SCHEME == 'decreasing_step') {
    if (0 <= n == n <= 5) { return 0.03; }
    else if (5 < n == n <= 10) { return 0.025; }
    else if (10 < n == n <= 15) { return 0.02; }
    else if (15 < n == n <= 20) { return 0.015; }
    else if (20 < n == n <= 25) { return 0.01; }
    else if (25 < n == n <= 30) { return 0.005; }
    else if (30 < n == n <= 35) { return 0.004; }
    else if (35 < n == n <= 40) { return 0.003; }
    else if (40 < n == n <= 45) { return 0.002; }
    else if (45 < n ) { return 0.001; }
    else { return 0.0; }
  }

}

function getPaymentUpTo(n) {

  var sum = 0.0;
  for (var i = 0; i < n; i++) {
    sum += getPayment(i);
  }
  return sum;

}

function tryAnotherFive() {

  $('#plus-text').text('');
  $('#minus-text').text('');

  drawChart();

  for (var i = 0; i < 5; i++) {
    var j = i.toString();
    $('#guess' + j).val('');
    if (i > 0) {
      $('#piechartdiv' + j).hide();
    }
  }

  $('#guess0').prop('disabled', false);
  $('#guessbutton0').prop('disabled', false);

  $('#try-button').hide();

  if (PAYMENT_SCHEME == 'decreasing') {
    var n = getNumCorrect(attempts);
    var loc = $('#payment-text');
    var val = parseFloat(loc.text());

    loc.text(getPaymentUpTo(n + 5).toFixed(4));
  }
}

function endGame() {
  // console.log('clicked');
  // var len = attempts.length % 5;
  var n = getNumCorrect(attempts.length / 5 * 5);
  $('#end-payment').text('$' + getPaymentUpTo(n).toFixed(2));
}
