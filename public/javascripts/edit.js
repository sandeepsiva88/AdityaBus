$(document).ready(function(){
  $(".edit").click(function(){
    var id = $(this).val();
    //alert(id);
    $.post("/editreason",{no:id}, function(data){
      var string = JSON.stringify(data);
      var parse = JSON.parse(string);
      $("#busno").val(parse[0].BusNo);
      $('#RegisterNo').val(parse[0].RegisterNo)
      $("#status").val(parse[0].Status);
      $("#date").val(parse[0].Date);
      $("#time").val(parse[0].Time);
      $("#reason").val(parse[0].Reason);
    });
    $(".dontshow").show();
  });
});