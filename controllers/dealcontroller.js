
const deal = require("../models/deal");
const cars = require("../models/cars")


const { isValidRequestBody,
  isValid,
  isValidId
    } = require("../validator/validation");

    //===============createdeal========

const createdeal =  function (req, res){
  
    let data = req.body
    let {deal_id, car_id, deal_info} = data


     //if entries are empty
    if (!isValidRequestBody(data)) {
      return Promise.resolve(res.status(400).send({
        status: false,
        message: "data is required",
      }))
    }

     if (!isValid(deal_id)) {
      return Promise.resolve(res.status(400).send({ status: false, message: "Provide deal_id" }));
  }

  if (!isValidId(deal_id)) {
    return Promise.resolve(res.status(400).send({ status: false, message: "Provide the Valid deal_id" }));
}

  deal.findOne({ deal_id: deal_id })
  .then(checkid => {
   if (!checkid) {
     return Promise.resolve(res.status(400).send({ status: false, message: `${id} is Already Registered` }));
   }})
      
   //checking  for car_id in cars


    if (!isValid(car_id)) {
      return Promise.resolve(res.status(400).send({ status: false, message: "Provide car_id Feild" }));
  }

 
 cars.findById({ car_id: car_id })
  .then(carExist => {
   if (!carExist) {
     return Promise.resolve(res.status(400).send({ status: false, message: `${id} is Already Registered` }));
   }})


            //======deal_info validation============
    
    
    if (deal_info) {
      let objdeal_info = JSON.parse(deal_info);
     
        
          if (objdeal_info.deal_details) {
          if (!isValid(objdeal_info.deal_details.ARR)) {
              return Promise.resolve(res.status(400).send({ status: false, message: "Please provide  ARR in deal_details" }));
          }
          if (!isValid(objuser_info.deal_details.ACV)){
              return Promise.resolve(res.status(400).send({ status: false, message: "Please provide  ACV in deal_details" }));
          }
          if (!isvalid(objuser_info.deal_details.Amount))
          {
              return Promise.resolve(res.status(400).send({ status: false, message: "Please provide Amount in deal_details" }));
      } 
    
      data["deal_details"] = objdeal_info;
    }
      else {
        return Promise.resolve(res.status(400).send({ status: false, message: "Please Provide deal_details in deal_info" }));
      }
    }
    
    //creating deal data
    
    return deal.create(data)

  .then(createNew => {
    return Promise.resolve(res.status(201).send({ status: true , message: "Deal created succesfully"}));
  })
  .catch (err => {
    return Promise.resolve(res.status(500).send({ status: false, message: err }))
  })
}
 
const getDealswithcertainCar = function(req, res) {
  
    const car_id = req.params.car_id;

    //cars validation

    if (!isValid(car_id)) {
        return res.status(400).send({ status: false, message: "please provide car_id field" })
    }

    //if CAR exist than providing the CAR's data 
    
     deal.find({car_id:car_id})
    
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
    
      const addcar = function(req, res) { 

        let deal_id = req.params.deal_id
        let data = req.body
    
        let { car_id } = data; // destructuring req.body
    
        if (!data || (Object.keys(data).length == 0))
        return Promise.resolve(res.status(400).send({ status: false, message: "Provide Data in Body" }));
               
    
        let newObj = {};
    
        
            if (!isValid(car_id)) {
                return Promise.resolve(res.status(400).send({ status: false, message: "Provide the car_id field " }));
            }
           
    
            newObj["car_id"] = car_id;
        
        
         
        return dealership.findOneAndUpdate(
            { _id: deal_id },
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
      
module.exports.createdeal = createdeal
module.exports.getDealswithcertainCar = getDealswithcertainCar
module.exports.addcar = addcar









