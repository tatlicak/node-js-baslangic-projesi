const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken } = require("../middlewares/auth");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");
const moment = require("moment/moment");

const login = async (req,res) => {

    console.log("LOGIN");
    const {email, password} = req.body;
    
    const userInfo = await user.findOne({email});

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

const me = async (req, res) => {
    
    return new Response(req.user).success(res);
}

const forgetPassword = async (req,res) => {
    const { email } = req.body;

    const userInfo = await user.findOne({email}).select(" name lastname email ");

    if (!userInfo) return new APIError("Invalid User", 400);

    console.log(userInfo);

    const resetCode = crypto.randomBytes(3).toString("hex");

    await sendEmail({
        from:"tatlicak@ataytekbilisim.com",
        to: userInfo.email,
        subject: "Şifre Sıfırlama",
        text: `Şifre Sıfırlama Kodunuz ${resetCode}`

    })

    await user.updateOne(
        {email},
        {
            reset: {
                code: resetCode,
                time: moment(new Date()).add(15, "minute").format("YYYY-MM-DD HH:mm:ss")
            }
        }
    )

    return new Response(true, "Please Check Your Mailbox").success(res)
}

module.exports = {
    login,
    register,
    me,
    forgetPassword
}