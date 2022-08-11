class CustomError extends Error{
    constructor(message, code){
        super(message) // for using existing properties
        this.code = code
    }
}

module.exports = CustomError;