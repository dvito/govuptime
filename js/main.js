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
    data.addColumn('number', 'Employees');
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
      var $spy = $(this).scrollspy('refresh');
    });
  });
}

function workingDaysBetweenDates(startDate, endDate) {

    // Validate input
    if (endDate < startDate)
        return 0;

    // Calculate days between dates
    var millisecondsPerDay = 86400 * 1000; // Day in milliseconds
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
        
    // Remove holidays from working days
    if ((startDate < new Date("October 14, 2013 00:00:00 EDT")) && (endDate > new Date("October 14, 2013 00:00:00 EDT")))
      days = days - 1

    return days;
}

function getHoursLost() {
  var date_of_shutdown = new Date("October 01, 2013 00:00:00 EDT");

  var date_today = new Date();
  //disregard visitor's timezone and force EDT:
  var date_today_as_utc = date_today.getTime() + (date_today.getTimezoneOffset() * 60000);
  var date_today = new Date(date_today_as_utc + (3600000*-4));

  var date_yest = new Date();
  //disregard visitor's timezone and force EDT:
  var date_yest_as_utc = date_yest.getTime() + (date_yest.getTimezoneOffset() * 60000);
  var date_yest = new Date(date_yest_as_utc + (3600000*-4));
  date_yest.setDate(date_yest.getDate() - 1);

  var time_since_shutdown = (date_today - date_of_shutdown) / 1000;
  var days_since_shutdown = Math.floor(time_since_shutdown / 86400);

  if (((date_today.getDay() + 1) % 7 < 2) || (date_today.getDate() == 14 && date_today.getMonth() == 9))//Weekend or Columbus Day
     return (workingDaysBetweenDates(date_of_shutdown,date_yest))*6400000;
   else //Weekday
		return (workingDaysBetweenDates(date_of_shutdown,date_yest)-days_since_shutdown)*6400000 + Math.floor((time_since_shutdown * 800000) / 10800);
}