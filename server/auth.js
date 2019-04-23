const auths = {
	"111": true
};

function isAuth(code) {
	if(auths[code] && auths[code] == true) {
		return true;
	} else {
		return false;
	}
}

module.exports = isAuth;