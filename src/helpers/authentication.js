function verifyToken(token) {
  if (token) return true;
  return false;
}

function isLoggedIn() {
  let token = localStorage.getItem("token");
  if (!token) {
    return false;
  }
  if (verifyToken(token)) {
    return true;
  }
  return false;
}
function getToken() {
  return $cookies.get("token");
}
function getLoggedInUser() {
  let user = localStorage.getItem("user");
  if (user) {
    user = JSON.parse(user);
  }
  return user;
}

function loginAuthenticatedUser(user, token) {
 //  localStorage.setItem("user", JSON.stringify(user));
 //  localStorage.setItem("token", token);
  // console.log("setting token as a cookie for" + user);
  $cookies.set("token",token);
  $cookies.set("user",JSON.stringify(user));
}

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
}

export {
  isLoggedIn,
  verifyToken,
  getLoggedInUser,
  loginAuthenticatedUser,
  logout,
  getToken
};
