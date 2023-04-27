const express=require('express');
const router=express.Router();

const {adminAuthenticationChecking,adminChecking} = require('../middlewares/sessionHandling')
const multer=require('../middlewares/multer')
const adminController=require('../controllers/adminController');
const productHelper = require('../helpers/productHelper');



router.get('/',adminAuthenticationChecking,adminController.adminLogin);

router.get('/admin-home',adminChecking,adminController.adminHome)

router.post('/adminLogin',adminController.adminLoginPost);

router.get('/users-List',adminChecking,adminController.usersList);

router.get('/block-unblock-user/:id',adminChecking,adminController.blockUnBlockUser);

// router.get('/unBlock-user/:id',adminChecking,adminController.unBlockUser);


router.get('/product',adminChecking,adminController.productList); 

router.get('/add-product',adminChecking,adminController.addProduct);

router.post('/add-product',adminChecking,multer.productUpload,adminController.postAddProduct);

router.get('/edit-product/:id',adminChecking,adminController.editProduct);

router.post('/edit-product/:id',adminChecking,multer.productUpload,adminController.postEditProduct)

router.get('/delete-product/:id',adminChecking,adminController.deleteProduct);



router.get('/product-categories',adminChecking,adminController.productCategory); 

router.post('/add-productCategory',adminChecking,adminController.postAddProductCategory);

router.get('/edit-productCategory/:id',adminChecking,adminController.editProductCategory);

router.get('/delete-productCategory/:id',adminChecking,adminController.deleteProductCategory)


router.get('/orders',adminChecking,adminController.orders);

router.get('/banner',adminChecking,adminController.banners);

router.get('/coupon',adminChecking,adminController.coupons);

router.get('/userProfile/:id',adminChecking,adminController.userProfile);

router.get('/Logout',adminController.adminLogout)


// router.get('/',adminController.);

module.exports=router;