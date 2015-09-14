// Image rotater for Lean Principles lives at /Common/js/imgRotater_principles.js

function imgRotator_principles() {

var imgNum;

var rtnPicture;


// Begin: image Array, ID's, photos. Keep these three arrays in sync!


// list of images


var a = new Array();

    a[00]= "/About/images/prin_1.gif";
    a[01]= "/About/images/prin_2.gif";
    a[02]= "/About/images/prin_3.gif";
    a[03]= "/About/images/prin_4.gif";
    a[04]= "/About/images/prin_5.gif";
    a[05]= "/About/images/prin_6.gif";	
	

// list of alt texts


var b = new Array();

    b[00]= "Lean+ Principles: Focus on the customer";
    b[01]= "Lean+ Principles: Involve and engage people";
    b[02]= "Lean+ Principles: Expect, enable, and ensure first-time quality";
    b[03]= "Lean+ Principles: Collaborate and continuously improve our work";
    b[04]= "Lean+ Principles: Sustain the gains";
    b[05]= "Lean+ Principles: Embrace and apply Lean+ across the value stream";

// list of links


var c = new Array();

    c[00]= "/About/principles.cfm#2";
	c[01]= "/About/principles.cfm#3";
    c[02]= "/About/principles.cfm#4";
    c[03]= "/About/principles.cfm#5";
    c[04]= "/About/principles.cfm#6";
    c[05]= "/About/principles.cfm#1";

// End: image Array, ID's SSG Operations photos. Keep these three arrays in sync!



   imgNum = Math.floor( Math.random() * a.length );

   // error trap: just in case browser capability exceeded

   if(!isNaN(imgNum)) {   

   // construct valid image return string

// rtnPicture = "<IMG SRC='" + a[imgNum] + "' WIDTH='580' HEIGHT='435' BORDER='0' ALIGN='center'>"

     rtnPicture = '<a href="'  + c[imgNum] + '">' + '<IMG SRC="' + a[imgNum] + '" WIDTH="165" HEIGHT="188" BORDER="0" ALIGN="center" TITLE = "' + b[imgNum] + '">';


// window.alert(b[imgNum]);
// window.alert('This is the string I am sending' + rtnPicture);


// Set the td title tag for the image

var image_alt = document.getElementById('image_id');

image_alt.title = b[imgNum];


   }


   else {   


   // if image value fails to show up then load document with this background image.

   rtnPicture = "<IMG SRC='/quality/images/l_quality_splash1.jpg' ALT='SSG: QUality' WIDTH='175' HEIGHT='200' BORDER='0' ALIGN='center'>" + " ";

   } 

   return rtnPicture;

}

//-->
