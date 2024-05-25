import BaseController from "../base/BaseController.js"

export default class TrafficController extends BaseController {

    constructor(res) {
        super(res);
        this.initMetadata();
    }

    getLight = async (_) => {
        return this.ok({ content: { light: 'green' } });
    }
}