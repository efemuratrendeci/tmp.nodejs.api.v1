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

    response({ content, headers, info, status, exception } = { status: 200 }) {
        if (!this.res) throw new Error('BaseClass error : res parameter needed'); //todo

        if (headers instanceof Map) {
            headers.forEach((value, key) => {
                this.res.setHeader(key, value);
            })
        }

        const baseResponse = {
            status,
            isSuccess: status < 300,
            info: info
        }

        return this.res.status(status).type('json').send(
            JSON.stringify(!exception ?
                {
                    ...baseResponse,
                    content: content
                } :
                {
                    ...baseResponse,
                    error: exception
                }
                , null, 4) + '\n');
    }

    _methodMap = [
        { name: 'ok', status: HttpStatusCodes.SUCCESS, info: 'Request succesfully returned' },
        { name: 'success', status: HttpStatusCodes.CREATED, info: 'Entity created' },
        { name: 'accepted', status: HttpStatusCodes.ACCEPTED, info: 'Request accepted' },
        { name: 'noEntity', status: HttpStatusCodes.NO_ENTITY, info: 'Request was success but returned with no entity' },
        { name: 'badRequest', status: HttpStatusCodes.BAD_REQUEST, info: 'Bad request. Please check your request' },
        { name: 'notAllowed', status: HttpStatusCodes.NOT_AUTHENTICATED, info: 'You are not authenticated' },
        { name: 'notAuthorized', status: HttpStatusCodes.UNAUTHORIZED, info: 'You are unauthorized' },
        { name: 'notFound', status: HttpStatusCodes.NOT_FOUND, info: 'Requested url not found' },
        { name: 'conflict', status: HttpStatusCodes.CONFLICT, info: 'There was a conflict via identifiers in your request' },
        { name: 'unprocessableEntity', status: HttpStatusCodes.UNPROCESSABLE_ENTITY, info: 'This entity is unprocessable' },
        { name: 'error', status: HttpStatusCodes.SERVER_ERROR, info: 'An error occured' },
        { name: 'badGateway', status: HttpStatusCodes.BAD_GATEWAY, info: 'There was an upstream error' }
    ]
}