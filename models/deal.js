
const dealSchema = ({

    deal_id: {
        type: String,
        required: true,
        unique : true
    },

    car_id: {
        type: String,
        refs: "cars",
        required: true,
        unique : true
    },

    deal_info : {
       deal_details: {
        Amount: { type: Number, required: true },
        ARR: { type: Number, required: true },
        ACV: { type: Number, required: true }
    },              
    }
}, { timestamps: true });


module.exports = ('Deal', dealSchema)