import mongoose, {Schema} from "mongoose";


const orderItemSchema = new Schema ({
  itemQuantity: {
    type: Number,
    required: true
  },

  itemPrice: {
    type:Number,
    required: true
  },

  orderId: {
    type:Schema.Types.ObjectId,
    ref: "Order"
  },

  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },


},
 { timestamps: true, collection: "orderItems"});
 //bu orqali biz mongodbni filenini nomini belgilab oldik


export default mongoose.model("OrderItem", orderItemSchema);