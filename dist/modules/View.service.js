"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = require("../libs/Errors");
const View_model_1 = __importDefault(require("../schema/View.model"));
const Errors_2 = require("../libs/Errors");
const Errors_3 = __importDefault(require("../libs/Errors"));
class ViewService {
    constructor() {
        this.viewModel = View_model_1.default;
    }
    async checkViewExistence(input) {
        return await this.viewModel
            .findOne({
            memberId: input.memberId, viewRefId: input.viewRefId
        }).exec();
    }
    async insertMemberView(input) {
        try {
            return await this.viewModel.create(input);
        }
        catch (err) {
            console.log("ERROR, model:insertMemberView:", err);
            throw new Errors_3.default(Errors_1.HttpmCode.BAD_REQUEST, Errors_2.Message.CREATE_FAILED);
        }
    }
}
exports.default = ViewService;
