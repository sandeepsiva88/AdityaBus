$(document).ready(function(){
    $('.edit1').on('click', function(){
        $(this).closest('tr').find($('.col').attr('contenteditable', 'true').css("background-color","#ccc"));
        $(this).closest('tr').find($('.col2').attr('contenteditable', 'true').css("background-color","#ccc"));
        $(this).closest('tr').find($('.col3').attr('contenteditable', 'true').css("background-color","#ccc"));
        $(this).closest('tr').find($('.col4').attr('contenteditable', 'true').css("background-color","#ccc"));
        $(this).closest('tr').find($('.col5').attr('contenteditable', 'true').css("background-color","#ccc"));
      $('.updata').show();
      
    });

    $('.updata').on('click', function(){
        alert("saved successfully")
        var id=$(this).val();
       var $row=$(this).closest('tr');
       var strength=$row.find('.col').text();
    
       var standing=$row.find('.col2').text();
    
       var intime=$row.find('.col3').text();
    
       var remarks=$row.find('.col4').text();

       var route=$row.find('.col5').text();
       
     
        $.post('/routedata', {no:id,Strength:strength,Stand:standing,Intime:intime,Remarks:remarks,Route:route}, function(data){
            
        });
    }); 
});