(function($){
	$(function(){
		$('.button-collapse').sideNav();

		Commands = {};
		Commands.active = function(id) {
			$.ajax({
				type: "GET",
				url: "/commands/"+id+"/enable",
				success: function(){
					console.log("that works");
					animTableSuccess(self);
				}
			});
		};
		Commands.changeName = function(id, self) {
			console.log("new name: ", self.value);
			$.ajax({
				type: "GET",
				url: "/commands/"+id+"/name",
				data: "name="+self.value,
				success: function(){
					animTableSuccess(self);
				}
			});
		};
		Commands.changeFileName = function(id, self) {
			console.log("new name: ", self.value);
			$.ajax({
				type: "GET",
				url: "/commands/"+id+"/file_name",
				data: "file_name="+self.value,
				success: function(){
					animTableSuccess(self);
				}
			});
		};
		Commands.add = function(){
			console.log("bnalabla");
			$("#table-commands").append('<tr><td>id</td><td><input type="text" name="name"/></td><td>Fichier</td><td>Triggers</td><td>Activé</td></tr>');
		};

		function animTableSuccess(self){
			$(self).parent().toggleClass("animChange");
			setTimeout(function(){
				$(self).parent().toggleClass("animChange");
			},1500);
		}

	}); // end of document ready
})(jQuery); // end of jQuery name space