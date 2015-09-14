/*  Advanced Combination Tempate - version 3.0.06  */



// IE hover functions



sfHover = function() {

	var sfEls = document.getElementById("menuVertical").getElementsByTagName("LI");

	for (var i=0; i<sfEls.length; i++) {

		sfEls[i].onmouseover=function() {

			this.className+=" sfhover";

		}

		sfEls[i].onmouseout=function() {

			this.className=this.className.replace(new RegExp(" sfhover\\b"), "");

		}

	}

}

if (window.attachEvent) window.attachEvent("onload", sfHover);



sfHover2 = function() {

	var sfEls = document.getElementById("menuHorizontal").getElementsByTagName("LI");

	for (var i=0; i<sfEls.length; i++) {

		sfEls[i].onmouseover=function() {

			this.className+=" sfhover";

		}

		sfEls[i].onmouseout=function() {

			this.className=this.className.replace(new RegExp(" sfhover\\b"), "");

		}

	}

}

if (window.attachEvent) window.attachEvent("onload", sfHover2);



// function to show or hide content

function moredropsub(subelem) {
	var e = document.getElementById(subelem).style.display; 
	if (e == 'none') {
		if (oldsubelem != "") {	
			document.getElementById(oldsubelem).style.display='none';
		}
		document.getElementById(subelem).style.display='block';
	} else {
		document.getElementById(subelem).style.display='none';
	}
	oldsubelem = subelem;
}

// popup for small windoids



function popUpSmall(URL) {

day = new Date();

id = day.getTime();

eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=500,height=375,left = 323,top = 241.5');");

}



// popup for medium windoids



function popUpMedium(URL) {

day = new Date();

id = day.getTime();

eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=785,height=510,left = 323,top = 241.5');");

}



// popup for large windoids



function popUpLarge(URL) {

day = new Date();

id = day.getTime();

eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=yes,location=0,statusbar=0,menubar=0,resizable=0,width=940,height=600,left = 100,top = 100');");

}



// popup for extra large windoids



function popUpExtraLarge(URL) {

day = new Date();

id = day.getTime();

eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=yes,location=0,statusbar=0,menubar=0,resizable=0,width=790,height=820,left = 100,top = 100');");

}



// FAQs  Display/hide an answer by clicking the question

function disp_ans(obj) {

var tmp = obj;

var parent = tmp.parentNode;

while(tmp && ! (tmp.className && (tmp.className.indexOf('answer') != -1))) {

tmp = tmp.nextSibling;

if (! tmp) {

tmp = parent;

if (tmp) {

parent = tmp.parentNode; }

}

}

if (tmp) {

if (tmp.style.display == 'none') {

tmp.style.display = 'block'; }

else {

tmp.style.display = 'none';

}

}

}



// Display/hide all answers by clicking a link

function hasStyle(elem, style) {

if(!elem) return false;

if(!style) return true;

if(!elem.className) return false;

var styles = elem.className.split(" ");

for(var i=0; i<styles.length; i++) {

if(styles[i] == style) {

return true;

}

}

return false;

}



// Toggle only those elements with the "answer" style 

function toggle_ans(show) {

var elems = document.getElementsByTagName("p");

for(var i=0; i<elems.length; i++) {

if(hasStyle(elems[i], "answer")) {

elems[i].style.display = (show) ? "block" : "none";

}

}

} 

// Toggle only those elements with the "answer" style 

/* http://keith-wood.name/countdown.html
   Countdown for jQuery v1.5.4.
   Written by Keith Wood (kbwood{at}iinet.com.au) January 2008.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(x($){x 1d(){8.1x=[];8.1x[\'\']={1e:[\'2q\',\'2r\',\'2s\',\'2t\',\'2u\',\'2v\',\'2w\'],2x:[\'2y\',\'2z\',\'2A\',\'2B\',\'2C\',\'2D\',\'2E\'],1f:[\'y\',\'m\',\'w\',\'d\'],1y:\':\',1O:1a};8.1g={1P:A,1Q:A,1R:A,1S:A,1T:\'2F\',1h:\'\',1U:1a,1z:\'\',1V:\'\',1W:\'\',1X:1a,1Y:A,1Z:A};$.1p(8.1g,8.1x[\'\'])}t s=\'G\';t Y=0;t O=1;t W=2;t D=3;t H=4;t M=5;t S=6;$.1p(1d.20,{1i:\'2G\',2H:2I(x(){$.G.21()},2J),14:[],2K:x(a){8.1A(8.1g,a);1B(8.1g,a||{})},1C:x(a,b,c,e,f,g,h,i){z(1j b==\'2L\'&&b.2M==N){i=b.1D();h=b.1E();g=b.1F();f=b.1G();e=b.Q();c=b.X();b=b.Z()}t d=L N();d.2N(b);d.22(1);d.2O(c||0);d.22(e||1);d.2P(f||0);d.2Q((g||0)-(R.2R(a)<30?a*1q:a));d.2S(h||0);d.2T(i||0);B d},23:x(a,b){t c=$(a);z(c.24(8.1i)){B}c.2U(8.1i);t d={15:$.1p({},b),u:[0,0,0,0,0,0,0]};$.11(a,s,d);8.25(a)},1H:x(a){z(!8.1I(a)){8.14.2V(a)}},1I:x(a){B($.2W(a,8.14)>-1)},1r:x(b){8.14=$.2X(8.14,x(a){B(a==b?A:a)})},21:x(){1b(t i=0;i<8.14.1J;i++){8.1k(8.14[i])}},1k:x(a,b){t c=$(a);b=b||$.11(a,s);z(!b){B}c.2Y(8.26(b));c[(8.C(b,\'1O\')?\'2Z\':\'31\')+\'33\'](\'34\');t d=8.C(b,\'1Z\');z(d){d.1l(a,[b.P!=\'27\'?b.u:8.1s(b,b.E,L N())])}t e=b.P!=\'1m\'&&(b.F?b.16.I()<=b.F.I():b.16.I()>=b.T.I());z(e&&!b.1K){b.1K=28;z(8.1I(a)||8.C(b,\'1X\')){8.1r(a);t f=8.C(b,\'1Y\');z(f){f.1l(a,[])}t g=8.C(b,\'1W\');z(g){t h=8.C(b,\'1h\');b.15.1h=g;8.1k(a,b);b.15.1h=h}t i=8.C(b,\'1V\');z(i){35.36=i}}b.1K=1a}1n z(b.P==\'1m\'){8.1r(a)}$.11(a,s,b)},25:x(a,b,c){b=b||{};z(1j b==\'1L\'){t d=b;b={};b[d]=c}t e=$.11(a,s);z(e){8.1A(e.15,b);1B(e.15,b);8.29(a,e);$.11(a,s,e);t f=L N();z((e.F&&e.F<f)||(e.T&&e.T>f)){8.1H(a)}8.1k(a,e)}},1A:x(a,b){t c=1a;1b(t n 1M b){z(n.K(/[2a]2b/)){c=28;13}}z(c){1b(t n 1M a){z(n.K(/[2a]2b[0-9]/)){a[n]=A}}}},29:x(a,b){t c=8.C(b,\'1S\');c=(c?c.1l(a,[]):A);t d=L N();t e=8.C(b,\'1R\');e=(e==A?-d.37():e);b.F=8.C(b,\'1Q\');z(b.F){b.F=8.1C(e,8.1t(b.F,A));z(b.F&&c){b.F.1u(b.F.1D()+d.I()-c.I())}}b.T=8.1C(e,8.1t(8.C(b,\'1P\'),d));z(c){b.T.1u(b.T.1D()+d.I()-c.I())}b.E=8.2c(b)},38:x(a){t b=$(a);z(!b.24(8.1i)){B}8.1r(a);b.39(8.1i).3a();$.3b(a,s)},3c:x(a){8.P(a,\'1m\')},3d:x(a){8.P(a,\'27\')},3e:x(a){8.P(a,A)},P:x(a,b){t c=$.11(a,s);z(c){z(c.P==\'1m\'&&!b){c.u=c.2d;t d=(c.F?\'-\':\'+\');c[c.F?\'F\':\'T\']=8.1t(d+c.u[0]+\'y\'+d+c.u[1]+\'o\'+d+c.u[2]+\'w\'+d+c.u[3]+\'d\'+d+c.u[4]+\'h\'+d+c.u[5]+\'m\'+d+c.u[6]+\'s\');8.1H(a)}c.P=b;c.2d=(b==\'1m\'?c.u:A);$.11(a,s,c);8.1k(a,c)}},3f:x(a){t b=$.11(a,s);B(!b?A:(!b.P?b.u:8.1s(b,b.E,L N())))},C:x(a,b){B(a.15[b]!=A?a.15[b]:$.G.1g[b])},1t:x(k,l){t m=x(a){t b=L N();b.2e(b.I()+a*2f);B b};t n=x(a){a=a.3g();t b=L N();t c=b.Z();t d=b.X();t e=b.Q();t f=b.1G();t g=b.1F();t h=b.1E();t i=/([+-]?[0-9]+)\\s*(s|m|h|d|w|o|y)?/g;t j=i.2g(a);3h(j){3i(j[2]||\'s\'){17\'s\':h+=18(j[1],10);13;17\'m\':g+=18(j[1],10);13;17\'h\':f+=18(j[1],10);13;17\'d\':e+=18(j[1],10);13;17\'w\':e+=18(j[1],10)*7;13;17\'o\':d+=18(j[1],10);e=R.1v(e,$.G.1c(c,d));13;17\'y\':c+=18(j[1],10);e=R.1v(e,$.G.1c(c,d));13}j=i.2g(a)}B L N(c,d,e,f,g,h,0)};t o=(k==A?l:(1j k==\'1L\'?n(k):(1j k==\'3j\'?m(k):k)));z(o)o.1u(0);B o},1c:x(a,b){B 32-L N(a,b,32).Q()},26:x(c){c.u=U=(c.P?c.u:8.1s(c,c.E,L N()));t d=1a;t e=0;1b(t f=0;f<c.E.1J;f++){d|=(c.E[f]==\'?\'&&U[f]>0);c.E[f]=(c.E[f]==\'?\'&&!d?A:c.E[f]);e+=(c.E[f]?1:0)}t g=8.C(c,\'1U\');t h=8.C(c,\'1h\');t i=(g?8.C(c,\'1f\'):8.C(c,\'1e\'));t j=8.C(c,\'1y\');t k=8.C(c,\'1z\')||\'\';t l=x(a){t b=$.G.C(c,\'1f\'+U[a]);B(c.E[a]?U[a]+(b?b[a]:i[a])+\' \':\'\')};t m=x(a){t b=$.G.C(c,\'1e\'+U[a]);B(c.E[a]?\'<V 1o="3k"><V 1o="2h">\'+U[a]+\'</V><3l/>\'+(b?b[a]:i[a])+\'</V>\':\'\')};B(h?8.2i(c,h,g):((g?\'<V 1o="1N 2h\'+(c.P?\' 2j\':\'\')+\'">\'+l(Y)+l(O)+l(W)+l(D)+(c.E[H]?8.J(U[H],2):\'\')+(c.E[M]?(c.E[H]?j:\'\')+8.J(U[M],2):\'\')+(c.E[S]?(c.E[H]||c.E[M]?j:\'\')+8.J(U[S],2):\'\'):\'<V 1o="1N 3m\'+e+(c.P?\' 2j\':\'\')+\'">\'+m(Y)+m(O)+m(W)+m(D)+m(H)+m(M)+m(S))+\'</V>\'+(k?\'<V 1o="1N 3n">\'+k+\'</V>\':\'\')))},2i:x(c,d,e){t f=8.C(c,(e?\'1f\':\'1e\'));t g=x(a){B($.G.C(c,(e?\'1f\':\'1e\')+c.u[a])||f)[a]};t h=x(a,b){B R.1w(a/b)%10};t j={3o:8.C(c,\'1z\'),3p:8.C(c,\'1y\'),3q:g(Y),3r:c.u[Y],3s:8.J(c.u[Y],2),3t:8.J(c.u[Y],3),3u:h(c.u[Y],1),3v:h(c.u[Y],10),3w:h(c.u[Y],19),3x:g(O),3y:c.u[O],3z:8.J(c.u[O],2),3A:8.J(c.u[O],3),3B:h(c.u[O],1),3C:h(c.u[O],10),3D:h(c.u[O],19),3E:g(W),3F:c.u[W],3G:8.J(c.u[W],2),3H:8.J(c.u[W],3),3I:h(c.u[W],1),3J:h(c.u[W],10),3K:h(c.u[W],19),3L:g(D),3M:c.u[D],3N:8.J(c.u[D],2),3O:8.J(c.u[D],3),3P:h(c.u[D],1),3Q:h(c.u[D],10),3R:h(c.u[D],19),3S:g(H),3T:c.u[H],3U:8.J(c.u[H],2),3V:8.J(c.u[H],3),3W:h(c.u[H],1),3X:h(c.u[H],10),3Y:h(c.u[H],19),3Z:g(M),40:c.u[M],41:8.J(c.u[M],2),42:8.J(c.u[M],3),43:h(c.u[M],1),44:h(c.u[M],10),45:h(c.u[M],19),46:g(S),47:c.u[S],48:8.J(c.u[S],2),49:8.J(c.u[S],3),4a:h(c.u[S],1),4b:h(c.u[S],10),4c:h(c.u[S],19)};t k=d;1b(t i=0;i<7;i++){t l=\'4d\'.4e(i);t m=L 2k(\'\\\\{\'+l+\'<\\\\}(.*)\\\\{\'+l+\'>\\\\}\',\'g\');k=k.2l(m,(c.E[i]?\'$1\':\'\'))}$.2m(j,x(n,v){t a=L 2k(\'\\\\{\'+n+\'\\\\}\',\'g\');k=k.2l(a,v)});B k},J:x(a,b){a=\'4f\'+a;B a.4g(a.1J-b)},2c:x(a){t b=8.C(a,\'1T\');t c=[];c[Y]=(b.K(\'y\')?\'?\':(b.K(\'Y\')?\'!\':A));c[O]=(b.K(\'o\')?\'?\':(b.K(\'O\')?\'!\':A));c[W]=(b.K(\'w\')?\'?\':(b.K(\'W\')?\'!\':A));c[D]=(b.K(\'d\')?\'?\':(b.K(\'D\')?\'!\':A));c[H]=(b.K(\'h\')?\'?\':(b.K(\'H\')?\'!\':A));c[M]=(b.K(\'m\')?\'?\':(b.K(\'M\')?\'!\':A));c[S]=(b.K(\'s\')?\'?\':(b.K(\'S\')?\'!\':A));B c},1s:x(f,g,h){f.16=h;f.16.1u(0);t i=L N(f.16.I());z(f.F&&h.I()<f.F.I()){f.16=h=i}1n z(f.F){h=f.F}1n{i.2e(f.T.I());z(h.I()>f.T.I()){f.16=h=i}}t j=[0,0,0,0,0,0,0];z(g[Y]||g[O]){t k=$.G.1c(h.Z(),h.X());t l=$.G.1c(i.Z(),i.X());t m=(i.Q()==h.Q()||(i.Q()>=R.1v(k,l)&&h.Q()>=R.1v(k,l)));t n=x(a){B(a.1G()*1q+a.1F())*1q+a.1E()};t o=R.4h(0,(i.Z()-h.Z())*12+i.X()-h.X()+((i.Q()<h.Q()&&!m)||(m&&n(i)<n(h))?-1:0));j[Y]=(g[Y]?R.1w(o/12):0);j[O]=(g[O]?o-j[Y]*12:0);t p=x(a,b,c){t d=(a.Q()==c);t e=$.G.1c(a.Z()+b*j[Y],a.X()+b*j[O]);z(a.Q()>e){a.2n(e)}a.4i(a.Z()+b*j[Y]);a.4j(a.X()+b*j[O]);z(d){a.2n(e)}B a};z(f.F){i=p(i,-1,l)}1n{h=p(L N(h.I()),+1,k)}}t q=R.1w((i.I()-h.I())/2f);t r=x(a,b){j[a]=(g[a]?R.1w(q/b):0);q-=j[a]*b};r(W,4k);r(D,4l);r(H,4m);r(M,1q);r(S,1);B j}});x 1B(a,b){$.1p(a,b);1b(t c 1M b){z(b[c]==A){a[c]=A}}B a}$.4n.G=x(a){t b=4o.20.4p.4q(4r,1);z(a==\'4s\'){B $.G[\'2o\'+a+\'1d\'].1l($.G,[8[0]].2p(b))}B 8.2m(x(){z(1j a==\'1L\'){$.G[\'2o\'+a+\'1d\'].1l($.G,[8].2p(b))}1n{$.G.23(8,a)}})};$.G=L 1d()})(4t);',62,278,'||||||||this|||||||||||||||||||||var|_periods|||function||if|null|return|_get||_show|_since|countdown||getTime|_minDigits|match|new||Date||_hold|getDate|Math||_until|periods|span||getMonth||getFullYear||data||break|_timerTargets|options|_now|case|parseInt|100|false|for|_getDaysInMonth|Countdown|labels|compactLabels|_defaults|layout|markerClassName|typeof|_updateCountdown|apply|pause|else|class|extend|60|_removeTarget|_calculatePeriods|_determineTime|setMilliseconds|min|floor|regional|timeSeparator|description|_resetExtraLabels|extendRemove|UTCDate|getMilliseconds|getSeconds|getMinutes|getHours|_addTarget|_hasTarget|length|_expiring|string|in|countdown_row|isRTL|until|since|timezone|serverSync|format|compact|expiryUrl|expiryText|alwaysExpire|onExpiry|onTick|prototype|_updateTargets|setUTCDate|_attachCountdown|hasClass|_changeCountdown|_generateHTML|lap|true|_adjustSettings|Ll|abels|_determineShow|_savePeriods|setTime|1000|exec|countdown_amount|_buildLayout|countdown_holding|RegExp|replace|each|setDate|_|concat|Years|Months|Weeks|Days|Hours|Minutes|Seconds|labels1|Year|Month|Week|Day|Hour|Minute|Second|dHMS|hasCountdown|_timer|setInterval|980|setDefaults|object|constructor|setUTCFullYear|setUTCMonth|setUTCHours|setUTCMinutes|abs|setUTCSeconds|setUTCMilliseconds|addClass|push|inArray|map|html|add||remove||Class|countdown_rtl|window|location|getTimezoneOffset|_destroyCountdown|removeClass|empty|removeData|_pauseCountdown|_lapCountdown|_resumeCountdown|_getTimesCountdown|toLowerCase|while|switch|number|countdown_section|br|countdown_show|countdown_descr|desc|sep|yl|yn|ynn|ynnn|y1|y10|y100|ol|on|onn|onnn|o1|o10|o100|wl|wn|wnn|wnnn|w1|w10|w100|dl|dn|dnn|dnnn|d1|d10|d100|hl|hn|hnn|hnnn|h1|h10|h100|ml|mn|mnn|mnnn|m1|m10|m100|sl|sn|snn|snnn|s1|s10|s100|yowdhms|charAt|0000000000|substr|max|setFullYear|setMonth|604800|86400|3600|fn|Array|slice|call|arguments|getTimes|jQuery'.split('|'),0,{}))