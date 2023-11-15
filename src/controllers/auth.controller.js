const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");

const login = async (req,res) => {
    console.log(req.body);

    return res.json(req.body);
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

    try {
        const userSave = new user(req.body);

        await userSave.save()
                .then((response) => {
                    return res.status(201).json({
                        success: true,
                        data: response,
                        message: "Kayıt Başarıyla Eklendi"
                    })

                })
                .catch((err) => {
                    console.log(err);
                })

        
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    login,
    register
}