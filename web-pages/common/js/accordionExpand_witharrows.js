// JavaScript Document used to expand and collapse accordions by Erny Grendell 

$(document).ready(function() {

   	starter();
	$('#expandall').click( function() {
	if($('#expandall').val() == 'Expand all')
	{

    $('#accordion').accordion("destroy");
     $('#accordion > h2').addClass(' ui-accordion-header ui-helper-reset ui-state-active ui-corner-top');
$('#accordion > h2').siblings('div').addClass(' ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active');

	$('#expandall').val('Collapse all');

	}
	else
	{

    $('#accordion > h2').removeClass(' ui-accordion-header ui-helper-reset ui-state-active ui-corner-top');
	$('#accordion > h2').siblings('div').removeClass(' ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active');
	starter();
	$('#expandall').val('Expand all');

	}

 	});


 function starter()
 {
   var icons = {
			header: "ui-icon-triangle-1-e",
			headerSelected: "ui-icon-triangle-1-s"
		};

   	$('#accordion').accordion({ collapsible: true, active: false, autoHeight: false, icons: icons});

	$('#accordion h2').attr('tabindex','');
 }


/* Modified EAG 09.09.11 
Documentation of code created to let more than one accordion appear on the page at one time. 


To use the 'Expand All' button with the other accordions on your page you will need to set a new class (expander) and a new attribute (expandwhat) on the input button tag. The class will let my code find your button and the expandwhat attribute will let me know what accordion to expand and collapse.

Syntax:  class="expander"  expandwhat="accordion2"

Example:  <input class="expander"  expandwhat="accordion2" name="expandall" type="button" value="Expand all" style="font-size:10px; float:right; margin:15px 20px 0px 0px;" />

 */




  $('.expander').click( function() {

	  var tempwhat = $(this).attr('expandwhat');

	  // expandwhat="accordion2"

	if($(this).val() == 'Expand all')
	{
    $('#' + tempwhat).accordion("destroy");

     $('#' + tempwhat + ' > h2').addClass(' ui-accordion-header ui-helper-reset ui-state-active ui-corner-top');

$('#' + tempwhat + ' > h2').siblings('div').addClass(' ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active');

	$(this).val('Collapse all');

	}
	else
	{

    $('#' + tempwhat + ' > h2').removeClass(' ui-accordion-header ui-helper-reset ui-state-active ui-corner-top');

	$('#' + tempwhat + ' > h2').siblings('div').removeClass(' ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active');

	starter2(tempwhat);

	$(this).val('Expand all');
	}
});



  

   function starter2(what)



 {



   var icons = {

			header: "ui-icon-triangle-1-e",

			headerSelected: "ui-icon-triangle-1-s"

		};



   	$('#' + what).accordion({ collapsible: true, active: false, autoHeight: false, icons: icons});



	$('#' + what + ' h2').attr('tabindex','');



 }




  

  // end of jQuery start function

  });




