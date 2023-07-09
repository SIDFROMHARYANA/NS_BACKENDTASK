const user = require("../models/user");
const sold_vehicles = require("../models/sold_vehicles");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const { isValidRequestBody,
  isValid,
  isValidId,
  isValidEmail,
  } = require("../validator/validation");

  //===============createuser========

  const createUser =  function (req, res){
  
    let data = req.body
    let {user_id, user_email, user_location, password,  user_info, vehicle_info} = data


     //if entries are empty
    if (!isValidRequestBody(data)) {
      return Promise.resolve(res.status(400).send({
        status: false,
        message: "data is required",
      }))
    }

     if (!isValid(user_id)) {
      return Promise.resolve(res.status(400).send({ status: false, message: "Provide user_id" }));
  }

  if (!isValidId(user_id)) {
    return Promise.resolve(res.status(400).send({ status: false, message: "Provide the Valid user_id" }));
}
      //checking  for user_location in  usermodel


    if (!isValid(user_location)) {
      return Promise.resolve(res.status(400).send({ status: false, message: "Provide user_location Feild" }));
  }

  if (!/^[a-zA-Z ]{2,30}$/.test(user_location)) {
      return Promise.resolve(res.status(400).send({ status: false, message: "Enter valid user_location" }));
  }
    //checking uniqueness for email in usermodel
   
    if (!isValid(user_email)) {
      return Promise.resolve(res.status(400).send({ status: false, message: "Provide the EmailId Feild" }));
  }

  if (!isValidEmail(user_email)) {
      return Promise.resolve(res.status(400).send({ status: false, message: "Provide the Valid EmailId " }));
  }

  user.findOne({ user_email: user_email })
    .then(checkmail => {
      if (checkmail) {
        return Promise.resolve(res.status(400).send({ status: false, message: `${email} is Already Registered` }));
      }})

            //======vehicle_info validation============
    
      if (!isValid(vehicle_info)) {
        return Promise.resolve (res.status(400).send({ status: false, message: "vehicle_info is required" }));
      }

      sold_vehicles.find(vehicle_info)
     .then(result => {
      if (!result) {
        return Promise.resolve(res.status(400).send({ status: false, msg: "Invalid vehicle_info!" }));
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

   
    
    if (user_info) {
      let objuser_info = JSON.parse(user_info);
     
        
          if (objuser_info.user_details) {
          if (!isValid(objuser_info.user_details.Name)) {
              return Promise.resolve(res.status(400).send({ status: false, message: "Please provide  name in user_details" }));
          }
          if (!isValid(objuser_info.user_details.MobileNo)){
              return Promise.resolve(res.status(400).send({ status: false, message: "Please provide MobileNo in user_details" }));
          }
          if (!isvalidPincode(objuser_info.user_details.AadharNo))
          {
              return Promise.resolve(res.status(400).send({ status: false, message: "Please provide AadharNo in user_details" }));
      } 
    
      data["user_info"] = objuser_info;
    }
      else {
        return Promise.resolve(res.status(400).send({ status: false, message: "Please Provide user_details in user_info" }));
      }
    }
    //creating user data
    return userModel.create(data)

  .then(createNew => {
    return Promise.resolve(res.status(201).send({ status: true , message: "User created succesfully"}));
  })
  .catch (err => {
    return Promise.resolve(res.status(500).send({ status: false, message: err }))
  })
}

//---------------------- generation of token ----------------------------------- 
 
 const userLogin = async function (req, res) {
  
      const data = req.body;
      const { user_email, password } = data;

      //request body empty or not
      if (!isValidRequestBody(data)) {
          return Promise.resolve(res.status(400).send({ status: false, message: "Please Enter Login Credentials" }));
      }

      //emailId validation
      if (!isValid(user_email)) {
          return Promise.resolve(res.status(400).send({ status: false, message: "Email is Required" }));
      }
      if (!isValidEmail(user_email)) {
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
      user.findOne({ user_email: user_email })
      .then(user => {
        if (!user) {
          return Promise.resolve(res.status(404).send({ status: false, message: "Invalid User, Login Credentials Doesn't Matched" }));
        }})

      //checking req body password and DB's decryptPassword is same or not using "bcrypt package"
      const decrypPassword = user.password;
      return bcrypt.compare(password, decrypPassword)
      
      .then(pass => {
        
        if (!pass) {
          return Promise.resolve(res.status(400).send({ status: false, message: "Password Incorrect" }));
         } 
  

      // Creating Token Here
      const token = jwt.sign(
          { userId: user._id }, "NerveSparks12",
          { expiresIn: "72hr" }
      );

      //restrucing response and set token 
      let obj = {
          userId: user._id,
          token: token,
      };

      res.setHeader("Authorization", token);

      return Promise.resolve(res.status(201).send({ status: true, message: "User LoggedIn Succesfully", data: obj }))
  . catch (err => {
      return res.status(500).send({ status: false, message: err.message });
  });
})

 }

 const getVehicles = function (req, res) {
  
  let user_id = req.params.user_id;

  //userId validation
  if (!user_id) {
      return res.status(400).send({ status: false, message: "Provide UserID" });
  }

  if (!isValidId(user_id)) {
      return res.status(400).send({ stauts: false, message: "Invalid User Id" });
  }

  //authorization
  if (user_id != req.user_id) {
      return res.status(403).send({ status: false, message: "unauthorized access!" });
  }

  //if User exist than providing the vehicle information
 
  return user.find({vehicle_info : vehicle_info })
  
  .then(vehicle_info => {
   
    if (!vehicle_info) {
      return Promise.resolve(res.status(400).send({ status: false, msg: "Vehicle doesn't exist!" }));
    } 
    
    return Promise.resolve(res.status(200).send({ status: true , message: "vehicle_info returned succesfully"}));
  })
  
  .catch (err => {
    return Promise.resolve(res.status(500).send({ status: false, message: err }))
  })
};
    
module.exports.createUser = createUser
module.exports.userLogin = userLogin
module.exports.getVehicles = getVehicles







