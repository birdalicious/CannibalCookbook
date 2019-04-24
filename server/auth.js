var auths = require("./data/auths.json");
const fs = require("fs");

function isAuth(code) {
	if(auths[code] && auths[code] == true) {
		return true;
	} else {
		return false;
	}
}

module.exports = class Auth {
	constructor(authCode) {
		if(auths[authCode]) {
			this._commenting = auths[authCode].commenting;
			this._recipe = auths[authCode].recipe;
			this._auth = auths[authCode].auth;
		} else {
			this._commenting = false;
			this._recipe = false;
			this._auth = false;
		}
	}

	get canComment() {
		return this._commenting;
	}

	get canModifyRecipes() {
		return this._recipe;
	}

	get canModifyAuth() {
		return this._auth;
	}

	modifyAuth(authCode, permissions) {
		return new Promise((resolve, reject) => {
			try {
				if(!this._auth) {
					reject({
						status: 403,
						data: "You don't have permission to change permissions"
					});
					return;
				}

				permissions = JSON.parse(permissions);

				if(permissions.commenting == undefined || permissions.recipe == undefined || permissions.auth == undefined) {
					reject({
						status: 400,
						data: "Invalid permissions"
					});
					return;
				}

				auths[authCode] = permissions;

				fs.writeFile("./server/data/auths.json", JSON.stringify(auths), err => {
					if(err) {
						reject(err);
					}
					resolve({
						status: 200,
						data: {}
					});
				});
			} catch(err) {
				console.log(err)
				reject({
					status: 500,
					data: err
				})
			}
		});
	}
};