const authUtil = require('../utils/auth.util')

const checkTokenExpiration = (store) => (next) => (action) => {
//   const token =
//     JSON.parse(localStorage.getItem('user')) &&
//     JSON.parse(localStorage.getItem('user'))['token']
//   if (jwtDecode(token).exp < Date.now() / 1000) {
//     next(action)
//     localStorage.clear()
//   }
//   next(action)
// }
// var current_time = new Date().getTime() / 1000
// if (current_time > jwt.exp) {
  /* expired */
}


exports.authenticateToken = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

    try {
      let user = authUtil.verifyToken(token)
      if(user == 'jwt expired'){
        return res.status(401).json('token a expriado')
      }
      console.log('LOG User', user);
      req.user = user
      next();
    } catch (error) {
      console.log(error);
    }

 
}