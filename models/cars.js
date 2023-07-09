
const carSchema = ({

    car_id: {
        type: String,
        refs: "deal",
        required: true,
        unique : true
    },
    
     type : {
        type: String
    },

     name: {
        type: String     
    },

     model : {
        required: true,
        type: String 
    },
    
       car_info: {
          
        car_details: {
            price: {type: Number, required: true},            
            engine: { type: String, required: true},
            mileage: { type: String, required: true }
        },
    }
   
}, { timestamps: true });


module.exports = ('Car', carSchema)