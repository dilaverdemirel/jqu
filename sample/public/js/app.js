/**
 * Created by dilaverd
 */

(function (window) {

    if (window.JQU.sample) {
        return;
    }

    var sample = {
			createUserTable : function(data){
				var table = "<table>"
				table += "<tr><th>Name</th><th>Profession</th><th>Id</th><th></th></tr>"

				$.each(data, function( index, item ) {
				  table += "<tr><td>"+item.name+"</td><td>"+item.profession+"</td><td>"+item.id+"</td><td><a href = 'javascript:void(0)' onclick='JQU.sample.loadUser(\""+item.id+"\")'>Update</a></td></tr>"
				});

				table += "</table>"

				$("#userTable").html(table)
			},
			loadUsers : function(){
				dsl()
					.onComplete(JQU.sample.createUserTable)
					.load('/user/list');
			},
			loadUser : function(id){
				dsl()
					.onComplete(function(data){
						JQU.EL("operationDesc").html(exl().pattern("[[name]] is updating.").eval(data))
					})
					.load('/user/load/'+id)
					.fill("saveUserForm");
			},
			saveOnComplete : function(){
				JQU.sample.loadUsers()
				dsl().container("saveUserForm").clear()
				JQU.EL("operationDesc").html("")
			},
			saveUser : function(){
				var formId = 'saveUserForm'
				return $(this).jquFormSubmit({
					formId: formId,
					formSendUrl: $('#'+formId).attr('action'),
					formMethod: $('#'+formId).attr('method'),
					updatedToTables : [],
					onComplete : "JQU.sample.saveOnComplete()"
				});
			}
    };

    window.JQU.sample = sample;
})(window);


$(document).ready(function(){
	JQU.sample.loadUsers()
})




