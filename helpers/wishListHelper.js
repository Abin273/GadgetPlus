const wishListSchema = require('../models/wishlistModel')
const ObjectId = require('mongoose').Types.ObjectId;


module.exports = {
    addItemToWishList: (productId, user) => {
        return new Promise(async (resolve, reject) => {

            let wishList = await wishListSchema.findOne({ userId: user });
            console.log("1", wishList);

            if (wishList) {
                wishList.updateOne({
                    userId: new ObjectId(user) 
                },
                { 
                    $push: { 
                        products: { productItemId: productId } 
                    } 
                })

                .then((response) => {
                    console.log("response", response);
                    resolve(response)
                })
                   
            } else {
                let wishList = new wishListSchema({
                    userId: user,
                    products: new ObjectId(productId) 
                })

                await wishList.save();

                console.log("2", wishList);

                // await wishList.save();
                resolve(wishList)
            }

        })
    },

    getAllWishListItems: (userId) => {
        return new Promise(async (resolve, reject) => {
            let wishListItems = await wishListSchema.aggregate([
                {
                    $match: { userId: userId }
                },
                {
                    $unwind: '$products'
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: '$products.produtItemId',
                        foreignField: '_id',
                        as: 'wishList'
                    }
                },
                {
                    $project: {
                        item: 1,
                        product: {
                            $arrayElemAt: ['$product', 0]
                        }
                    }
                }
            ])

            resolve(wishListItems)
        })

    }
}