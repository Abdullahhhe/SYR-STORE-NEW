const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "اسم المنتج مطلوب"],
      trim: true,
    },
    new_price: {
      type: Number,
      required: [true, "السعر مطلوب"],
      min: [0, "السعر لا يمكن أن يكون سالبًا"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      enum:["احذية","مكياجات","اجهزة الألكترونية","ملابس","قرطاسية","اكسسوارات","ادوات منزلية"],
      default: "عام",
      trim: true,
    },
    image: {
      type: String,
      default: "", // رابط الصورة بعد الرفع
    },
    quantity: {
      type: Number,
      default: 1,
      min: [0, "الكمية لا يمكن أن تكون سالبة"],
    },
    color:{
      type:Array,
      default:[""]
    },
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: [true, "معرف التاجر مطلوب"],
    },
  },
  {
    timestamps: true, // يضيف createdAt و updatedAt تلقائيًا
  }
);

module.exports =
  mongoose.models?.Product || mongoose.model("Product", productSchema);