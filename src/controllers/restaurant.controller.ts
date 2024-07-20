import{T} from "../libs/types/common";
import { NextFunction, Request, Response } from "express";
import MemberService from "../modules/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpmCode, Message } from "../libs/Errors";

const memberService = new MemberService();


const restaurantController: T = {};
restaurantController.goHome = (req: Request, res: Response) => {
  try {
    res.render("home");
    console.log('home');

  } catch (err) {
    console.log(`Error, goHome:`, err);
    res.redirect("/admin");

  }

}


restaurantController.getSignup = (req: Request, res: Response) => {
  try {
    res.render("signup");
  } catch (err) {
    console.log(`Error, getSignup:`, err)
  }

};

restaurantController.getLogin = (req: Request, res: Response) => {
  try {
    res.render("login");
  } catch (err) {
    console.log(`Error, getLogin:`, err);
    res.redirect("/admin");
  }

}




restaurantController.processSignup = async  (req: AdminRequest, res: Response) => {
  try {
    console.log("processSignup");
    const file =req.file;
    console.log("file:",file);

    if(!file)  new Errors(HttpmCode.BAD_REQUEST,  Message.SOMETHING_WENT_WRONG );



    const newMmember: MemberInput = req.body;
    newMmember.memberImage = file?.path;
    newMmember.memberType = MemberType.RESTAURANT;
    const result = await memberService.processSignup(newMmember);
    //TODO: SESSIONS AUTHENTACATION

    req.session.member = result;
    req.session.save( function() {
       res.redirect("/admin/login");
    });
  } catch (err) {
    console.log("Error, processSignup:", err);
    const message = err instanceof Error ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script> alert("${message}); window.location.replace('/admin/signup) </script>`);  }
};

restaurantController.processLogin = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processLogin");
    console.log("body:", req.body);
    const input: LoginInput = req.body;

    const memberService = new MemberService();
    const result = await memberService.processLogin(input);

    req.session.member = result;
    req.session.save( function() {
      res.redirect("/admin/product/all");
    });

  } catch (err) {
    console.log("Error, processLogin:", err);
    const message = err instanceof Error ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(`<script> alert("${message}); window.location.replace('admin/login) </script>`);  }
};



//Logout
restaurantController.logout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("logout");
    req.session.destroy(function () {
      res.redirect("/admin");//redirect bu boshqa linkga yuborish
    })
  } catch (err) {
    console.log("Error, processLogin:", err);
    res.redirect("/admin");//redirect bu boshqa linkga yuborish
  }
};


//getUsers => Restaurant adminlari nimadurni uzgartirishni istashsa qilinadi!
restaurantController.getUsers = async (req: Request, res: Response) => {
  try{
    console.log("getUsers");
    const result = await memberService.getUsers();
    console.log(result);
    res.render("users", {users: result});
  }catch(err) {
    console.log("Error, getUsers:", err);
    res.redirect("/admin/login");//buyerda gar error bersa Login pagega yuboradi!
  }
};


restaurantController.updateChosenUser = async (req:Request, res:Response) => {
  try {
    console.log("updateChoseUser");
    const result = await memberService.updateChoseUser(req.body);

    res.status(HttpmCode.OK).json({data: result});
  }catch (err) {
    console.log("Error updateChoseUser:",err);
    if(err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
}








restaurantController.checkAuthSession = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("checkAuthSession");
    if(req.session?.member)
    res.send(`<script> alert("${req.session.member.memberNick}) </script>`);
  else res.send(`<script> alert("${ Message.NOT_AUTHENTICATED}") </script>`);
  } catch (err) {
    console.log("Error, checkAuthSession:", err);
    res.send(err);
  }
};

//Nu method bizga murojatchini kimkligini aniqlab beradi
restaurantController.verifyRestaurant = (
   req: AdminRequest,
   res: Response,
  next: NextFunction
  ) => {

      if(req.session?.member?.memberType === MemberType.RESTAURANT) {
        req.member = req.session.member;
        next();
        console.log("parol togri")
        /*buyerdagi algaritim bizfa shu req ni ichida bizga kim kirib kelayotkanini aniqlashda ishlaydi*/
      }else {
       const message = Message.NOT_AUTHENTICATED;
         res.send (
         `<script> alert("${message}"); window.location.replace('/admin/login);</script>`
         );
         console.log("parol yuq")
      }
}

export default restaurantController;