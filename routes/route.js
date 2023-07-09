const express = require('express')
const router = express.Router();
const usercontroller = require("../controllers/usercontroller")
const dealershipcontroller = require("../controllers/dealershipcontroller")
const carcontroller = require("../controllers/carcontroller")
const dealcontroller = require("../controllers/dealcontroller")
const admincontroller = require("../controllers/admincontroller")

const middleware = require("../middlewares/middleware")

// Admin API's

router.post("/createAdmin", admincontroller.createAdmin)
router.post("/AdminLogin", admincontroller.AdminLogin)


//User Apis
router.post("/register", usercontroller.createUser)
router.post("/login", usercontroller.userLogin)
router.get("/user/:user_id/getvehicles", middleware.authentication, usercontroller.getUser)

//Dealership Api's

router.post("/dealership/createdealership", middleware.authentication, dealershipcontroller.createdealership)
router.post("/dealership/dealershipLogin", middleware.authentication, dealershipcontroller.dealershipLogin)

router.get("/dealership/cars/getCarswithDealership", middleware.authentication, dealershipcontroller.getCarswithDealership)
router.get("/dealership/deals/getDealswithDealership", middleware.authentication, dealershipcontroller.getDealswithDealership)

router.get("/dealership/sold_vehicles/getVehicleswithDealership", middleware.authentication, dealershipcontroller.getVehicleswithDealership)
router.get("/dealership/cars/getDealershipwithcertainCar", middleware.authentication, dealershipcontroller.getDealershipwithcertainCar)
router.get("/dealership/fetchLocation", middleware.authentication, dealershipcontroller.fetchLocation)

router.put("/dealership/dealership_id/UpdateCar", middleware.authentication, dealershipcontroller.UpdateCar)
router.put("/dealership/dealership_id/UpdateDeal", middleware.authentication, dealershipcontroller.UpdateDeal)
router.put("/dealership/dealership_id/addVehiclepostdeal", middleware.authentication, dealershipcontroller.addVehicle)


//Car Apis

router.post("/cars/createCar", carcontroller.createCar )
router.get("/cars/getCars/car_id",  carcontroller.getCars)

//Deal Apis
router.post("/deal/createdeal", dealcontroller.createdeal)
router.get("/deal/car_id/getDealswithcertainCar", dealcontroller.getDealswithcertainCar)

router.put("/deal/deal_id/addcarpostdeal", dealcontroller.addcar)




router.all("/****", function (req, res) {
    return res.status(404).send({ status: false, msg: "Check whether the Endpoint is Correct or Not" })
})


module.exports = router;