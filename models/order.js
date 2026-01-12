const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    cart: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        productName: {
          type: String,
        },
        productBrandName: {
          type: String,
        },
        productImg: String,
        price: {
          type: Number,
        },
        units: {
          type: Number,
        },
      },
    ],

    status: {
      type: String,
      enum: ["Pending", "Cancelled", "Completed"],
      default: "Pending",
    },

    deliveryAddress: String,
    totalAmount: Number,

    paymentOption: {
      type: String,
      enum: ["payment on delivery", "cryptocurrency transfer", "bank transfer"],
    },
    orderBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
