const mongoose = require('mongoose');
const User = require('./User');
const {states} = require('../Enums/enums')
const friendSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    target:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    isApproved:{
        type: String,
        enum: Object.values(states),
        default: states.waiting
    }
});

module.exports = mongoose.model('Friend', friendSchema);