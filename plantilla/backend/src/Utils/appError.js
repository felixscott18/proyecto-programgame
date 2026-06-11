class AppError extends Error {
    constructor(message,statuscode){
        super(message);
        this.statuscode = statuscode;
        this.isOperational = true;
    }
} 

export default AppError;