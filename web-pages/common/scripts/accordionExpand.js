// JavaScript Document used to expand and collapse accordions by Erny Grendell 



$(document).ready(function() {

   	starter();

	

	$('#expandall').click( function() {

	if($('#expandall').val() == 'Expand all')

	{

    $('#accordion').accordion("destroy");


	$('#expandall').val('Collapse all');

	}

	else

	{

	starter();

	$('#expandall').val('Expand all');

	}

 	});

 

 function starter()

 {

    $('#accordion').accordion({ collapsible: true, active: false, autoHeight: false});

	$('#accordion h2').attr('tabindex','');


	

 }

 

 });



