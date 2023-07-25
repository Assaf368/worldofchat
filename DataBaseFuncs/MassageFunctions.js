const Room = require("../models/Room");
const Massage = require("../models/Massage");



const ResetUnreadMassagesCounterAsync = async(roomId,userId)=>{
    const room = await Room.findById(roomId);
    if(room){
      const member = room.members.find(member=> member.id.toString() === userId);
      if(member){
        member.unreadMassagesCounter = 0;
        await room.save();
      }
    }
  }
  
  const UpdateUnreadMassagesCounterAsync = async(roomId ,userId, count)=>{
    const room = await Room.findById(roomId);
    if(room){
      const member = await room.members.find(member=> {return member.id.toString() === userId});
      if(member){
        if(count !== undefined){
          member.unreadMassagesCounter = count;
        }else{
          member.unreadMassagesCounter++;
        }
        await room.save();
      }
    }
  }

  const UpdateMassageToDbAsync = async(text , targetRoom, senderUser)=>{
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }).toString();
    const massage = new Massage({
      text: text,
      date: time,
      fullDate: now,
      name: senderUser.userName,
      sender: senderUser.id,
      target: targetRoom
    });
    await massage.save();
    const room = await Room.findById(targetRoom);
    room.massages.push(massage.id);
    await room.save();
  }


  module.exports = {
    ResetUnreadMassagesCounterAsync,
    UpdateUnreadMassagesCounterAsync,
    UpdateMassageToDbAsync,
  }