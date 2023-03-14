//Mongoose para se conectar com o mongo
var mongoose = require('mongoose');

//Criando o schema de notas, onde terá a chave estrangeira author
var noteSchema = new mongoose.Schema({
    title: String,
    body: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
});

noteSchema.index({'title': 'text', 'body': 'text'});
module.exports = mongoose.model('Note', noteSchema);
