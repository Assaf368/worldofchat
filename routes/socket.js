const { Server } = require("socket.io");
const User = require("../models/User");
const { states } = require("../Enums/enums");
const { GetUserAsync, GetUsersByIdsAsync } = require("../DataBaseFuncs/UserFunctions");
const { FindGroupsForUserAsync } = require("../DataBaseFuncs/RoomFunctions");
const { CheckFriendshipStatusAsync, AddInvitationToDbAsync } = require("../DataBaseFuncs/FriendFunctions");
const { UpdateUnreadMassagesCounterAsync, UpdateMassageToDbAsync } = require("../DataBaseFuncs/MassageFunctions");



// Export the function that creates the io object
module.exports = (server) => {
  const io = new Server(server, {
    cors: "*",
    methods: ["POST", "GET"],
  });


  io.on("connection", (socket) => {
    console.log(`user connected :${socket.id}`);

    socket.on("login", async (data) => {
      const user = await GetUserAsync(data.username);
      if (user) {
        user.isOnline = true;
        user.socketId = socket.id;
        await user.save();

        const rooms = await FindGroupsForUserAsync(user.userName);
        rooms.forEach((room) => {
          socket.join(room.id);
        });
      }
    });

    socket.on("send_invitation", async (data) => {
      const targetUser = await GetUserAsync(data.targetUsername);
      const senderUser = await GetUserAsync(data.senderUsername);
      const frienshipStatus = await CheckFriendshipStatusAsync(senderUser.id, targetUser.id);
      if(frienshipStatus === false || frienshipStatus === states.rejected){
        if (targetUser && senderUser) {
          if (targetUser.isOnline) {
            socket
              .to(targetUser.socketId)
              .emit("receive_invitation", data.senderUsername);
            await AddInvitationToDbAsync(senderUser.id, targetUser.id);
          } else {
            await AddInvitationToDbAsync(senderUser.id, targetUser.id);
          }
        }
      }
      
    });


  socket.on("send_massage", async (data) => {
      const { roomId,members,text,senderId} = data;
      const ids = members.map((member)=> {return member.id});
      const users = await GetUsersByIdsAsync(ids); 
      const senderUser = await User.findById(senderId);
      const resData = {
        roomId:roomId,
        text:text,
        senderId:senderId,
        username: senderUser.userName
      }
      io.to(roomId).emit('receive_message', resData);
      users.forEach(async(user)=>{
        if(!user.isOnline){
          await UpdateUnreadMassagesCounterAsync(roomId, user.id);
        }
      })
      await UpdateMassageToDbAsync(text,roomId, senderUser);
    });



    socket.on("logout", async (data) => {
      const user = await GetUserAsync(data.username);
      user.isOnline = false;
      user.socketId = null;
      await user.save();
    });

    socket.on("disconnect", async() => {
      const user = await User.findOne({socketId:socket.id})
      if(user){
        user.isOnline = false;
        user.socketId = null;
        await user.save();
      }
      console.log(`User disconnected : ${socket.id}`);
    });
  });

  return { io };
};
