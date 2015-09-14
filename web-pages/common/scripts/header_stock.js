//
//
// start ajax.js
//
//

/*
 * Copyright 2006 SitePoint Pty. Ltd, www.sitepoint.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS;
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

function Ajax() {
  this.req = null;
  this.url = null;
  this.status = null;
  this.statusText = '';
  this.method = 'GET';
  this.async = true;
  this.dataPayload = null;
  this.readyState = null;
  this.responseText = null;
  this.responseXML = null;
  this.handleResp = null;
  this.responseFormat = 'text', // 'text', 'xml', 'object'
  this.mimeType = null;
  this.headers = [];

  
  this.init = function() {
    var i = 0;
    var reqTry = [ 
      function() { return new XMLHttpRequest(); },
      function() { return new ActiveXObject('Msxml2.XMLHTTP') },
      function() { return new ActiveXObject('Microsoft.XMLHTTP' )} ];
      
    while (!this.req && (i < reqTry.length)) {
      try { 
        this.req = reqTry[i++]();
      } 
      catch(e) {}
    }
    return true;
  };
  this.doGet = function(url, hand, format) {
    this.url = url;
    this.handleResp = hand;
    this.responseFormat = format || 'text';
    this.doReq();
  };
  this.doPost = function(url, dataPayload, hand, format) {
    this.url = url;
    this.dataPayload = dataPayload;
    this.handleResp = hand;
    this.responseFormat = format || 'text';
    this.method = 'POST';
    this.doReq();
  };
  this.doReq = function() {
    var self = null;
    var req = null;
    var headArr = [];
    
    if (!this.init()) {
      alert('Could not create XMLHttpRequest object.');
      return;
    }
    req = this.req;
    req.open(this.method, this.url, this.async);
    if (this.method == "POST") {
      this.req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    if (this.method == 'POST') {
      req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    self = this;
    req.onreadystatechange = function() {
      var resp = null;
      self.readyState = req.readyState;
      if (req.readyState == 4) {
        
        self.status = req.status;
        self.statusText = req.statusText;
        self.responseText = req.responseText;
        self.responseXML = req.responseXML;
        
        switch(self.responseFormat) {
          case 'text':
            resp = self.responseText;
            break;
          case 'xml':
            resp = self.responseXML;
            break;
          case 'object':
            resp = req;
            break;
        }
        
        if (self.status > 199 && self.status < 300) {
          if (!self.handleResp) {
            alert('No response handler defined ' +
              'for this XMLHttpRequest object.');
            return;
          }
          else {
            self.handleResp(resp);
          }
        }
        
        else {
          self.handleErr(resp);
        }
      }
    }
    req.send(this.dataPayload);
  };
  this.abort = function() {
    if (this.req) {
      this.req.onreadystatechange = function() { };
      this.req.abort();
      this.req = null;
    }
  };
  this.handleErr = function() {
    var errorWin;
    // Create new window and display error
    try {
      errorWin = window.open('', 'errorWin');
      errorWin.document.body.innerHTML = this.responseText;
    }
    // If pop-up gets blocked, inform user
    catch(e) {
      alert('An error occurred, but the error message cannot be' +
      ' displayed because of your browser\'s pop-up blocker.\n' +
      'Please allow pop-ups from this Web site.');
    }
  };
  this.setMimeType = function(mimeType) {
    this.mimeType = mimeType;
  };
  this.setHandlerResp = function(funcRef) {
    this.handleResp = funcRef;
  };
  this.setHandlerErr = function(funcRef) {
    this.handleErr = funcRef; 
  };
  this.setHandlerBoth = function(funcRef) {
    this.handleResp = funcRef;
    this.handleErr = funcRef;
  };
  this.setRequestHeader = function(headerName, headerValue) {
    this.headers.push(headerName + ': ' + headerValue);
  };
  
}

//
//
// end ajax.js
//
//



//
//
// start xmlparse.js
//
//

/*
 * Copyright 2006 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *         http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Original code by Matthew Eernisse (mde@fleegix.org)
 *
*/

XMLParse = new function(){

    // Takes an array of XML items, transforms into an array of JS objects
    // Call it like this: res = XMLParse.xml2ObjArray(xml, 'Item'); 
    this.xml2ObjArray = function(xmlDocElem, tagItemName) {
        var self = XMLParse;
        var xmlElemArray = new Array;
        var xmlElemRow;
        var objArray = [];
        
        // Rows returned
        if (xmlDocElem.hasChildNodes()) {
            xmlElemArray = xmlDocElem.getElementsByTagName(tagItemName);
            xmlElemRow = xmlElemArray[0];
            // Create array of objects and set properties
            for (var j = 0; j < xmlElemArray.length; j++) {
                xmlElemRow = xmlElemArray[j];
                objArray[j] = self.xmlElem2Obj(xmlElemArray[j]);
            }
        }
        return objArray;
    };
    
    // Transforms an XML element into a JS object
    this.xmlElem2Obj = function(xmlElem) {
        var self = XMLParse;
        var ret = new Object();
        self.setPropertiesRecursive(ret, xmlElem);
        return ret;
    };
    
    this.setPropertiesRecursive = function(obj, node) {
        var self = XMLParse;
        if (node.childNodes.length > 0) {
            for (var i = 0; i < node.childNodes.length; i++) {
                if (node.childNodes[i].nodeType == 1 &&
                  node.childNodes[i].firstChild) {
                    // If node has only one child
                    // set the obj property to the value of the node
                    if(node.childNodes[i].childNodes.length == 1) {
                        obj[node.childNodes[i].tagName] = 
                        node.childNodes[i].firstChild.nodeValue;
                    }
                    // Otherwise this obj property is an array
                    // Recurse to set its multiple properties
                    else {
                        obj[node.childNodes[i].tagName] = [];
                        // Call recursively -- rinse and repeat
                        // ==============
                        self.setPropertiesRecursive(
                        obj[node.childNodes[i].tagName], 
                        node.childNodes[i]);
                    }
                }
            }
        }
    };
    
    this.cleanXMLObjText = function(xmlObj) {
        var self = XMLParse;
        var cleanObj = xmlObj;
        for (var prop in cleanObj) {
            cleanObj[prop] = cleanText(cleanObj[prop]);
        }
        return cleanObj;
    };
    
    this.cleanText = function(str) {
        var self = XMLParse;
        var ret = str;
        ret = ret.replace(/\n/g, '');
        ret = ret.replace(/\r/g, '');
        ret = ret.replace(/\'/g, "\\'");
        ret = ret.replace(/\[CDATA\[/g, '');
        ret = ret.replace(/\]]/g, '');
        return ret;
    };
    
    this.rendered2Source = function(str) {
        var self = XMLParse;
        // =============
        // Convert string of markup into format which will display
        // markup in the browser instead of rendering it
        // =============
        var proc = str;    
        proc = proc.replace(/</g, '&lt;');
        proc = proc.replace(/>/g, '&gt;');
        return '<pre>' + proc + '</pre>';
    };
        
    // Returns a single, top-level XML document node
    this.getXMLDocElem = function(xmlDivId, xmlNodeName) {
        var self = XMLParse;
        var xmlElemArray = [];
        var xmlDocElem = null;
        if (document.all) {
                var xmlStr = document.getElementById(xmlDivId).innerHTML;
                var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.loadXML(xmlStr);    
                xmlDocElem = xmlDoc.documentElement;
          }
          // Moz/compat can access elements directly
          else {
            xmlElemArray = 
                window.document.body.getElementsByTagName(xmlNodeName);
            xmlDocElem = xmlElemArray[0]; ;
          }
          return xmlDocElem;
    };
}
// Close the .constructor loophole
XMLParse.constructor = null;

//
//
// end xmlparse.js
//
//


PageData = new function() {
	this.stock_quote_span = null;
	this.ajaxreq = null;
	
};

HeaderApp = new function() {

	this.init = function() {
		PageData.stock_quote_span = document.getElementById("stock_quote");
		PageData.ajaxreq = new Ajax();
		
		x = new Date();
		x = x.getTime();
		PageData.ajaxreq.doGet('/static/stock.xml?x=' + x, HeaderApp.displayStock, 'xml');
	};

	this.displayStock = function(resp) {
			stock_quote_text = "BA ";

			stockData = XMLParse.xml2ObjArray(resp, 'ROW');

			stocklast = stockData[0].LASTPRICE;
			roundlast = parseFloat(stocklast).toFixed(2); 

			change = stockData[0].CHANGE;
			round_change = parseFloat(change).toFixed(2);

			if (round_change > 0) {
				updown_symbol = "+";
			}
			else if (round_change < 0) {
				updown_symbol = "-";
				round_change = round_change.substr(1);
			}
			else {
				updown_symbol = "";
			}

			if (updown_symbol == "") {
				change_full_text = round_change;
			}
			else {
				change_full_text = updown_symbol + round_change;
			}

			stock_quote_text = stock_quote_text + roundlast + " (" + change_full_text + ")";

			tempText = document.createTextNode(stock_quote_text);
			PageData.stock_quote_span.appendChild(tempText);

	};

	this.cleanup = function() {
		PageData.stock_quote_span = null;
	};
	
};

window.onload = HeaderApp.init;
window.onunload = HeaderApp.cleanup;

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
