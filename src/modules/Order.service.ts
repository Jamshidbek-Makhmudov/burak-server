import { Order, OrderInquiry, OrderItemInput, OrderUpdateInput } from "../libs/types/order";
import { Member } from "../libs/types/member";
import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/OrderItem.model";
import { shapeIntoMongooseOnjectId } from "../libs/config";
import Errors, { Message } from "../libs/Errors";
import { HttpmCode } from "../libs/Errors";
import { ObjectId} from "mongoose";
import { OrderStatus} from "../libs/enums/order.enum";
import MemberService  from "./Member.service";

class OrderService {
  private readonly orderModel;
  private readonly orderItemModel;
  private readonly memberService;


  constructor () {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
    this.memberService = new MemberService();

  }

  public async createOrder(member: Member, input:OrderItemInput []): Promise<Order> {
    console.log("input:", input);
    const memberId = shapeIntoMongooseOnjectId(member._id);
    const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
      return accumulator + item.itemPrice * item.itemQuantity;
    },0);

    const delivery = amount < 100 ? 5 : 0;


    try {

      const newOrder: Order = await this.orderModel.create({
        orderTotal: amount + delivery,
        orderDelivary: delivery,
        memberId: memberId,
      });


      const orderId = newOrder._id;
      await this.recordOrderItem(orderId, input);



      return newOrder;
    } catch(err) {
      console.log("Error, model:createOrder:", err);
      throw new Errors(HttpmCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  private async recordOrderItem(orderId: ObjectId, input: OrderItemInput []): Promise<void> {
    const promisedList = input.map( async (item: OrderItemInput) => {
      item.orderId = orderId;
      item.productId = shapeIntoMongooseOnjectId(item.productId);
      await this.orderItemModel.create(item);

      return "INSERTED";
    });

    console.log("promisedList:", promisedList);
    const orderItemsState = await Promise.all(promisedList);
    console.log("orderItemsState:", orderItemsState);
  }

  public async getMyOrders(member: Member, inquiry: OrderInquiry):Promise<Order[]> {

    const memberId = shapeIntoMongooseOnjectId(member._id);
    const matches = { memberId: memberId, orderStatus: inquiry.orderStatus};

    const result = await this.orderModel.aggregate([
      {$match: matches},
      {$sort:{updatedAt: -1}},
      {$skip: (inquiry.page -1)*inquiry.limit},
      {$limit: inquiry.limit},
      {
        $lookup: {
          from: "orderItems",
          localField:"_id",
          foreignField: "orderId",
          as: "orderItems",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.productId",
          foreignField: "_id",
          as: "productData"

      }}
    ])
    .exec();

    if(!result) throw new Errors(HttpmCode.NOT_FOUND, Message.NO_DATA_FAUND);
    return result;
  }


  public async updateOrder(member: Member, input:OrderUpdateInput): Promise<Order> {
    const memberId = shapeIntoMongooseOnjectId(member._id),
    orderId = shapeIntoMongooseOnjectId(input.orderId),
    orderStatus = input.orderStatus;


    const result = await this.orderModel.findOneAndUpdate({
      memberId: memberId,
      _id: orderId,
    },
    {orderStatus: orderStatus},
    {new : true}
    ).exec();

    if(!result) throw new Errors(HttpmCode.NOT_MODIFIED, Message.UPDATE_FAILED);


    //orderStatus Pause => Process +1
    if(orderStatus === OrderStatus.PROCESS) {
      await this.memberService.addUserPoint(member, 1);
    }
    return result;

  }
}


export default OrderService;