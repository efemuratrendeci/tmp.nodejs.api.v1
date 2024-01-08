import HttpStatusCodes from "../enums/HttpStatusCodes.js";
import BaseClass from "./BaseClass.js";

export default class BaseController extends BaseClass {
    constructor(res) {
        super();
        this.res = res;
        for (const method of this._methodMap) {
            this[method.name] = (options) => this.response({ ...method, ...options });
        }
    }

    initMetadata = (mapper, prefix) => {
        let existanceMetadata = [];

        for (const method of mapper) {
            if (Reflect.hasOwnMetadata(`${this.constructor.name}_route`, BaseController)) {
                existanceMetadata = JSON.parse(Reflect.getMetadata(`${this.constructor.name}_route`, BaseController));
            }
            Reflect.defineMetadata(`${this.constructor.name}_route`, `${JSON.stringify([...existanceMetadata, { controller: this.constructor.name, prefix: prefix, ...method }])}`, BaseController);
        }
    }

    response({ content, headers, message, status, exception } = { status: 200 }) {
        if (!this.res) throw new Error('BaseClass error : res parameter needed'); //todo

        if (headers instanceof Map) {
            headers.forEach((value, key) => {
                this.res.setHeader(key, value);
            })
        }

        const baseResponse = {
            status,
            isSuccess: status < 300
        }

        return this.res.status(status).type('json').send(
            JSON.stringify(!exception ?
                {
                    ...baseResponse,
                    content: content ?? {}
                } :
                {
                    ...baseResponse,
                    error: exception
                }
                , null, 4) + '\n');
    }

    _methodMap = [
        { name: 'ok', status: HttpStatusCodes.SUCCESS, message: 'Request succesfully returned' },
        { name: 'success', status: HttpStatusCodes.CREATED, message: 'Entity created' },
        { name: 'accepted', status: HttpStatusCodes.ACCEPTED, message: 'Request accepted' },
        { name: 'noEntity', status: HttpStatusCodes.NO_ENTITY, message: 'Request was success but returned with no entity' },
        { name: 'badRequest', status: HttpStatusCodes.BAD_REQUEST, message: 'Bad request. Please check your request' },
        { name: 'notAllowed', status: HttpStatusCodes.NOT_AUTHENTICATED, message: 'You are not authenticated' },
        { name: 'notAuthorized', status: HttpStatusCodes.UNAUTHORIZED, message: 'You are unauthorized' },
        { name: 'notFound', status: HttpStatusCodes.NOT_FOUND, message: 'Requested url not found' },
        { name: 'conflict', status: HttpStatusCodes.CONFLICT, message: 'There was a conflict via identifiers in your request' },
        { name: 'unprocessableEntity', status: HttpStatusCodes.UNPROCESSABLE_ENTITY, message: 'This entity is unprocessable' },
        { name: 'error', status: HttpStatusCodes.SERVER_ERROR, message: 'An error occured' },
        { name: 'badGateway', status: HttpStatusCodes.BAD_GATEWAY, message: 'There was an upstream error' }
    ]
}