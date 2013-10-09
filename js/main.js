google.load("visualization", "1", {packages:["corechart"], 'language': 'ja'});
google.setOnLoadCallback(chart_this);
function chart_this(){
  $.getJSON("js/employees.json",function(data){
    employee_data = data;
    array_data = [];
    sorted_for_total = _.sortBy(employee_data, function(item){ return item.employees}).reverse();
    $.each(sorted_for_total, function(i, item) {
      console.log(item);
      array_data.push([item.short_name,item.employees,""+item.name+" employees: "+item.employees.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")]);
    });
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Department');
    data.addColumn('number', 'Employees')
    data.addColumn({type: 'string', role: 'tooltip'});
    data.addRows(array_data);

    var options = {
      title: 'Total Employees (Logarithmic Scale)',
      vAxis: {title: 'Department',  titleTextStyle: {color: 'black'}},
      height: 800,
      hAxis: { logScale: true },
      colors:['slategray']
    };

    var chart = new google.visualization.BarChart(document.getElementById('employees_chart'));
    chart.draw(data, options);
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this).scrollspy('refresh')
    });
  });
}

function workingDaysBetweenDates(startDate, endDate) {

    // Validate input
    if (endDate < startDate)
        return 0;

    // Calculate days between dates
    var millisecondsPerDay = 86400 * 1000; // Day in milliseconds
    startDate.setHours(0,0,0,1);  // Start just after midnight
    endDate.setHours(23,59,59,999);  // End just before midnight
    var diff = endDate - startDate;  // Milliseconds between datetime objects
    var days = Math.ceil(diff / millisecondsPerDay);

    // Subtract two weekend days for every week in between
    var weeks = Math.floor(days / 7);
    var days = days - (weeks * 2);

    // Handle special cases
    var startDay = startDate.getDay();
    var endDay = endDate.getDay();

    // Remove weekend not previously removed.
    if (startDay - endDay > 1)
        days = days - 2;

    // Remove start day if span starts on Sunday but ends before Saturday
    if (startDay == 0 && endDay != 6)
        days = days - 1

    // Remove end day if span ends on Saturday but starts after Sunday
    if (endDay == 6 && startDay != 0)
        days = days - 1

    return days;
}