var currentTR = null; // if the user clicks on a row, we store it aside so we can unhilite it later.

function createAutoHiliteTableRows(idArray)
{
	// check for DOM-capable browser. If this method isn't available, don't do anything.
	if (document.getElementById != null)
	{
		for (var indx = 0; indx < idArray.length; indx++) {
			var id = idArray[indx];
		
			// get each table that has the ID that we were given
			var oTable=document.getElementById(id);
			if (oTable != null)
			{
				// get all the TR tags in the table.
				var aTRs=oTable.getElementsByTagName('tr');
				for(var j=0;j<aTRs.length;j++)
				{
					// only highlight those TRs that are children of the TBODY.
					// remove this "if" statement if you want to highlight ALL rows.
					if(aTRs[j].parentNode.nodeName=='TBODY')
					{
						// add event handlers for each TR to handle mouseover, mouseout,
						// and mousedown events. For each event, set the inline style
						// of the tag to whatever you want to happen when that event occurs.
						// Using inline styles instead of classes makes it easy to combine
						// this code with other functions, like the table striping example,
						// since when the inline style is removed, the class applied by
						// the striping code won't be affected.
						aTRs[j].onmouseover=function() {
							if (currentTR == this) return false;
							this.style.backgroundColor="#f9f9f9";
							this.style.fontWeight="100";
							return false;}
						aTRs[j].onmouseout=function(){
							if (currentTR == this) return false;
							this.style.backgroundColor="";
							this.style.fontWeight="";
							return false;}
						aTRs[j].onmousedown=function(){
							// if there is already another row that the user clicked on,
							// remove its style before highlighting the one that was clicked.
							if (currentTR != null) {
								currentTR.style.backgroundColor="";
								currentTR.style.fontWeight="";
								// if the row the user clicked on was already highlighted, then
								// just remove the styling and return.
								if (currentTR == this) {
									currentTR = null;
									return false;
								}
							}
							currentTR = this; // remember which row was clicked
							// highlight the row
							this.style.backgroundColor="#E2E1DD";
							this.style.fontWeight="";
							return false;}
					}
				}
			}
		}
	}
}
