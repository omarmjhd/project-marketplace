function createStripedTable(idArray) {
	// if this browser doesn't have this function, then just bail out
	if (document.getElementById == null) return;
	
	
	// for each table ID that we're given, stripe all the rows.
	for (var indx = 0; indx < idArray.length; indx++) {
		var id = idArray[indx];
		// get the table that corresponds to this ID
		var oTable = document.getElementById(id);
		if (oTable == null) 
			return;

		// get its table body, which contains all the TR tags
		var aTBODY = oTable.getElementsByTagName("tbody");

		// set the CSS class for each one of the TR tags 
		for (var i = 0; i < aTBODY.length; i++) {
			// get an array of all the TR tags in the TBODY
			var aTR = aTBODY[i].getElementsByTagName("tr");

			for (var j = 0; j < aTR.length; j++) {	
				// the % operator divides the given number by another
				// and returns the remainder. This is how we alternate the
				// rows. 
				aTR[j].className = (j % 2 == 1) ? "stripe2" : "stripe1";
			}
		}
	}
}
