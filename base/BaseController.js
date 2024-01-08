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
        for (const method of mapper) {
            Reflect.defineMetadata(`${this.constructor.name}_route`, `${JSON.stringify({ controller: this.constructor.name, prefix: prefix, ...method })}`, BaseController);
        }
    }

    response({ content, headers, message, status, error } = { status: 200 }) {
        if (!this.res) throw new Error('BaseClass error : res parameter needed'); //todo

        if (headers instanceof Map) {
            headers.forEach((value, key) => {
                this.res.setHeader(key, value);
            })
        }

        return this.res.status(status).type('json').send(JSON.stringify({
            status,
            isSuccess: status < 300,
            content: content ?? error,
            message: message ?? "No message"
        }, null, 4) + '\n');
    }

    _methodMap = [
        { name: 'ok', status: 200, message: 'Request succesfully returned' },
        { name: 'success', status: 201, message: 'Entity created' },
        { name: 'accepted', status: 202, message: 'Request accepted' },
        { name: 'noEntity', status: 204, message: 'Request was success but returned with no entity' },
        { name: 'badRequest', status: 400, message: 'Bad request. Please check your request' },
        { name: 'notAllowed', status: 401, message: 'You are not authenticated' },
        { name: 'notAuthorized', status: 403, message: 'You are unauthorized' },
        { name: 'notFound', status: 404, message: 'Requested url not found' },
        { name: 'conflict', status: 409, message: 'There was a conflict via identifiers in your request' },
        { name: 'unprocessableEntity', status: 422, message: 'This entity is unprocessable' },
        { name: 'error', status: 500, message: 'An error occoured' },
        { name: 'badGateway', status: 503, message: 'There was an upstream error' }
    ]
}