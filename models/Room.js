const mongoose = require('mongoose');
const Massage = require('./Massage');

const roomSchema = new mongoose.Schema({
  name:{
    type:String,
    required:false,
    maxlength: 30,
    minlength: 1,
    default: null
},
members: {
  type: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true,
    },
    unreadMassagesCounter: {
      type: Number,
      required: false,
      min: 0,
      default:0
    },img: {
      type: String,
      required: false,
    }
  }],
  validate: [arrayLimit, ' exceeds the limit of 50']
},
      massages: {
        type: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: Massage,
          required: false
        }],
      },
    description:{
        type:String,
        required:false,
        maxlength: 100,
        minlength: 1
    },
    date:{
        type:Date,
        required:true,
    },
    img:{
        type:String,
        required:false
    },
    });

    function arrayLimit(val) {
        return val.length <= 50;
      }

    module.exports = mongoose.model('Room', roomSchema);