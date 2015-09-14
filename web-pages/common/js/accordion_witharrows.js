/*

 * jQuery Javascript for Lean+ accordian menus



 */
 
 
 /* Modified EAG 09.09.11 
Documentation of code created to let more than one accordion appear on the page at one time. 

Change the id of your accordion DIV to the new name:
From => <div id="accordion">
To => <div id="accordion2">

Then add the example code to the top of you page under the header loader: 

Example:  

  <!---  BEGIN COMMON HEADER  --->
  <cfinclude template="/Common/header2011.cfm">
<script type="text/javascript"> 
	$(document).ready(function() {
		setaccordion('accordion2'); 
	});
</script>


Syntax:  setaccordion('ID_name_of_accordion');

Example:  
<script type="text/javascript"> 
	$(document).ready(function() {
		setaccordion('accordion2'); 
	});
</script> */

 function setaccordion(what) {
   	var icons = {

			header: "ui-icon-triangle-1-e",

			headerSelected: "ui-icon-triangle-1-s"

		};

   	$('#' + what).accordion({ collapsible: true, active: false, autoHeight: false, icons: icons});

	$('#' + what + ' h2').attr('tabindex','').filter(':even').addClass('accStripe');

 }
  

$(document).ready(function() {



// , header: '.ui-accordion-header'



   	var icons = {
			header: "ui-icon-triangle-1-e",
			headerSelected: "ui-icon-triangle-1-s"
		};

   	$('#accordion').accordion({ collapsible: true, active: false, autoHeight: false, icons: icons});



	$('#accordion h2').attr('tabindex','').filter(':even').addClass('accStripe');









	// Use command line to open the accordion



	var urlname = location.href;



	var urlstr = urlname.search("#");



	if(urlstr != -1)



		{



		var urlstr2 = urlstr + 1; 



		var urlloc = urlname.substr(urlstr2,2);



		urlloc = urlloc.toUpperCase();



		urlloc = '#' + urlloc;



		var accname = $(urlloc).attr('acc_name');



		var accnum = $(urlloc).attr('acc_num');



		if ( accname == 'accordionusa')



			{



			$('#accordion').accordion( 'activate' , 0 );



			$('#accordionusa').accordion( 'activate' , parseInt(accnum) );



			}



			else



			{



			$('#accordion').accordion( 'activate' , parseInt(accnum) );



			}



	}






 });

