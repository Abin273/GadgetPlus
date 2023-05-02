
const userSchema = require('../models/userModel');
const userHelper = require('../helpers/userHelper');
const productHelper = require('../helpers/productHelper')
const categoryHelper = require('../helpers/categoryHelper')
const cartHelper = require('../helpers/cartHelper')
const twilio = require('../api/twilio');
const adminHelper = require('../helpers/adminHelper');
const addressHelper = require('../helpers/addressHelper');
let loginStatus;


const landingPage = async (req, res) => {
    try {
        res.render('user/index')
    } catch (error) {
        console.log(error);
    }
}

const userHome = async (req, res) => {
    try {
        res.status(200).render('user/index', { loginStatus })
    } catch (error) {
        console.log(error);
    }
}

const error = (req, res) => {
    res.render('/error')
}

//---------------------------------------------------------
const userSignup = async (req, res) => {
    res.render('user/user-signup', { user: true })
}


const userSignupPost = async (req, res) => {
    userHelper.doSignup(req.body).then((response) => {
        if (!response.userExist) {
            res.redirect('/user-login')
        } else {
            res.redirect('/')
        }
    })
}
//---------------------------------------------------------


//---------------------------------------------------------

const userLogin = async (req, res) => {
    res.render('user/login', { user: true, loggedInError: req.session.loggedInError })
    // req.session.loggedInError = false;
}

const userLoginPost = async (req, res) => {

    await userHelper.doLogin(req.body).then((response) => {
        // console.log("----------------");
        // console.log(response);
        // console.log("----------------");

        if (response.loggedIn) {
            req.session.user = response.user;
            loginStatus = req.session.user
            // console.log( "sesionr",req.session.user._id);

            // res.redirect('/')
            return res.status(202).json({ error: false, message: response.logginMessage })

        } else {
            // req.session.loggedInError = response.loggedInError;
            return res.status(401).json({ error: false, message: response.logginMessage })

            // res.redirect('/user-login')
        }
    })
}

const forgotPassword = (req, res) => {
    try {
        res.render('user/otp-mobile-forgotpswd')
    } catch (error) {
        console.log(error);
    }
}

const otpSendingForgot = async (req, res) => {
    try {
        const find = req.body;

        req.session.mobile = find.phone;
        await userSchema.findOne({ phone: find.phone })
            .then(async (userData) => {
                if (userData) {
                    console.log(userData + "find mobile no from db");
                    await twilio.sentOtp(find.phone);
                    res.render('user/otp-fill-forgotpswd');
                } else {
                    console.log("mobile not found");
                    res.redirect('/user-signup')
                }
            })
            .catch((error) => {
                console.log(error + "ERROR");
                res.redirect('/user-signup')
            })

    } catch (error) {
        console.log(error);
    }
}

const otpVerifyingForgot=async (req,res)=>{
    const phone = req.session.mobile;
    const otp = req.body.otp;
    await twilio.verifyOtp(phone, otp)
        .then((status) => {
            console.log(status);
            if (status) {
                console.log("verification successfulllllllllllllllllllll");
                res.render('user/resetPassword');
            } else {
                console.log("invalid otp");
                res.redirect('/user-signup')
            }
        }).catch((error) => {
            console.log(error + "error occured");
        })
}

const resetPassword=async (req,res)=>{
    try {
        const phone = req.session.mobile;
        let newPassword=req.body.confirmPassword;
        let user=await userHelper.changePassword(newPassword,phone);
        console.log("resetted",user,"resetted");
        res.redirect('/user-login')
        
    } catch (error) {
        console.log(error);
    }
    
}

//---------------------------------------------------------


// otp login page
const otpUser = (req, res) => {
    res.render('user/otp-form', { loginStatus })
}

// otp sending in login process
const otpSending = async (req, res) => {
    const find = req.body;
    req.session.mobile = req.body.phone;
    console.log(req.body.phone);
    await userSchema.findOne({ phone: find.phone })
        .then(async (userData) => {
            if (userData) {
                console.log(userData + "find mobile no from db");
                req.session.tempUser = userData;
                await twilio.sentOtp(find.phone);
                res.render('user/otp-fill');
            } else {
                console.log("mobile not found");
                res.redirect('/user-signup')
            }
        })
        .catch((error) => {
            console.log(error + "ERROR");
            res.redirect('/user-signup')
        })
}

// otp verification process

const otpVerifying = async (req, res) => {
    const phone = req.session.mobile;
    const otp = req.body.otp;
    await twilio.verifyOtp(phone, otp)
        .then((status) => {
            console.log(status);
            if (status) {
                req.session.user = req.session.tempUser;
                loginStatus = req.session.user
                console.log("loggin successfulllllllllllllllllllll");
                res.redirect('/')
            } else {
                console.log("invalid otp");
                res.redirect('/user-signup')
            }
        }).catch((error) => {
            console.log(error + "error occured");
        })
}

// -------------------------------------------------

const userLogout = async (req, res) => {
    try {
        req.session.user = false;
        loginStatus = false;
        // req.session.loggedIn = false;
        res.redirect('/')
    } catch (error) {
        console.log(error);
    }
}



const profile = async (req, res) => {
    try {
        let userId = req.session.user._id;
        let addresses = await addressHelper.findAddresses(userId);

        console.log("addressese");
        console.log(addresses);
        console.log("addressese");


        console.log("////////", loginStatus);
        res.render('user/profile', { loginStatus, addresses })
    } catch (error) {
        console.log(error);
    }
}


const about = async (req, res) => {
    res.render('user/about', { loginStatus })
}

const viewProduct = async (req, res) => {
    // console.log(req.params.id,"iddddddddddddddddd");
    productHelper.getAllProductsByCategory(req.params.id)
        .then((response) => {
            res.render('user/view-product', { product: response, loginStatus })
        })
}



const wishlist = async (req, res) => {
    res.render('user/wishlist', { loginStatus })
}


//---------------------------------------------------------

const cart = async (req, res) => {
    try {
        let user = req.session.user;
        let cartItems = await cartHelper.getAllCartItems(user._id)
        res.render('user/cart', { loginStatus, cartItems })
    } catch (error) {
        console.log(error);
    }
}

const addToCart = async (req, res) => {
    let productId = req.params.id;
    // console.log("---------------------1");
    // console.log(productId);
    // console.log("---------------------1");
    try {
        let user = req.session.user;
        // console.log("---------------------2");
        // console.log(user);
        // console.log("---------------------2");
        let userId = user._id;
        if (user) {
            await cartHelper.addToUserCart(userId, productId)
                .then((response) => {
                    res.status(202).json({ error: false, message: "item added to cart" })
                })
        }
    } catch (error) {
        console.log(error);
        res.status(500).redirect('/404')
    }
}


const removeFromCart = (req, res) => {
    console.log("hello");
    console.log(req.params);
    cartHelper.removeAnItemFromCart(req.params.id)
        .then()
}

//---------------------------------------------------------

const checkout = async (req, res) => {
    res.render('user/checkout', { loginStatus })
}

// const quickView = async (req, res) => {
//     res.render('user/product')
// }


const addAddress = async (req, res) => {
    try {

        console.log("-------------------------------");
        console.log(req.body);
        console.log("-------------------------------");
        addressHelper.addAddress(req.body)
            .then((response) => {
                console.log(response);
                res.status(202).json({ message: "address added successfully" });

            })

    } catch (error) {
        console.log(error);
    }

    // res.render('user/mobile')
}


const editAddress = async (req, res) => {
    res.render('user/mobile')
}

const payment = async (req, res) => {
    res.render('user/mobile')
}

const orderDetails = async (req, res) => {
    res.render('user/mobile')
}

const product = async (req, res) => {
    res.render('user/product', { loginStatus })
}

const orderSummary = async (req, res) => {
    res.render('user/mobile')
}

const contact = async (req, res) => {
    res.render('user/contact', { loginStatus })
}

const notFound404 = async (req, res) => {
    res.render('user/404')
}

module.exports = {
    landingPage,
    userHome,
    profile,
    userSignup,
    userSignupPost,
    userLogin,
    userLoginPost,
    forgotPassword,
    otpSendingForgot,
    otpVerifyingForgot,
    resetPassword,

    otpUser,
    otpSending,
    otpVerifying,
    userLogout,
    about,
    viewProduct,
    wishlist,

    cart,
    addToCart,
    removeFromCart,
    error,
    checkout,
    // quickView,
    addAddress,
    editAddress,
    payment,
    orderDetails,
    orderSummary,
    contact,
    product,
    notFound404,

}