const APIError = require("../utils/errors");

const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof APIError) {
        return res.status(err.statusCode || 400)
            .json({
                success: false,
                message: err.message
            })
    }
    return res.status(500).json({
        success: false,
        message: "Error occured with api. Please control your API !"
    })
}

module.exports = errorHandlerMiddleware;