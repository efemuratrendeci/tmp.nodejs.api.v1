import BaseController from "../base/BaseController.js";

class ErrorController extends BaseController {
    constructor(res) {
        super(res);
    }

    getNotFound = async (req, next) => {
        try {
            return this.notFound({ message: `Requested url: ${req.url} not found` });
        } catch (error) {
            next(error)
        }

    }
    getSystemError = async (error, req, res, next) => {
        return this.error({ content: error.stack });
    }
}

export default ErrorController;