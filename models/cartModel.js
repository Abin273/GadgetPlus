const mongoose=require('mongoose')

const cartModel=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    products:[
        {
            productItemId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'products'
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
              },
        }
    ],
    // coupon:{
    //     type:String,
    //     default:0
    // },
    totalAmount:{
        type:Number,
        reqruire:true
    },
    
    // status:{
    //     type:Boolean,
    //     default:true
    // }
},
{
    timestamps:true
}
)


module.exports=new mongoose.model('Cart',cartModel)