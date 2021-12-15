const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  
  bookName: {
    type: String,
  },

  desc: {
    type: String,
  },

  path: {
    type: String,
  },

  userName: {
    type: String,
  },

  avail: {
    type: Number,
  },
  
  

})

bookSchema.index({desc:"text" , bookName:"text"});

module.exports = mongoose.model('Book', bookSchema)