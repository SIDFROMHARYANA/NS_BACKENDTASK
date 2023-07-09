const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin = require("../models/admin");


const { isValidRequestBody,
  isValidPassword,
  isValid,
  isValidId,
  isValidEmail,
  } = require("../validator/validation");

  //===============createAdmin========

    const createAdmin = function (req, res){
  
    let data = req.body
    let {admin_id,  password, } = data


     //if entries are empty
    if (!isValidRequestBody(data)) {
      return Promise.resolve(res.status(400).send({
        status: false,
        message: "data is required",
      }))
    }

     if (!isValid(admin_id)) {
      return Promise.resolve(res.status(400).send({ status: false, message: "Provide user_id" }));
  }

  if (!isValidId(admin_id)) {
    return Promise.resolve(res.status(400).send({ status: false, message: "Provide the Valid user_id" }));
}

  admin.findOne({ admin_id: admin_id })
    .then(checkid => {
      if (!checkid) {
        return Promise.resolve(res.status(400).send({ status: false, message: `${email} is Already Registered` }));
      }})

   
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

       
    // creating data
    
    return admin.create(data)

    .then(createNew => {
      return Promise.resolve(res.status(201).send({ status: true , message: "Admin created succesfully"}));
    })
    .catch (err => {
      return Promise.resolve(res.status(500).send({ status: false, message: err }))
    })
  }
   

//---------------------- generation of token ----------------------------------- 
 
 const AdminLogin = async function (req, res) {
  
      const data = req.body;
      const { admin_id, password } = data;

      //request body empty or not
      if (!isValidRequestBody(data)) {
          return Promise.resolve(res.status(400).send({ status: false, message: "Please Enter Login Credentials" }));
      }

      //emailId validation
      if (!isValid(admin_id)) {
          return Promise.resolve(res.status(400).send({ status: false, message: "Email is Required" }));
      }
      if (!isValidId(admin_id)) {
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
      admin.findOne({ admin_id: admin_id })
      .then(admin => {
        if (!admin) {
          return Promise.resolve(res.status(404).send({ status: false, message: "Invalid Admin, Login Credentials Doesn't Matched" }));
        }})

      //checking req body password and DB's decryptPassword is same or not using "bcrypt package"
      const decrypPassword = admin.password;
      return bcrypt.compare(password, decrypPassword)
      
      .then(pass => {
        
        if (!pass) {
          return Promise.resolve(res.status(400).send({ status: false, message: "Password Incorrect" }));
         } 
  

      // Creating Token Here
      const token = jwt.sign(
          { adminId: admin._id }, "NerveSparks12",
          { expiresIn: "72hr" }
      );

      //restrucing response and set token 
      let obj = {
        adminId: admin._id,
          token: token,
      };

      res.setHeader("Authorization", token);

      return Promise.resolve(res.status(201).send({ status: true, message: "Admin LoggedIn Succesfully", data: obj }))
   
      .catch(err => {
      return res.status(500).send({ status: false, message: err.message });
  });
})

 }

    
module.exports.createAdmin = createAdmin
module.exports.AdminLogin = AdminLogin







