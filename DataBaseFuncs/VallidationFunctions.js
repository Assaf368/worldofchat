const { CheckIfUserExist } = require("./UserFunctions");

const PasswordServerVallidation =(password,confirm)=>{
    if(password === confirm){
      const regex = /^(?=.*[A-Z])(?=.*[a-z]).{8,30}$/
      if(regex.test(password)){
        return true;
      }else{
        return false
      }
    }else{
      return false
    }
  }
  
  const UsernameServerVallidation =async (username)=>{
    if(username.length <3){
      return false
    }
      const isExist = await CheckIfUserExist(username);
      if(isExist){
          return false
      }else{
        return true
      }
  }

  module.exports = {
    UsernameServerVallidation,
    PasswordServerVallidation
  }