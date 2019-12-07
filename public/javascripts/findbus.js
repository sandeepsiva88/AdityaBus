$(document).ready(function(){
  
  $('#getdata').click(function(){
    var id=$('#bus').val();
    // alert(id);
      $.post('/search',{busno:id},function(data2,textStatus,jqXHR){
        var jsondata2=JSON.stringify(data2);
        // alert(jsondata2)
      $.each($.parseJSON(jsondata2),function(i,v){
        var listtable = $('#dataTables-example2').DataTable();
        listtable.row.add( [
            v.BusNo,
            v.Status,
            v.Date,
            v.Time,
          ] ).draw(false);            
        });
      });
      $(".update").show();
  });
});