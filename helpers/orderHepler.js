const orderSchema = require('../models/orderModel');
const addressSchema = require('../models/addressModel');
const ObjectId = require('mongoose').Types.ObjectId;


function orderDate() {
    const date = new Date();
    console.log(date);
    // let orderDate = date.toLocaleDateString("en-IN", {
    //     year: "numeric",
    //     month: "2-digit",
    //     day: "2-digit",
    // });
    // let orderDate=`${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    // console.log("HHHHHHHHi", orderDate);



    return date
}

module.exports = {
    orderPlacing: (order, totalAmount, cartItems) => {
        return new Promise(async (resolve, reject) => {
            let status = order.payment == 'COD' ? 'placed' : 'pending';
            let date = orderDate();
            let userId = order.userId;
            // let address= await addressSchema.findById({_id:order.addressSelected});
            let addressId = order.addressSelected;
            let orderedItems = cartItems
            console.log("orderedItems", orderedItems);

            console.log("orderedItems orderHelper ", orderedItems);
            let ordered = new orderSchema({
                user: userId,
                address: addressId,
                orderDate: date,
                totalAmount: totalAmount,
                paymentMethod: 'COD',
                addressLookedup: status,
                orderedItems: orderedItems
            })
            await ordered.save();
            console.log("upoladed to dbbbbbbbbbbbbbbb");
            resolve(ordered);
        })
    },


    getAllOrders: () => {
        return new Promise(async (resolve, reject) => {
            await orderSchema.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                }
            ])
                .then((result) => {
                    console.log(result);
                    resolve(result)
                })
        })
    },

    getOrderDetails: (userId) => {
        return new Promise(async (resolve, reject) => {
            const userOrderDetails = await orderSchema.aggregate([
                {
                    $match: { user: new ObjectId(userId) }
                },
                {
                    $lookup:{
                        from:'addresses',
                        localField:'address',
                        foreignField:'_id',
                        as:'addressLookedup'
                    }
                },
                
            ])

            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            console.log("This is aggregation resilt", userOrderDetails);
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");


            resolve(userOrderDetails)
        })
    },

    //------------------=--------------------------------------------------

    getOrderedUserDetailsAddress: (orderId) => {
        return new Promise(async(resolve,reject)=>{
            await orderSchema.aggregate([
                
                {
                    $lookup:{
                        from:'addresses',
                        localField:'address',
                        foreignField:'_id',
                        as:'userAddress'
                    }
                },
                {
                    $match: { _id: new ObjectId(orderId) }
                },
                {
                    $project:{
                        user:1,
                        address:{
                            $arrayElemAt:['$userAddress',0]
                        }
                    }
                },
            ]).then((result)=>{
                console.log(result);
                // console.log("hi");
                // console.log(result);
                // console.log("----------------");
                // console.log(result[0].address);
                // console.log("hi");

                resolve(result[0])
            })
        })
    },

    //------------------=--------------------------------------------------


    getOrderedProductsDetails: (orderId) => {
        return new Promise(async(resolve,reject)=>{
            await orderSchema.aggregate([
                {
                    $match:{_id: new ObjectId(orderId)}
                },
                {
                    $project:{
                        products:{
                            $arrayElemAt:['$orderedItems',0]
                        }
                    }
                },
                {
                    $project:{
                        quantity:{
                            $arrayElemAt:'$products'
                        }
                    }
                }
            ]).then((result)=>{
                console.log("orders",result);
            })
        })
    }

}