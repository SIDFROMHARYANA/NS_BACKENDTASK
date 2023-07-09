
const userSchema =  ({

    user_id: {
        type: String,
        required: true
    },
    
    user_email: {
        type: String,
        required: true,
        unique : true
    },

    user_location: {
        type: String  
    },

    user_password: {
        required: true,
        type: String 
    },

    vehicle_info : {
        type: String,
        refs: "Sold_vehicle",
        required: true
    },

       user_info: {
           
        user_details: {
            Name: { type: String, required: true },
            MobileNo: { type: Number, required: true },
            Aadhar_No: { type: Number, required: true }
        },
    }   

} ,{ timestamps: true });


module.exports = ('User', userSchema)