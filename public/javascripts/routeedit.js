$(document).ready(function(){
	$('.editdata').click(function(){
		var id=$(this).val()
		 $.post('/routeedit', {no:id}, function(docs){
		 	var StringifyData=JSON.stringify(docs)
		 	// alert(StringifyData)
		 	var parsedRouteData=JSON.parse(StringifyData)
		 	// alert(ParsedData)
		 	$('#BusNo').val(parsedRouteData[0].BusNo);
		    $('#Town').val(parsedRouteData[0].Town);
		    $('#Route').val(parsedRouteData[0].Route);
		    $('#Code').val(parsedRouteData[0].Code);
		    $('#Model').val(parsedRouteData[0].Model);
		    $('#Capacity').val(parsedRouteData[0].Capacity);   
		 })
	});
});