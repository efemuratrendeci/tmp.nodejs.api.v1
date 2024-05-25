import BaseController from "../base/BaseController.js"

export default class WatherforecastController extends BaseController {

    constructor(res) {
        super(res);
        this.initMetadata();
    }

    getCity_$cityId = async (req) => {
        throw new Error('Handles 500!!');
        return this.ok({ content: { cityId: req.params[cityId], weather: '25F' } });
    }

    getSmthng = async (req) => {
        this.throws('Your request seems wrong');
        this.throws(new Error('servers seems wrong 500'));
        return this.ok({ content: { cityId: req.params[cityId], weather: '25F' } });
    }
}