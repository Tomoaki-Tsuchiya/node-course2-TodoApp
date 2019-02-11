var {userModel} = require('./../models/users')

var authenticate = (req,res,next) => {
    var token = req.header('x-auth');
    //検索するときは、インスタンスではなく、Modelに対してmethodを投げかける
    //つまり、UserModel.findById()などを仕掛ける。
    //これまではインスタンスに対してgenAuthTokenなど作ってきたが、Modelに対して作る場合は、
    //Model側でUserSchema.statics.method = func()と作成する
    userModel.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        req.user = user;
        req.token = token
        next();
    }).catch(e => {
        res.status(401).send(e)
    });
};

module.exports = {authenticate}