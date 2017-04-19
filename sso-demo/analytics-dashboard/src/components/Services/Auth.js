import Data from '../../data';
var authentication = {

  check(nextState, replace, cb) {
    const user_token = window.localStorage.getItem('user_token');
      if(user_token) {
        const user_info = window.localStorage.getItem('user_info');
        if(!user_info){
          console.log('a')
          location.href = Data.oauthLink.userInfo + "?access_token=" + user_token;
        }
      }
      else{
        console.log('b')
        location.href = Data.oauthLink.login;
      }
    cb();
  }

}

module.exports = authentication;