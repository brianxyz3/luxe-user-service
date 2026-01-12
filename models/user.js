const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  userRole: {
    type: String,
    enum: ["admin", "employee", "customer"],
  },
  cart: [{
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
  }],
  order: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);