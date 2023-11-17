const router = require('express').Router();
const {login, register} = require("../controllers/auth.controller");
const AuthValidation = require("../middlewares/validations/auth.validation");

router.post("/login", login);

router.post("/register", AuthValidation.register, register);

module.exports = router;
 