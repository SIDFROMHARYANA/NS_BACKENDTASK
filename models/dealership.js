
const dealershipSchema =  ({

    dealership_id: {
        type: String,
        required: true
    },
    
    dealership_email: {
        type: String,
        required: true,
        unique : true
    },

    dealership_location: {
        type: String      
    },

    dealership_name: {
        type: String
        
    },

    dealership_password: {
        required: true,
        type: String 
    },

      sold_vehicles : {
        type: String,
        refs: "Sold_vehicle",
        required: true
    },

    cars: {
        type: String,
        refs: "Car",
        required: true
    },

    deals: {
        type: String,
        refs: "Deal",
        required: true
    },
  
       dealership_info: {
        
        dealership_details: {
           SecurityIntrest: {type: Boolean, default: false},
           Registration_number: {type: Number, required: true},
           Warrant : { type: Boolean, default: true}
        },
    }
    

}, { timestamps: true });


module.exports = ('Dealership', dealershipSchema)