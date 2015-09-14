// JavaScript Document used to expand and collapse accordions by Erny Grendell 
// NOTE: In order to make the  LIGHTBOX and the ACCORDION operate together without conflict, the "$" was changed to "jQuery" _ 18Aug2011


jQuery(document).ready(function() {

   	starter();

	

	jQuery('#expandall').click( function() {

	if(jQuery('#expandall').val() == 'Expand all')

	{

    jQuery('#accordion').accordion("destroy");


	jQuery('#expandall').val('Collapse all');

	}

	else

	{

	starter();

	jQuery('#expandall').val('Expand all');

	}

 	});

 

 function starter()

 {

    jQuery('#accordion').accordion({ collapsible: true, active: false, autoHeight: false});

	jQuery('#accordion h2').attr('tabindex','');


	

 }

 

 });



