const sold_vehicleSchema =  ({

    vehicle_id: {
        type: String,
        required: true
    },
    
     car_id : {
        type: String,
        ref : "cars",
        required: true
    },

  
    vehicle_info : {
                  
        vehicle_details: {
        Type: {type: String, default: "Car", enum: ["Car", "Scooter", "Bike"]},
        Registration_Number: { type: Number, required: true },   
        },
    }
       

}, { timestamps: true });

module.exports = ('Sold_vehicle', sold_vehicleSchema)