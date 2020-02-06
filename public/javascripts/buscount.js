$(document).ready(function(){
  $('.count').keyup(function(){
       var $row = $(this).closest('tr');
       var bus = $row.find('.busno').text();
       var count = $row.find('.count').val();
       var Time = $row.find('.time').text();
        if(count.length==2){
          $.post('/buscount', {"strength":count,"busno":bus,"Intime":Time}, function(data){
             $row.css('display','none')
             // location.reload('/BusStrength')
          });
        }
  });  

});
