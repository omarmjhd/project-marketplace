/* Random Image Rotator - rotates images, alt text and associated links */ 
/* Last updated 11/02/08 */

function imgRotator() {

// define variables 
var imgNum;
var rtnPicture;
var image_alt;
var weblink;

// Begin: image, alt text, link arrays. Keep these three arrays in sync!

var image = new Array();
  image[00]= "one";
  image[01]= "two";
  image[02]= "three";
  image[03]= "four";
  image[04]= "five";
  image[05]= "six";
  image[06]= "seven";

// list of alt texts
var alttext = new Array();
  alttext[00]= "Lean+ Home";
  alttext[01]= "Lean+ Home";
  alttext[02]= "Lean+ Home";
  alttext[03]= "Lean+ Home";
  alttext[04]= "Lean+ Home";
  alttext[05]= "Lean+ Home";
  alttext[06]= "Lean+ Home";
  
// list of links
var weblinks = new Array();
  weblinks[00]= "/";
  weblinks[01]= "/";
  weblinks[02]= "/";
  weblinks[03]= "/";
  weblinks[04]= "/";
  weblinks[05]= "/";
  weblinks[06]= "/";

// End: image, alt text, link arrays. Keep these three arrays in sync!

// set the random image number based on the number of entries in the 'image' array 
imgNum = Math.floor( Math.random() * image.length );
// error trap: just in case browser capability was exceeded
if(!isNaN(imgNum)) {
// good to go 
// use the next commented statement only if you have no alt text (naughty!) or image links 
// rtnPicture = "<IMG SRC='" + image[imgNum] + "' WIDTH='500' HEIGHT='400' BORDER='0' ALIGN='center'>"
// build the code string - the link followed by the image with the alt text 
// 'rtnPicture' will contain the generated img HTML wrapped in an anchor tag 
//rtnPicture = '<div id="personalityrotator" class="' + image[imgNum] + '"' + ' title="' + alttext[imgNum] + '"' + 'a href="'  + weblinks[imgNum] + '"></div>';
//rtnPicture = '<div id="personalityrotator" class="' + image[imgNum] + '"' + ' title="' + alttext[imgNum] + '"' + ' a href="'  + weblinks[imgNum] + '">'+ weblinks[imgNum] +' xxxxxxxxx</a></div>';

//rtnPicture = '<div id="personalityrotator" class="' + image[imgNum] + '"' + ' title="' + alttext[imgNum] + '">'  + '<a href="'  + weblinks[imgNum] + '">'+ weblinks[imgNum] +'</a></div>';
//rtnPicture = '<div id="personalityrotator" class="'+ image[imgNum] +'">'+ weblinks[imgNum] +'</div>';

rtnPicture = '<a href="' + weblinks[imgNum] +'"><div id="personalityrotator" class="'+ image[imgNum] +'" title="' + alttext[imgNum] +'"></div></a>';

// window.alert(alttext[imgNum]);
// window.alert('This is the string I am sending' + rtnPicture);
// Set the td title tag with the alt text for the image

// Commented next two lines because we did not use the table tags
//var image_alt = document.getElementById('image_id');
//image_alt.title = alttext[imgNum];
}

else {
// not good (too many images for the browser), so load this image as a default 
rtnPicture = "<IMG SRC='_images/pz-183-red.jpg' ALT='Your Alt Text' BORDER='0' ALIGN='center'>" + " ";
}

return rtnPicture;
}


