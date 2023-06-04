
const fs =require('fs');

const DeleteImgFromStorage =(path)=>{
    fs.unlink(path,(err)=> {
      console.log(err);
    })
  }

  module.exports = {
    DeleteImgFromStorage
  }