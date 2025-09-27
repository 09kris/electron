class apiError extends Error {
    constructor(statusCode,message="somthis went wroing",errors=[],stack=""){
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = null;
        this.success = false;
        this.errors = errors;
        if(stack) {
            this.stack = stack;
        }else {
            Error.captureStackTrace(this, this.constructor);
        }   
    }
}

export default apiError;