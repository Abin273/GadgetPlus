const categorySchema=require('../models/category');


module.exports={
    addCategoryTooDb:(productData)=>{
        return new Promise(async(resolve,reject)=>{
            console.log("hi");
            let category = await new categorySchema({
                name: productData.categoryName,
                description: productData.categoryDescription,
              });
              console.log(category);
              console.log("hello1");
              await category.save()
              .then(()=>{
                  console.log("hello");
                  resolve(category._id);
              }).catch((error)=>{
                console.log("hello error");
                reject(error)
              })
              
        })
    },

    getAllcategory:()=>{
        return new Promise(async (resolve, reject) => {
           await categorySchema.find()
           .then((result)=>{
               resolve(result);
           })
          });
    },

    getAcategory:async (categoryId)=>{
        return new Promise(async (resolve,reject)=>{
            await categorySchema.findById({_id:categoryId})
            .then((result)=>{
                resolve(result)
            })
        })
    },

    editCategory:(categoryAfterEdit)=>{
        return new Promise(async(resolve,reject)=>{
            let category=await categorySchema.findById({_id:categoryAfterEdit.categoryId});
            // console.log(category);
            category.name=categoryAfterEdit.categoryName;
            category.description=categoryAfterEdit.categoryDescription;

            await category.save()
            .then((category)=>{

                resolve(category)
            })
            .catch((error)=>{
                // console.log("catchhhhhhhhhhhhhhhhhhhhhhhhhhhh");
                reject(error)
            })
        })
    },

    softDeleteAProductCategory: async(categoryId)=>{
        return new Promise(async (resolve,reject)=>{
            let category=await categorySchema.findById({_id:categoryId});
            // console.log(category._id == categoryId);
            // console.log("lllllllllllllllllllllllllllllllllll");
            category.status=!category.status;
            category.save()
            resolve(category)
        })
    }
}