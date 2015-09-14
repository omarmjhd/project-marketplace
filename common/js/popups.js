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
eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=456,height=540,left = 323,top = 241.5');");
}

// popup for large windoids

function popUpLarge(URL) {
day = new Date();
id = day.getTime();
eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=yes,location=0,statusbar=0,menubar=0,resizable=0,width=790,height=600,left = 100,top = 100');");
}

// popup for extra large windoids

function popUpExtraLarge(URL) {
day = new Date();
id = day.getTime();
eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=yes,location=0,statusbar=0,menubar=0,resizable=0,width=800,height=768,left = 100,top = 100');");
}

