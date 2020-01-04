$(document).ready(function(){
       update();
  $('.count').keyup(function(){
       var $row = $(this).closest('tr');
       var bus = $row.find('.busno').text();
       var count = $row.find('.count').val();
       var id = $row.find('.id').text();
       var Time = $row.find('.time').text();
        if(count.length==2){
          $.post('/buscount', {"strength":count,"busno":bus,"TAG":id,"Intime":Time}, function(data){
             $row.css('display','none')
             location.reload('/BusStrength')
          });
        }
  });  
});

function update() {
     setTimeout(function() { location.reload("/BusStrength"); }, 35000);   
}