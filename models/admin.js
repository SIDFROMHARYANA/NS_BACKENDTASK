
const adminSchema = ({

    admin_id: {
        type: String,
        required: true,
        unique : true
    },

    password: {
        required: true,
        type: String 
    },

}, { timestamps: true });


module.exports = ('Admin', adminSchema)