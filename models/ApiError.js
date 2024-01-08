import BaseClass from "../base/BaseClass.js";

export default class ApiError {
    constructor(message, statusCode) {
        this.message = message;
        this.status = statusCode;
        this.isApiError = undefined;
        this.errorId = BaseClass.generateIdentifier();
    }

    getGroup = (stack) => {
        let groups = stack.split(" ");
        return groups.filter(x => x.includes('Controller'))[0].split('.')[0];
    }

    static isApiError = (error) => {
        return typeof error === 'object' && Boolean(error && 'isApiError' in error) 
    }
}