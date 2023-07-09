const dealership = require("../models/dealership");
const cars = require("../models/cars");   
const deal = require("../models/deal");
const sold_vehicles = require("../models/sold_vehicles");
const axios = require("axios")


const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { isValidRequestBody,
    isValid,
    isValidId,
    isValidEmail,
    } = require("../validator/validation");


    const createdealership = function(req, res){
  
        let data = req.body
        let {dealership_id, dealership_name , dealership_email, dealership_location, password,  dealership_info, cars , deal , sold_vehicles} = data
        
         //if entries are empty
        if (!isValidRequestBody(data)) {
          return Promise.resolve(res.status(400).send({
            status: false,
            message: "data is required",
          }))
        }
    
    //checking for dealership name in dealership_model

        if (!isValid(dealership_name)) {
            return res.status(400).send({ status: false, message: "Provide the dealership_name Name Feild" });
        }

        if (!/^[a-zA-Z ]{2,30}$/.test(dealership_name)) {
            return res.status(400).send({ status: false, message: "Enter valid dealership_name" });
        }

     //checking for dealership id in dealership_model

         if (!isValid(dealership_id)) {
          return Promise.resolve(res.status(400).send({ status: false, message: "Provide user_id" }));
      }
    
      if (!isValidId(dealership_id)) {
        return Promise.resolve(res.status(400).send({ status: false, message: "Provide the Valid user_id" }));
    }
    
    //checking  for dealership location in dealership_model
    
        if (!isValid(dealership_location)) {
          return Promise.resolve(res.status(400).send({ status: false, message: "Provide user_location Feild" }));
      }
    
      if (!/^[a-zA-Z ]{2,30}$/.test(dealership_location)) {
          return Promise.resolve(res.status(400).send({ status: false, message: "Enter valid user_location" }));
      }
        
      //checking uniqueness for email in usermodel
       
        if (!isValid(dealership_email)) {
          return Promise.resolve(res.status(400).send({ status: false, message: "Provide the dealership_email Feild" }));
      }
    
      if (!isValidEmail(dealership_email)) {
          return Promise.resolve(res.status(400).send({ status: false, message: "Provide the Valid dealership_email " }));
      }
    
      dealership.findOne({ dealership_email: dealership_email })
        .then(checkmail => {
          if (checkmail) {
            return Promise.resolve(res.status(400).send({ status: false, message: `${email} is Already Registered` }));
          }})
    
                //====== cars validation============
        
          if (!isValid(cars)) {
            return Promise.resolve(res.status(400).send({ status: false, message: "car details are required" }));
          }
         
          cars.findById(car_id)
         .then(carExist => {
          if (!carExist) {
            return Promise.resolve(res.status(400).send({ status: false, msg: "Invalid car details!" }));
          } })
    
          //====== sold_vehicles validation============
        
          if (!isValid(sold_vehicles)) {
            return Promise.resolve(res.status(400).send({ status: false, message: "vehicle detail is required" }));
          }
         
          sold_vehicles.findById(vehicle_id)
         .then(vehicleExist => {
          if (!vehicleExist) {
            return Promise.resolve(res.status(400).send({ status: false, msg: "Invalid vehicle!" }));
          } })

          //====== deals validation============
        
          if (!isValid(deal)) {
            return Promise.resolve(res.status(400).send({ status: false, message: "vehicle detail is required" }));
          }
         
          deal.findById(deal_id)
         .then(dealExist => {
          if (!dealExist) {
            return Promise.resolve(res.status(400).send({ status: false, msg: "Deal doesn't exist!" }));
          } })
          

         //============password validation=======
        
         if (!isValidPassword(password)) {
          return Promise.resolve(res.status(400).send({
            status: false,
            message: "provide valid password"
          }));
        }
    
        if (!isValidPassword(password)) {
          return Promise.resolve(res.status(400).send({ status: false, message: "Password Length must be in btwn 8-15 chars only" }));
      }
    
      const saltRounds = 10;
      return bcrypt.hash(password, saltRounds)
    
    .then(encryptedPassword => {
      data["password"] = encryptedPassword  })      // setting attribute
    
       
        // checking dealership_info in dealership
       
        if (dealership_info) {
            let objdealership_info = JSON.parse(dealership_info);
           
              
                if (objdealership_info.dealership_details) {
                if (!isValid(objdealership_info.dealership_details.SecurityIntrest)) {
                    return Promise.resolve(res.status(400).send({ status: false, message: "Please provide Security Intrest in user_details" }));
                }
                if (!isValid(objdealership_info.dealership_details.Registration_Number)){
                    return Promise.resolve(res.status(400).send({ status: false, message: "Please provide Registration_Number in user_details" }));
                }
                if (!isvalid(dealership_info.dealership_details.Warrant))
                {
                    return Promise.resolve(res.status(400).send({ status: false, message: "Please provide Warrant in user_details" }));
            } 
          
            data["dealership_info"] = objdealership_info;
          }
            else {
              return Promise.resolve(res.status(400).send({ status: false, message: "Please Provide user_details in user_info" }));
            }
          }
          //creating user data
          return dealership.create(data)
      
        .then(createNew => {
          return Promise.resolve(res.status(201).send({ status: true , message: "dealership created succesfully"}));
        })
        .catch (err => {
          return Promise.resolve(res.status(500).send({ status: false, message: err }))
        })
      }
    //---------------------- generation of token ----------------------------------- 
     
     const dealershipLogin = async function (req, res) {
      
          const data = req.body;
          const { dealership_email, password } = data;
    
          //request body empty or not
          if (!isValidRequestBody(data)) {
              return Promise.resolve(res.status(400).send({ status: false, message: "Please Enter Login Credentials" }));
          }
    
          //emailId validation
          if (!isValid(dealership_email)) {
              return Promise.resolve(res.status(400).send({ status: false, message: "Email is Required" }));
          }
          if (!isValidEmail(dealership_email)) {
              return Promise.resolve(res.status(400).send({ status: false, message: "Invalid Email Address" }));
          }
    
          //password validation
          if (!isValid(password)) {
              return  Promise.resolve(res.status(400).send({ status: false, message: "Password is Required" }));
          }
          if (!isValidPassword(password)) {
              return Promise.resolve(res.status(400).send({ status: false, message: "Password Length should be in 8-15 chars only " }));
          }
    
          //checking Login Credentials
          dealership.findOne({ dealership_email:dealership_email })
          .then(dealership => {
            if (!dealership) {
              return Promise.resolve(res.status(404).send({ status: false, message: "Invalid User, Login Credentials Doesn't Matched" }));
            }})
    
          //checking req body password and DB's decryptPassword is same or not using "bcrypt package"
          const decrypPassword = dealership.password;
          return bcrypt.compare(password, decrypPassword)
          
          .then(pass => {
            
            if (!pass) {
              return Promise.resolve(res.status(400).send({ status: false, message: "Password Incorrect" }));
             } 
      
    
          // Creating Token Here
          const token = jwt.sign(
              { dealershipId: dealership._id }, "NerveSparks12",
              { expiresIn: "72hr" }
          );
    
          //restrucing response and set token 
          let obj = {
            dealershipId: dealership._id,
            token: token,
          };
    
          res.setHeader("Authorization", token);
    
          return Promise.resolve(res.status(201).send({ status: true, message: "dealershipper LoggedIn Succesfully", data: obj }))
      . catch (err => {
          return res.status(500).send({ status: false, message: err.message });
      });
    })
    
     }
    

     // To view all cars sold by dealership & To view all cars in a dealership
     
     const getCarswithDealership = function(req, res) {
  
        const cars = req.params.cars;
  
        //cars validation

        if (!isValid(cars)) {
            return res.status(400).send({ status: false, message: "please provide cars field" })
        }
  
        //if CAR exist than providing the CAR's data 
        
        return dealership.find({cars:cars})
        .then(carExist => {
            if (!carExist) {
              return Promise.resolve(res.status(400).send({ status: false, msg: "Deal doesn't exist!" }));
            }  
        
          return Promise.resolve(res.status(200).send({ status: true , message: "Cars returned succesfully"}));
        })
        
        .catch(err => {
          return Promise.resolve(res.status(500).send({ status: false, message: err }))
        })
  }

  //To add cars to dealership
  
  const UpdateCar = function(req, res) { 

    let dealership_id = req.params.dealership_id
    let data = req.body

    let { cars } = data; // destructuring req.body

    if (!data || (Object.keys(data).length == 0))
    return Promise.resolve(res.status(400).send({ status: false, message: "Provide Data in Body" }));

    if (!isValidId(dealership_id)) {
        return Promise.resolve(res.status(400).send({ status: false, message: "Please provide valid dealership_id" }));
    }
    

    let newObj = {};

    if (cars != null) {
        if (!isValid(cars)) {
            return Promise.resolve(res.status(400).send({ status: false, message: "Provide the cars field " }));
        }
        return cars.findById({car_id:car_id})
        .then(cars => {
            if (!dealExist) {
              return Promise.resolve(res.status(400).send({ status: false, msg: "Deal doesn't exist!" }));
            }})  
          }
        newObj["cars"] = cars;
    
    
    if (cars != null) {
        if (!isValid(cars)) {
            return Promise.resolve(res.status(400).send({ status: false, message: "Provide the cars field " }));
        }

        newObj["cars"] = cars;
    }
    
     
    return dealership.findByIdAndUpdate(
        { _id: dealership_id },
        // { $set: newObj },
        { $set: newObj },
        { new: true }
        .then(dealership => { 
        
          return Promise.resolve(res.status(200).send({ status: true , message: "Cars returned succesfully"}));
        })
        
        .catch(err => {
          return Promise.resolve(res.status(500).send({ status: false, message: err }))
        }) )
  }
 

  // To view deals provided by dealership
   
  const getDealswithDealership = function(req, res) {
  
        const deals = req.params.deals;
  
        //cars validation

        if (!isValid(deals)) {
            return res.status(400).send({ status: false, message: "please provide deals field" })
        }
  
        //if CAR exist than providing the CAR's data 
        
        return dealership.find({vehicle_info: vehicle_info})
        
        .then(vehicleExist => {
            if (!vehicleExist) {
              return Promise.resolve(res.status(400).send({ status: false, msg: "Vehicle doesn't exist!" }));
            }  
        
          return Promise.resolve(res.status(200).send({ status: true , message: "Vehicles returned succesfully"}));
        })
        
        .catch(err => {
          return Promise.resolve(res.status(500).send({ status: false, message: err }))
        })
  }


  //To add deals to dealership
 
  const UpdateDeal = function(req, res) { 

    let dealership_id = req.params.dealership_id
    let data = req.body

    let { deals } = data; // destructuring req.body

    if (!data || (Object.keys(data).length == 0))
    return Promise.resolve(res.status(400).send({ status: false, message: "Provide Data in Body" }));

    if (!isValidId(dealership_id)) {
        return Promise.resolve(res.status(400).send({ status: false, message: "Please provide valid dealership_id" }));
    }
    
    let newObj = {};

    if (deals != null) {
        if (!isValid(deals)) {
            return Promise.resolve(res.status(400).send({ status: false, message: "Provide the cars field " }));
        }
        return deals.findById({deal_id:deal_id})
        .then(deals => {
            if (!dealExist) {
              return Promise.resolve(res.status(400).send({ status: false, msg: "Deal doesn't exist!" }));
            }})  
          }
        newObj["deals"] = deals;
    
    
     
    return dealership.findByIdAndUpdate(
        { _id: dealership_id },
        // { $set: newObj },
        { $set: newObj },
        { new: true }
        .then(dealership => { 
        
          return Promise.resolve(res.status(200).send({ status: true , message: "Deals returned succesfully"}));
        })
        
        .catch(err => {
          return Promise.resolve(res.status(500).send({ status: false, message: err }))
        }) )
      }
 
      // get vehicles with Dealership
     
      const getVehicleswithDealership = function(req, res) {
  
        const sold_vehicles = req.params.sold_vehicles;
  
        //cars validation

        if (!isValid(sold_vehicles)) {
            return res.status(400).send({ status: false, message: "please provide sold_vehicles field" })
        }
  
        //if CAR exist than providing the CAR's data 
        
        return dealership.find({sold_vehicles: sold_vehicles})
        
        .then(sold_vehicles => {
            if (!sold_vehicles) {
              return Promise.resolve(res.status(400).send({ status: false, msg: "Vehicle doesn't exist!" }));
            }  
        
          return Promise.resolve(res.status(200).send({ status: true , message: "Vehicles returned succesfully"}));
        })
        
        .catch(err => {
          return Promise.resolve(res.status(500).send({ status: false, message: err }))
        })
  }
 
  const getDealershipwithcertainCar = function(req, res) {
  
    const cars = req.params.cars;

    //cars validation

    if (!isValid(cars)) {
        return res.status(400).send({ status: false, message: "please provide cars field" })
    }

    //if CAR exist than providing the CAR's data 
    
     dealership.find({cars:cars})
    .then(carExist => {
        if (!carExist) {
          return Promise.resolve(res.status(400).send({ status: false, msg: "Cars doesn't exist!" }));
        }} )
    
        return cars.findById({car_id:car_id})
        
        .then(cars => {
            if (!cars) {
              return Promise.resolve(res.status(400).send({ status: false, msg: " Specific Car doesn't exist!" }));
            }  
        
          return Promise.resolve(res.status(200).send({ status: true , message: "Specific Car returned succesfully"}));
        })
        
        .catch(err => {
          return Promise.resolve(res.status(500).send({ status: false, message: err }))
        })
      }


      // To add new vehicle to the list of sold vehicles after a deal is made
      
      const addVehicle = function(req, res) { 

        let dealership_id = req.params.dealership_id
        let data = req.body
    
        let { sold_vehicles } = data; // destructuring req.body
    
        if (!data || (Object.keys(data).length == 0))
        return Promise.resolve(res.status(400).send({ status: false, message: "Provide Data in Body" }));
               
    
        let newObj = {};
    
        if (sold_vehicles != null) {
            if (!isValid(sold_vehicles)) {
                return Promise.resolve(res.status(400).send({ status: false, message: "Provide the cars field " }));
            }
           
    
            newObj["sold_vehicles"] = sold_vehicles;
        }
        
         
        return dealership.findOneAndUpdate(
            { _id: dealership_id },
            // { $set: newObj },
            { $set: newObj },
            { new: true }
            .then(dealership => { 
            
              return Promise.resolve(res.status(200).send({ status: true , message: "Cars returned succesfully"}));
            })
            
            .catch(err => {
              return Promise.resolve(res.status(500).send({ status: false, message: err }))
            }) )
      }

      // To view the dealerships within a certain range based on user location
      
      const fetchLocation = () => {
        return new Promise((resolve, reject) => {
          axios
            .get('https://console.cloud.google.com/apis/credentials?project=nth-honor-392318', {
              
            headers: {
                'x-rapidapi-host': 'console.cloud.google.com',
                'x-rapidapi-key': AIzaSyAf9P16heqVfXrNDCabGsKTaupu0_c26zM,
              },
              params: { category: 'all', count: '10' },
            })
            .then((res) => {
              resolve(res.data);
            })
            .catch((err) => {
              reject(err);
            });
        });
      }




     
    module.exports.createdealership = createdealership
    module.exports.dealershipLogin = dealershipLogin
    module.exports.getCarswithDealership = getCarswithDealership
    module.exports.UpdateCar = UpdateCar
    module.exports.getDealswithDealership = getDealswithDealership
    module.exports.UpdateDeal = UpdateDeal
    module.exports.getVehicleswithDealership = getVehicleswithDealership
    module.exports.getDealershipwithcertainCar = getDealershipwithcertainCar
    module.exports.addVehicle = addVehicle
    module.exports.fetchLocation = fetchLocation


