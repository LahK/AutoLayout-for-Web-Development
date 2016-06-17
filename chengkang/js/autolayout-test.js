
function startTestWithTestAccount() {
	var authData = isLogin();
	if (!authData) {
		var complete = function (error, authData) {
			if (error) {
				switch (error.code) {
					case "INVALID_EMAIL":
						console.log("Invalid Email / Wrong Password.");
						break;
					default:
						console.log("Error logging user in:", error);
				}
				console.log("NOTisLogin");
				return
			} else {
				console.log("Login - Authenticated successfully with payload:", authData);
				var userId = authData.uid;

				testBody(userId);
			}
		}

		loginWithEmailPassword("me@changkang.pw", "123456", complete);
	} else {
		var userId = authData.uid;
		console.log(authData.uid);
		console.log("isLogin");
		testBody(userId);
	}
}

function testBody(userId) {
	// addDocumentByUserIdWithContentDictTestCase
	// addDocumentByUserIdWithContentDictTest(userId);

	// updateDocumentByUserIdDocIdWithContentDictTestCase
	var testUpdateDocId = "-KKSZOynIFCiIC9D6mbn";
	updateDocumentByUserIdDocIdWithContentDictTest(userId, testUpdateDocId);
	// updateDocumentByUserIdDocIdWithContentDictTest("simplelogin:1466137345266974", "-KKSZOynIFCiIC9D6mbn");
	// var ref = new Wilddog("https://autolayout.wilddogio.com/users/simplelogin:1466137345266974/documents/-KKSZOynIFCiIC9D6mbn");

	// removeDocumentByUserIdDocIdTestCase
	// var testRemoveDocId = "-KKSXrqhrfe_DH-kE_Fn";
	// removeDocumentByUserIdDocIdTest(userId, testRemoveDocId)
}

function addDocumentByUserIdWithContentDictTest(userId) {
	var contentDict = {
		"title": "Add Document Test",
		"content": {
			"objects": [
				{
					"id": "1",
					"type": "Image"
				},
				{
					"id": "2",
					"type": "Label"
				}
			],
			"constraints": [
			]
		},
		"isReadable": 1
	};

	addDocumentByUserIdWithContentDict(userId, contentDict);
}

function updateDocumentByUserIdDocIdWithContentDictTest(userId, docId) {
	var contentDict = {
		"content": {
			"objects": [
				{
					"id": "1",
					"type": "Image"
				},
				{
					"id": "2",
					"type": "Label",
					"style": {
						"width": 70
					}
				}
			],
			"constraints": [
				{
					"id": "1",
				}
			]
		}
	};

	updateDocumentByUserIdDocIdWithContentDict(userId, docId, contentDict);
}

function removeDocumentByUserIdDocIdTest(userId, docId) {
	removeDocumentByUserIdDocId(userId, docId);
}
































