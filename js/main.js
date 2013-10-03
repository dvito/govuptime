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