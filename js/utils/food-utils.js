google.charts.load('current', {packages: ['corechart', 'bar']});

var dataInput = [
  ['Foods'],
  ['Calories(kcals)'],
  ['Proteins(g)'],
  ['Fats(g)'],
  ['Carbohydrates(g)']
];

const nutrientChart = (foodItem, macroTotal) => {
  const nutrientData = [foodItem, macroTotal.cals, macroTotal.pros, macroTotal.fats, macroTotal.carbs];

  nutrientData.forEach((data, index) => {
    dataInput[index].push(data);
  });
  
  console.log(dataInput);
  var data = google.visualization.arrayToDataTable(dataInput);

  var options = {
    title: 'Food Macro-Nutrients of the Day',
    chartArea: {width: '50%'},
    isStacked: true,
    vAxis: {
    title: 'Macro-Nutrients'
    }
  };

  var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
  chart.draw(data, options);
} 
