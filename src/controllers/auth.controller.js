const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken } = require("../middlewares/auth");

const login = async (req,res) => {
    const {email, password} = req.body;
    
    const userInfo = await user.findOne({email});
    console.log(userInfo);

    if(!userInfo) {
        throw new APIError("Email yada Şifre Hatalıdır !",401);
    }

    const isPassTrue = await bcrypt.compare(password, userInfo.password);

    if(!isPassTrue) {
        throw new APIError("Email veya Şifre Hatalıdır !",401);
    }


    createToken(userInfo, res);
}


const register = async (req,res) => {

    const { email } = req.body;

     //değişken ismide email olduğu için {email:email} yerine bu şekildede kullanılabiliyor
    const userCheck = await user.findOne({email});

    if(userCheck) {

        throw new APIError("Email is exist", 401);

    }

    req.body.password = await bcrypt.hash(req.body.password, 10);

    console.log("Hashed Password :", req.body.password);

    const userSave = new user(req.body);

    await userSave.save()
        .then((data) => {

            return new Response(data,"Record Added Successfully").created(res);

            return res.status(201).json({
                        success: true,
                        data: data,
                        message: "Record Added Successfully"
        })

                })
                .catch((err) => {
                   throw new APIError("User not inserted to db",400); 
                })

}

module.exports = {
    login,
    register
}