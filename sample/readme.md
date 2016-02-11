# JQU = jQuery Utilities

JQU is a jQuery utilities project for front-end developers, small teams and new developers.

### Features
  - Ajax Status Management
  - DSL Functions For Ajax Operations
  - Form Ajax Submit Operations
  - HTML 5 Form Validation
  - Expression Language For JSON Data
  - Data Context

### Tech

JQU uses a number of open source libraries to work properly:
* [jQuery] - For all of JavaScript
* [jquery.gritter] - For messages

### Sample Application
The JQU have a sample application. It shows how to simplify the development. Sample is running on nodejs.
```sh
$ git clone [git-repo-url] jqu
$ cd jqu
$ node app.js
```

### app.js
```sh
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
```
