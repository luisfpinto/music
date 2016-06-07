function sendData(route) {

	var data = {}
	console.log(route)
	if(route === '/volume') {
		var value = document.getElementById("volume").value
		data = {volume: value}
	}
	$.ajax({
   	type: "POST",
   	url: route,
   	data: data,
   	success: function(data) {
     	}
	});
}