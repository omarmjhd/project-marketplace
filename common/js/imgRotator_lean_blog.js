/* Random Image Rotator - rotates images, alt text and associated links */ 
/* Last updated 12/22/08 */

function imgRotator() {

// define variables 
var imgNum;
var rtnPicture;
var image_alt;
var weblink;

// Begin: image, alt text, link arrays. Keep these three arrays in sync!

var image = new Array();
  image[00]= "one_blog";
  image[01]= "two_blog";
  image[02]= "three_blog";
  image[03]= "four_blog";
  image[04]= "five_blog";
  image[05]= "six_blog";
  image[06]= "seven_blog";
  image[07]= "eight_blog";
  image[08]= "nine_blog";

// list of alt texts
var alttext = new Array();
  alttext[00]= "Lean+ News Blog";
  alttext[01]= "Lean+ News Blog";
  alttext[02]= "Lean+ News Blog";
  alttext[03]= "Lean+ News Blog";
  alttext[04]= "Lean+ News Blog";
  alttext[05]= "Lean+ News Blog";
  alttext[06]= "Lean+ News Blog";
  alttext[07]= "Lean+ News Blog";
  alttext[08]= "Lean+ News Blog";
  
// list of links
var weblinks = new Array();
  weblinks[00]= "/_newsblog/";
  weblinks[01]= "/_newsblog/";
  weblinks[02]= "/_newsblog/";
  weblinks[03]= "/_newsblog/";
  weblinks[04]= "/_newsblog/";
  weblinks[05]= "/_newsblog/";
  weblinks[06]= "/_newsblog/";
  weblinks[07]= "/_newsblog/";
  weblinks[08]= "/_newsblog/";

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

rtnPicture = '<a href="' + weblinks[imgNum] +'"><div id="personalityrotator_blog" class="'+ image[imgNum] +'" title="' + alttext[imgNum] +'"></div></a>';

// window.alert(alttext[imgNum]);
// window.alert('This is the string I am sending' + rtnPicture);
// Set the td title tag with the alt text for the image

// Commented next two lines because we did not use the table tags
//var image_alt = document.getElementById('image_id');
//image_alt.title = alttext[imgNum];
}

else {
// not good (too many images for the browser), so load this image as a default 
rtnPicture = "<IMG SRC='/Common/pz/pz-183-red.jpg' ALT='Lean Blog' BORDER='0' ALIGN='center'>" + " ";
}

return rtnPicture;
}


