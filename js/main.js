google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(chart_this);
function chart_this(){
  $.getJSON("js/employees.json",function(data){
    employee_data = data;
    array_data = [];
    array_data.push(["Department", "Employees", "Furloughed"]);
    sorted_for_total = _.sortBy(employee_data, function(item){ return item.furloughed}).reverse();
    $.each(sorted_for_total, function(i, item) {
      array_data.push([item.short_name,item.employees,item.furloughed]);
    });
    var data = google.visualization.arrayToDataTable(array_data);

    var options = {
      title: 'Furloughed Employees',
      vAxis: {title: 'Department',  titleTextStyle: {color: 'red'}},
      height: 800,
      hAxis: { logScale: true }
    };

    var chart = new google.visualization.BarChart(document.getElementById('employees_chart'));
    chart.draw(data, options);
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this).scrollspy('refresh')
    });
  });
}


// requires chart.js
// var bar_chart;
// function chart_this(){
//   var ctx = document.getElementById("employees_chart").getContext("2d");
//   var bar_labels = []
//   var total_employees = []
//   var furloughed_employees = []
//   sorted_for_total = _.sortBy(employee_data, function(item){ return item.furloughed});
//   $.each(sorted_for_total, function(i, item) {
//     bar_labels.push(item.short_name);
//     total_employees.push(item.employees);
//     furloughed_employees.push(item.furloughed);
//   });
//   var bar_data = {
//     labels : bar_labels,
//     datasets : [
//       {
//         fillColor : "rgba(151,187,205,0.5)",
//         strokeColor : "rgba(151,187,205,1)",
//         data : furloughed_employees
//       }
//     ]
//   }
//   console.log(bar_data);
//   bar_chart = new Chart(ctx).Bar(bar_data);
// }