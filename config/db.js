var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/db1', { useNewUrlParser: true } );
var db = mongoose.connection;
mongoose.set('useFindAndModify', false);
db.on('error', console.error.bind(console, 'connection error:'));
module.exports=mongoose;