"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = require("../libs/Errors");
const Product_model_1 = __importDefault(require("../schema/Product.model"));
const Errors_2 = __importDefault(require("../libs/Errors"));
const config_1 = require("../libs/config");
const product_enum_1 = require("../libs/enums/product.enum");
const View_service_1 = __importDefault(require("./View.service"));
const view_enum_1 = require("../libs/enums/view.enum");
class ProductService {
    constructor() {
        this.productModel = Product_model_1.default;
        this.viewService = new View_service_1.default;
    }
    /**SPA */
    async getProducts(inquiry) {
        console.log("inquiry", inquiry);
        const match = { productStatus: product_enum_1.ProductStatus.PROCESS };
        if (inquiry.productCollection)
            match.productCollection = inquiry.productCollection;
        if (inquiry.search) {
            match.productName = { $regex: new RegExp(inquiry.search, "i") };
        }
        const sort = inquiry.order === "productPrice" ?
            { [inquiry.order]: 1 } : { [inquiry.order]: -1 };
        const result = await this.productModel.aggregate([
            { $match: match },
            { $sort: sort },
            { $skip: (inquiry.page * 1 - 1) * inquiry.limit },
            { $limit: inquiry.limit * 1 },
        ]).exec();
        if (!result)
            throw new Errors_2.default(Errors_1.HttpmCode.NOT_FOUND, Errors_1.Message.NO_DATA_FAUND);
        return result;
    }
    async getProduct(memberId, id) {
        const productId = (0, config_1.shapeIntoMongooseOnjectId)(id);
        let result = await this.productModel.findOne({
            _id: productId, productStatus: product_enum_1.ProductStatus.PROCESS,
        })
            .exec();
        if (!result)
            throw new Errors_2.default(Errors_1.HttpmCode.NOT_FOUND, Errors_1.Message.NO_DATA_FAUND);
        //todo : if authenticad users => first => view log creation
        if (memberId) {
            const input = {
                memberId: memberId,
                viewRefId: productId,
                viewGroup: view_enum_1.ViewGroup.PRODUCT,
            };
            const existView = await this.viewService.checkViewExistence(input);
            console.log("exist:", existView);
            if (!existView) {
                //Insert View
                console.log("PLANING TO INSERT NEW VIEW");
                await this.viewService.insertMemberView(input);
                //Increase Counts
                result = await this.productModel
                    .findByIdAndUpdate(productId, { $inc: { productViews: +1 } }, { new: true })
                    .exec();
            }
        }
        return result;
    }
    //**SSR */
    async getAllProducts() {
        const result = await this.productModel.find().exec();
        if (!result)
            throw new Errors_2.default(Errors_1.HttpmCode.NOT_FOUND, Errors_1.Message.NO_DATA_FAUND);
        return result;
    }
    async createNewProduct(input) {
        try {
            return await this.productModel.create(input);
        }
        catch (err) {
            console.error("Error, model:createNewProduct:", err);
            throw new Errors_2.default(Errors_1.HttpmCode.BAD_REQUEST, Errors_1.Message.CREATE_FAILED);
        }
    }
    async updateChosenProduct(id, input) {
        //string => object
        id = (0, config_1.shapeIntoMongooseOnjectId)(id);
        const result = await this.productModel.findOneAndUpdate({ _id: id }, input, { new: true }).exec();
        if (!result)
            throw new Errors_2.default(Errors_1.HttpmCode.NOT_MODIFIED, Errors_1.Message.UPDATE_FAILED);
        console.log("result:", result);
        return result;
    }
}
exports.default = ProductService;
