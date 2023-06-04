const User = require("../models/User");
const { DeleteImgFromStorage } = require("./ToolFunctions");

const GetUserAsync = async (username) => {
  const user = await User.findOne({ userName: username }).catch((err) =>
    console.log(err)
  );
  if (user) {
    return user;
  }
  return false;
};


const GetUsersByUsernamesAsync = async (usernames) => {
  const usersPromises = usernames.map(async (username) => {
    return GetUserAsync(username);
  });
  return await Promise.all(usersPromises);
};

const GetUsersByIdsAsync = async (ids) => {
  const usersPromises = ids.map((id) => {
    return User.findById(id);
  });
  return await Promise.all(usersPromises);
};

const UpdateUserStatusAsync = async (username, status) => {
  const user = await GetUserAsync(username);
  user.status = status;
  user.save();
};

const UpdateUserImgAsync = async (username, img) => {
  const user = await GetUserAsync(username);
  if (user.img) {
    DeleteImgFromStorage(user.image);
  }
  user.image = img;
  user.save();
};

const CheckIfUserExist = async (username) => {
  const res = await GetUserAsync(username);
  if (res === false) {
    return false;
  }
  return true;
};

module.exports = {
  GetUserAsync,
  GetUsersByUsernamesAsync,
  GetUsersByIdsAsync,
  UpdateUserStatusAsync,
  UpdateUserImgAsync,
  CheckIfUserExist
};
