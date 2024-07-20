export enum HttpmCode {
  OK = 200,
  CREAT =201,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}


export enum Message {
  SOMETHING_WENT_WRONG = "Something went wrong!",
  NO_DATA_FAUND = "No data is found!",
  CREATE_FAILED = "Create is failed!",
  UPDATE_FAILED = "Update is failed!",

  USED_NICK_PHONE = "You are inserting already used nick or phone!",
  NO_MEMBER_NICK = " No member with that member nick!",
  BLOCKED_USER ="You have been blocked, contact restaurant!",
  WRONG_PASWORD = "Wrong password, plase try again!",
  NOT_AUTHENTICATED = "You are not authenticated, Plase login first!",
  TOKEN_CREATION_FAILED = "Token creation error!",

}

class Errors extends Error {
  public code: HttpmCode;
  public message: Message;


  static standard = {
    code: HttpmCode.INTERNAL_SERVER_ERROR,
    message: Message.SOMETHING_WENT_WRONG,
  }

  constructor(statusCode: HttpmCode, statusMessage: Message) {
    super();
    this.code = statusCode;
    this.message = statusMessage;
  }
}

export default Errors;