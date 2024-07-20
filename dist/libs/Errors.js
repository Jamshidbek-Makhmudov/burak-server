"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.HttpmCode = void 0;
var HttpmCode;
(function (HttpmCode) {
    HttpmCode[HttpmCode["OK"] = 200] = "OK";
    HttpmCode[HttpmCode["CREAT"] = 201] = "CREAT";
    HttpmCode[HttpmCode["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    HttpmCode[HttpmCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpmCode[HttpmCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpmCode[HttpmCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpmCode[HttpmCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpmCode[HttpmCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpmCode || (exports.HttpmCode = HttpmCode = {}));
var Message;
(function (Message) {
    Message["SOMETHING_WENT_WRONG"] = "Something went wrong!";
    Message["NO_DATA_FAUND"] = "No data is found!";
    Message["CREATE_FAILED"] = "Create is failed!";
    Message["UPDATE_FAILED"] = "Update is failed!";
    Message["USED_NICK_PHONE"] = "You are inserting already used nick or phone!";
    Message["NO_MEMBER_NICK"] = " No member with that member nick!";
    Message["BLOCKED_USER"] = "You have been blocked, contact restaurant!";
    Message["WRONG_PASWORD"] = "Wrong password, plase try again!";
    Message["NOT_AUTHENTICATED"] = "You are not authenticated, Plase login first!";
    Message["TOKEN_CREATION_FAILED"] = "Token creation error!";
})(Message || (exports.Message = Message = {}));
class Errors extends Error {
    constructor(statusCode, statusMessage) {
        super();
        this.code = statusCode;
        this.message = statusMessage;
    }
}
Errors.standard = {
    code: HttpmCode.INTERNAL_SERVER_ERROR,
    message: Message.SOMETHING_WENT_WRONG,
};
exports.default = Errors;
