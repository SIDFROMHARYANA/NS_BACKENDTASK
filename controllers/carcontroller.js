const cars = require("../models/cars");   

const { isValidRequestBody,
  isValid,
  isValidId
 } = require("../validator/validation");

 
const createCar =  function (req, res){
  
    let data = req.body
    let {car_id, type, name , model , car_info} = data

    
     //if entries are empty
    if (!isValidRequestBody(data)) {
      return Promise.resolve(res.status(400).send({
        status: false,
        message: "data is required",
      }))
    }
      //checking  for type in car_model


    if (!isValid(type)) {
      return Promise.resolve(res.status(400).send({ status: false, message: "Provide type Field" }));
  }

  if (!/^[a-zA-Z ]{2,30}$/.test(type)) {
      return Promise.resolve(res.status(400).send({ status: false, message: "Enter valid car_type" }));
  }
    //checking uniqueness for car_id in  car model
   
    if (!isValid(car_id)) {
      return Promise.resolve(res.status(400).send({ status: false, message: "Provide the car_id Field" }));
  }

  if (!isValidId(car_id)) {
      return Promise.resolve(res.status(400).send({ status: false, message: "Provide the Valid car_id " }));
  }

  
  cars.findOne({ car_id: car_id })
    .then(check_id => {
      if (check_id) {
        return Promise.resolve(res.status(400).send({ status: false, message: `${car_id} is Already Registered` }));
      }})

     // checking car model

      if (!isValid(model)) {
        return Promise.resolve(res.status(400).send({ status: false, message: "Provide model Field" }));
    }
    
    if (!/^[a-zA-Z ]{2,30}$/.test(model)) {
        return Promise.resolve(res.status(400).send({ status: false, message: "Enter valid model" }));
           
    // checking car_info in car_model
   
    if (car_info) {
      let objcar_info = JSON.parse(car_info);
     
        
          if (objcar_info.car_details) {
          if (!isValid(objcar_info.car_details.price)) {
              return Promise.resolve(res.status(400).send({ status: false, message: "Please provide price in car_details" }));
          }
          if (!isValid(objcar_info.car_details.engine)){
              return Promise.resolve(res.status(400).send({ status: false, message: "Please provide engine in car_details" }));
          }
          if (!isvalid(objcar_info.car_details.mileage))
          {
              return Promise.resolve(res.status(400).send({ status: false, message: "Please provide mileage in car_details" }));
      } 
    
      data["car_info"] = objcar_info;
    }
      else {
        return Promise.resolve(res.status(400).send({ status: false, message: "Please Provide car_details in car_info" }));
      }
    }
    
    //creating car data
    return cars.create(data)

  .then(createNew => {
    return Promise.resolve(res.status(201).send({ status: true , message: "User created succesfully"}));
  })
  .catch (err => {
    return Promise.resolve(res.status(500).send({ status: false, message: err }))
  })
}
}

//To view all cars

const getCars = function (req, res) {
  
      let car_id = req.params.car_id;

      //userId validation
      if (!car_id) {
          return res.status(400).send({ status: false, message: "Provide UserID" });
      }

      if (!isValidId(car_id)) {
          return res.status(400).send({ stauts: false, message: "Invalid User Id" });
      }

      //authorization
      if (car_id != req.car_id) {
          return res.status(403).send({ status: false, message: "unauthorized access!" });
      }

      //if CAR exist than providing the CAR's data 
      return cars.find({ car_id: car_id })
      
      .then(cars => {
        return Promise.resolve(res.status(200).send({ status: true , message: "Cars returned succesfully"}));
      })
      
      .catch (err => {
        return Promise.resolve(res.status(500).send({ status: false, message: err }))
      })
};

module.exports.createCar = createCar

module.exports.getCars = getCars


  

  


