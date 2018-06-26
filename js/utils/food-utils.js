// google.charts.load('current', {packages: ['corechart', 'bar']});

// var dataInput = [
//   ['Foods'],
//   ['Calories(kcals)'],
//   ['Proteins(g)'],
//   ['Fats(g)'],
//   ['Carbohydrates(g)']
// ];

// const nutrientChart = (foodItem, calories, proteins, fats, carbohydrates) => {
//   const nutrientData = [foodItem, calories, proteins, fats, carbohydrates];

//   nutrientData.forEach((data, index) => {
//     console.log(dataInput[index].push(data));
//   });
  
//   var data = google.visualization.arrayToDataTable(dataInput);

//   var options = {
//     title: 'Food Macro-Nutrients of the Day',
//     chartArea: {width: '50%'},
//     isStacked: true,
//     vAxis: {
//     title: 'Macro-Nutrients'
//     }
//   };

//   var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
//   chart.draw(data, options);
// } 
