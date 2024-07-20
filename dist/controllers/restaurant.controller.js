"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Member_service_1 = __importDefault(require("../modules/Member.service"));
const member_enum_1 = require("../libs/enums/member.enum");
const Errors_1 = __importStar(require("../libs/Errors"));
const memberService = new Member_service_1.default();
const restaurantController = {};
restaurantController.goHome = (req, res) => {
    try {
        res.render("home");
        console.log('home');
    }
    catch (err) {
        console.log(`Error, goHome:`, err);
        res.redirect("/admin");
    }
};
restaurantController.getSignup = (req, res) => {
    try {
        res.render("signup");
    }
    catch (err) {
        console.log(`Error, getSignup:`, err);
    }
};
restaurantController.getLogin = (req, res) => {
    try {
        res.render("login");
    }
    catch (err) {
        console.log(`Error, getLogin:`, err);
        res.redirect("/admin");
    }
};
restaurantController.processSignup = async (req, res) => {
    try {
        console.log("processSignup");
        const file = req.file;
        console.log("file:", file);
        if (!file)
            new Errors_1.default(Errors_1.HttpmCode.BAD_REQUEST, Errors_1.Message.SOMETHING_WENT_WRONG);
        const newMmember = req.body;
        newMmember.memberImage = file?.path;
        newMmember.memberType = member_enum_1.MemberType.RESTAURANT;
        const result = await memberService.processSignup(newMmember);
        //TODO: SESSIONS AUTHENTACATION
        req.session.member = result;
        req.session.save(function () {
            res.redirect("/admin/login");
        });
    }
    catch (err) {
        console.log("Error, processSignup:", err);
        const message = err instanceof Error ? err.message : Errors_1.Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}); window.location.replace('/admin/signup) </script>`);
    }
};
restaurantController.processLogin = async (req, res) => {
    try {
        console.log("processLogin");
        console.log("body:", req.body);
        const input = req.body;
        const memberService = new Member_service_1.default();
        const result = await memberService.processLogin(input);
        req.session.member = result;
        req.session.save(function () {
            res.redirect("/admin/product/all");
        });
    }
    catch (err) {
        console.log("Error, processLogin:", err);
        const message = err instanceof Error ? err.message : Errors_1.Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}); window.location.replace('admin/login) </script>`);
    }
};
//Logout
restaurantController.logout = async (req, res) => {
    try {
        console.log("logout");
        req.session.destroy(function () {
            res.redirect("/admin"); //redirect bu boshqa linkga yuborish
        });
    }
    catch (err) {
        console.log("Error, processLogin:", err);
        res.redirect("/admin"); //redirect bu boshqa linkga yuborish
    }
};
//getUsers => Restaurant adminlari nimadurni uzgartirishni istashsa qilinadi!
restaurantController.getUsers = async (req, res) => {
    try {
        console.log("getUsers");
        const result = await memberService.getUsers();
        console.log(result);
        res.render("users", { users: result });
    }
    catch (err) {
        console.log("Error, getUsers:", err);
        res.redirect("/admin/login"); //buyerda gar error bersa Login pagega yuboradi!
    }
};
restaurantController.updateChosenUser = async (req, res) => {
    try {
        console.log("updateChoseUser");
        const result = await memberService.updateChoseUser(req.body);
        res.status(Errors_1.HttpmCode.OK).json({ data: result });
    }
    catch (err) {
        console.log("Error updateChoseUser:", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
restaurantController.checkAuthSession = async (req, res) => {
    try {
        console.log("checkAuthSession");
        if (req.session?.member)
            res.send(`<script> alert("${req.session.member.memberNick}) </script>`);
        else
            res.send(`<script> alert("${Errors_1.Message.NOT_AUTHENTICATED}") </script>`);
    }
    catch (err) {
        console.log("Error, checkAuthSession:", err);
        res.send(err);
    }
};
//Nu method bizga murojatchini kimkligini aniqlab beradi
restaurantController.verifyRestaurant = (req, res, next) => {
    if (req.session?.member?.memberType === member_enum_1.MemberType.RESTAURANT) {
        req.member = req.session.member;
        next();
        console.log("parol togri");
        /*buyerdagi algaritim bizfa shu req ni ichida bizga kim kirib kelayotkanini aniqlashda ishlaydi*/
    }
    else {
        const message = Errors_1.Message.NOT_AUTHENTICATED;
        res.send(`<script> alert("${message}"); window.location.replace('/admin/login);</script>`);
        console.log("parol yuq");
    }
};
exports.default = restaurantController;
