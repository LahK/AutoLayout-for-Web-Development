// function registerWithEmailPassword(email, password)
// function loginWithEmailPassword(email, password, complete)
// function logout()
// function isLogin()
// function addDocumentByUserIdWithContentDict(userId, contentDict)
// function updateDocumentByUserIdDocIdWithContentDict(userId, docId, contentDict)
// function removeDocumentByUserIdDocId(userId, docId)

// root reference of Wilddog instance
var ref = new Wilddog("https://autolayout.wilddogio.com/");

// 认证状态回调方法
function authDataCallback(authData) {
  if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
  } else {
    console.log("User is logged out");
  }
}
// 注册回调方法，在每次终端用户认证状态发生改变时，回调方法被执行。
ref.onAuth(authDataCallback);

function registerWithEmailPassword(email, password) {
	ref.createUser({email:email,password:password},
		function(error,authData){
			if(error!=null){
				//not success
				console.log("Register Failed!", error);
				switch (error.code) {
					case "EMAIL_TAKEN":
						console.log("Email is taken.");
						break;
					default:
						console.log("Error registering user in:", error);
				}
				return
			} else {
				//create user success
    			console.log("Register - Authenticated successfully with payload:", authData);
			}
	});
}

// 处理终端用户登录认证的结果的回调
function authHandler(error, authData) {
	if (error) {
		switch (error.code) {
			case "INVALID_EMAIL":
				console.log("Invalid Email / Wrong Password.");
				break;
			default:
				console.log("Error logging user in:", error);
		}
		return
	} else {
		console.log("Login - Authenticated successfully with payload:", authData);
	}
}

// 使用email/password认证方式。complete 参数为登录回调函数，参考 authHandler(error, authData)
function loginWithEmailPassword(email, password, complete) {
	ref.authWithPassword({
	    email    : email,
	    password : password
	}, complete);
}

function logout() {
	ref.unauth();
}

function isLogin() {
	var authData = ref.getAuth();
	if (authData) {
	  console.log("User " + authData.uid + " is logged in with " + authData.provider);
	} else {
	  console.log("User is logged out");
	}

	return authData
}

function addDocumentByUserIdWithContentDict(userId, contentDict) {
	var docsRef = ref.child("users").child(userId).child("documents");

	var newDocRef = docsRef.push({
		"title": contentDict.title,
		"content": contentDict.content,
		"isReadable": contentDict.isReadable,
		"createdAt": Wilddog.ServerValue.TIMESTAMP,
		"updatedAt": Wilddog.ServerValue.TIMESTAMP
	});

	var newDocID = newDocRef.key();

	console.log("New Document Created: id = "+newDocID)
}

function updateDocumentByUserIdDocIdWithContentDict(userId, docId, contentDict) {
	var docRef = ref.child("users").child(userId).child("documents").child(docId);

	docRef.on("value", function(snapshot) {
		// var updatedDoc = snapshot.val();
		// console.log(updatedDoc);
		console.log("Document Updated: id = "+docId);

	});

	docRef.update(contentDict);

	// 为了减少『在 contentDict 中添加 updateAt 键和键值』这一步骤，
	// 单独更新 updateAt
	docRef.update({
		"updatedAt": Wilddog.ServerValue.TIMESTAMP
	});
}

function removeDocumentByUserIdDocId(userId, docId) {
	var docsRef = ref.child("users").child(userId).child("documents");
	var docRef = ref.child("users").child(userId).child("documents").child(docId);

	docsRef.on("child_removed", function(snapshot) {
		var deletedDoc = snapshot.val();
		console.log("Document Deleted: id = "+deletedDoc.id)
	});

	docRef.remove();

}


















