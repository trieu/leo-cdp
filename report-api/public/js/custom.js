function unique(array) {
	var unique = [];
	for (var i = 0; i < array.length; i++) {
		var current = array[i];
		if (unique.indexOf(current) < 0) unique.push(current);
	}
	return unique;
}


function groupBy(array , f){

	var groups = {};
	array.forEach( function( o )
	{
		var group = JSON.stringify( f(o) );
		groups[group] = groups[group] || [];
		groups[group].push( o );
	});
	return Object.keys(groups).map( function( group )
	{
		return groups[group]; 
	});

}