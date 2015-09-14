// JavaScript Document



$(document).ready(function(){

$('.lightwindow').live("click", function() {

  var tempurl = $(this).attr('href');

  $("#modalIframeId").attr("src",tempurl);

    $("#dialog").dialog( 'destroy' );

                // params="lightwindow_type=external,lightwindow_width=1100,lightwindow_height=650"

                var tempparams = $(this).attr('params');

                tempparams = tempparams.replace(/lightwindow_type=external/i, "");

                if(tempparams.charAt(0) == ',') {

                                tempparams = tempparams.substr(1);

                }

                tempvalue1 = $.ListFirst(tempparams , ',');

                tempvalue2 = $.ListLast(tempparams , ',');

                

                if(tempvalue1.search(/lightwindow_height=/i) != -1 ) {

                                var h = $.ListLast(tempvalue1 , '=');

                                var w = $.ListLast(tempvalue2 , '=');

                }

                else {

                                var w = $.ListLast(tempvalue1 , '=');

                                var h = $.ListLast(tempvalue2 , '=');



                }

         $("#dialog").dialog({

                                                bgiframe: true,

                                                height: h,

                                                modal: true, 

                                                width: w,

                                                stack: true,

                                                dialogClass: 'dialog',

                                                zIndex: 3999,

                                                buttons: {

                                                                Close: function() {

                                                                                $(this).dialog('destroy');

                                                                }

                                                                },

                                                Close: function() {

                                                                                $(this).dialog('destroy');

                                                                }

                                });

                                $("#dialog").dialog( 'open' );

                

return false;
}); 
});


