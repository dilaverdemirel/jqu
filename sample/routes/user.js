var userIndex = 3
var users = {
   "user1" : {
      "name" : "mahesh",
	  "password" : "password1",
	  "profession" : "teacher",
	  "id": 1
   },
   "user2" : {
      "name" : "suresh",
	  "password" : "password2",
	  "profession" : "librarian",
	  "id": 2
   },
   "user3" : {
      "name" : "ramesh",
	  "password" : "password3",
	  "profession" : "clerk",
	  "id": 3
   }
}

exports.list = function(req, res){
     res.json(users)
};

exports.add = function(req, res){
	newUser = users["user"+req.body.id]
	
	console.log(newUser)
	
	if(newUser == null){
		userIndex++
		var userName = "user"+userIndex
		
		var newUser = {
						"name" : req.body.name,
						"password" : "111",
						"profession" : req.body.profession,
						"id" : userIndex
					}
		console.log(newUser)
		users[userName] = newUser
	} else {
		newUser.name = req.body.name
		newUser.profession = req.body.profession
		users["user"+req.body.id] = newUser
	}
	
    res.json({"message":"Success"})
};

exports.load = function(req, res){
	console.log("Req param id : "+req.params.id)

    res.json(users["user"+req.params.id])
};