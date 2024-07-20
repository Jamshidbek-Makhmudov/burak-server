import{T} from "../libs/types/common";
import { NextFunction, Request, Response } from "express";
import MemberService from "../modules/Member.service";
import { ExtendedRequest, LoginInput, Member, MemberInput, MemberUpdateInput } from "../libs/types/member";
import Errors, { HttpmCode, Message } from "../libs/Errors";
import AuthService from "../modules/Auth.service";
import { AUTH_TIMER } from "../libs/config";

const memberService = new MemberService();
const authService = new AuthService ();

//REACT
const memberController: T = {};




/*GET RESTAURANT*/
memberController.getRestaurant =async (req:Request, res: Response) => {

  try {
    console.log("getRestaurant", memberController.getRestaurant);
    const result = await memberService.getRestaurant();


    res.status(HttpmCode.OK).json(result);
  } catch (err) {
    console.log("Error, signup:", err);
    if(err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);

  }
}

memberController.signup = async  (req: Request, res: Response) => {
  try {
    console.log("signup");
    console.log("body:", req.body);

    const input: MemberInput = req.body,
     result: Member = await memberService.signup(input);
     const token = await authService.createToken(result);


     res.cookie("accessToken", token,
     { maxAge: AUTH_TIMER *3600 *1000,
       httpOnly: false
     });


    res.status(HttpmCode.CREAT).json({member: result, accessToken: token});
  } catch (err) {
    console.log("Error, signup:", err);
    if(err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);

  }
};

memberController.login = async (req: Request, res: Response) => {
  try {
    console.log("login");
    const input: LoginInput = req.body,
     result = await memberService.login(input),
     token = await authService.createToken(result);

    res.cookie("accessToken", token,
    { maxAge: AUTH_TIMER *3600 *1000,
      httpOnly: false
    });


    res.status(HttpmCode.OK).json({member: result, accessToken: token});
  } catch (err) {
    console.log("Error, login:", err);
    if(err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};


/*LOGOUT*/

memberController.logout = (req: ExtendedRequest, res:Response) => {
  try {
    console.log("logout");
    res.cookie("acceessToklen", null, {maxAge: 0, httpOnly: true});
    res.status(HttpmCode.OK).json({logout: true});
  }catch(err) {
    console.log("Error, logout:", err);
    if(err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
}

/*MEMBERDETAIL*/
memberController.getMemberDetail = async (req: ExtendedRequest, res:Response) => {
  try {
    console.log("getMemberDetail");
    const result = await memberService.getMemberDetail(req.member);
    res.status(HttpmCode.OK).json(result);


  }catch(err) {
    console.log("Error, getMemberDetail:", err);
    if(err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
}


/*UDATEUSERS*/
memberController.updateMember = async (req:ExtendedRequest, res: Response ) => {
  try {
    console.log("updateMember");
    const input: MemberUpdateInput = req.body;

    if(req.file) input.memberImage = req.file.path.replace(/\\/, "/");
    const result = await memberService.updateMember(req.member, input);


    res.status(HttpmCode.OK).json(result);

  }catch(err) {
    console.log("Error, getMemberDetail:", err);
    if(err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
}

memberController.getTopUsers = async( req:Request, res:Response) => {

  try {
    console.log("getTopUsers");

    const result = await memberService.getTopUsers();

    res.status(HttpmCode.OK).json(result);
  }catch(err) {
    console.log("Error, getMemberDetail:", err);
    if(err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }


}





memberController.verifyAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
  ) => {

  try {
    let member = null;
    const token =req.cookies["accessToken"];
    if(token) req.member = await authService.checkAuth(token);

    if(!req.member)
     throw new Errors(HttpmCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

     next();
    // console.log("member:", member);
    // res.status(HttpmCode.OK).json({member: member});

  }catch (err) {
    console.log("Error, verifyAuth:", err);
    if(err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }

}




memberController.retrieveAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
  ) => {

  try {
    const token =req.cookies["accessToken"];
    if(token) req.member = await authService.checkAuth(token);

    next();
  }catch (err) {
    console.log("Error, retrieveAuth:", err);
    next();
  }

}



export default memberController;