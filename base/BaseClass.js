import ApiClientError from "../models/ApiClientError.js";
import ApiServerError from "../models/ApiServerError.js";

export default class BaseClass {
    static generateIdentifier = () => {
        let id = "";
        const lenght = 4, max = 9999, min = 1000;

        for (let i = 0; i < lenght; i++) {
            id += `${Math.floor(Math.random() * (max - min + 1)) + min}-`
        }

        return id.slice(0, -1);
    }

    extractRouteMethod = (name) => {
        if (name.substring(0, 3) === 'get') return 'get';
        if (name.substring(0, 3) === 'put') return 'put';
        if (name.substring(0, 4) === 'post') return 'post';
        if (name.substring(0, 5) === 'patch') return 'patch';
        if (name.substring(0, 6) === 'delete') return 'delete';
        return '';
    }

    /**
     * throws server or client error with status code
     * @param  {...any} args
     * if client error will raise then args[0]:message, args[1]:statusCode(optional)
     * if server error will raise then args[0]:exception, args[1]:message(optional), args[2]:statusCode(optional)
     */
    throws = (...args) => {
        let error;
        if (typeof args[0] === 'string') {
            error = new ApiClientError({ message: args[0], statusCode: args[1] });
        } else {
            error = new ApiServerError({ exception: args[0], statusCode: args[2], message: args[1] });
        }

        //error.log(); //todo
        throw error;
    }
}
