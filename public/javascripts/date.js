$(document).ready(function(){
  $('#generate').on('click', function(){
    var from = new Date($('#from').val());
    day = from.getDate();
    month = from.getMonth() + 1;
    year = from.getFullYear();
    var fromdata=(day<10 ? '0' : '') + day + "-" + (month<10 ? '0' : '') + month + '-'+ year;
    var to = new Date($('#to').val());
    day=to.getDate();
    month=to.getMonth()+1;
    year=to.getFullYear();
    var todata=(day<10 ? '0' : '') + day + "-" + (month<10 ? '0' : '') + month + '-'+ year;
    $.post('/report',{fromdate:fromdata,todate:todata},function(data){
        var stringified = JSON.stringify(data);
        $.each(JSON.parse(stringified), function(idx, obj) {
        var listtable = $('.report').DataTable();
        listtable.row.add([
            obj.BusNo,
            obj.Status,
            obj.Date,
            obj.Time
        ]).draw(false);
      }); 
    });
  });
});