//Mongoose para se conectar com o mongo
var mongoose = require('mongoose');

//Usando bcrypt para transformar o password em hash
var bcrypt = require('bcrypt');

//Criando o schema de usuarios
var userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

//Criando um middleware para criptografar o password do usuario. Ela vai ser ativado sempre que um arquivo for novo ou o password for modificado
userSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('password')) {
        bcrypt.hash(this.password, 10,
             (err, hashedPassword) => {
                if (err)
                    next(err);
                else {
                    this.password = hashedPassword;
                    next();
                 }
            });
    } else {
        next()
    }
})

//Metodo do schema Usuario que irá verificar se o password está correto
userSchema.methods.isCorrectPassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, same) {
        if (err) {
            callback(err);
          } else {
            callback(err, same);
          }
    })
}
module.exports = mongoose.model('User', userSchema);
