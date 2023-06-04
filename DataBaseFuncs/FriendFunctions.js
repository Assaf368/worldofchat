const { states } = require("../Enums/enums");
const FriendshipRequest = require("../models/Friend");
const User = require("../models/User");
const { GetUserAsync } = require("./UserFunctions");

const AddInvitationToDbAsync = async (senderId, targetId) => {
    const friend = new FriendshipRequest({
      sender: senderId,
      target: targetId,
      isApproved: states.waiting,
    });
    await friend.save();
};



const CheckFriendshipStatusAsync = async(senderId,targetId)=>{
  const friendInstance = await FriendshipRequest.findOne({
    $or: [
      {
        sender: senderId,
        target: targetId,
      },
      {
        sender: targetId,
        target: senderId,
      },
    ],
  })
  if(friendInstance){
    return friendInstance.isApproved;
  }
    return false;
}

const _GetAcceptedFriendshipRequestsAsync = async (user) => {
  const friendshipRequests = await FriendshipRequest.find({
    $or: [{ sender: user.id }, { target: user.id }],
    isApproved: states.accepted,
  }).populate("sender target");

  return friendshipRequests;
};

const _GetFriendFromRequest = async (user, friendshipRequest) => {
  let friend = null;
  const targetId = friendshipRequest.target._doc._id.toString();
  const senderId = friendshipRequest.sender._doc._id.toString();

  if (targetId === user.id) {
    friend = User.findById(senderId);
  } else {
    friend = User.findById(targetId);
  }
  return friend;
};

const _GetFriendFromRequestsAsync = async (user, friendshipRequests) => {
  const friendsPromises = friendshipRequests.map((friendshipRequst) => {
    return _GetFriendFromRequest(user, friendshipRequst);
  });
  return await Promise.all(friendsPromises);
};

const _GetFriendsAsync = async (user) => {
    let friends = null;
    const acceptedFriendshipRequests = await _GetAcceptedFriendshipRequestsAsync(user);
  
    if (acceptedFriendshipRequests) {
      friends = _GetFriendFromRequestsAsync(user, acceptedFriendshipRequests);
    }
  
    return friends;
  };

  const FindUserFriendsAsync = async (username) => {
    const user = await GetUserAsync(username);
    let friends = null;
  
    if (user) {
      friends = _GetFriendsAsync(user);
    }
    return friends;
  };

  const GetUserInvitationsAsync = async (username) => {
    const user = await GetUserAsync(username);
    const invitations = await FriendshipRequest.find({
      target: user.id,
      isApproved: states.waiting,
    });
    const previewInvitations = await _GetPreviewInvitationsAsync(invitations);
    return previewInvitations;
  };
  
  const _GetPreviewInvitationsAsync = async(invitations)=>{
      const usersPromises =  invitations.map((invitation)=>{
        const sender =  User.findById(invitation.sender);
        return sender
      })
      const users = await Promise.all(usersPromises);
      return users.map((user)=>{
          return {sender:user.userName}
      } );
    
    }


module.exports = {
    AddInvitationToDbAsync,
    CheckFriendshipStatusAsync,
    FindUserFriendsAsync,
    GetUserInvitationsAsync,
}