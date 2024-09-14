import mongoose from 'mongoose';
import validator from 'validator';

const PoliceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            maxlength: 50, // Corrected to maxlength
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Not a valid email address");
                }
            }
        },
        serviceNumber: {
            type: String,
            required: true,
            maxlength: 10, // Corrected to maxlength
            unique: true
        },
        rank: {
            type: String,
            required: true,
            maxlength: 50, // Corrected to maxlength
        },
        password: {
            type: String,
            required: true,
            minlength: 8, // Corrected to minlength
        },
        cpassword: {
            type: String,
            required: true,
            minlength: 8, // Corrected to minlength
        },
    },
    { timestamps: true }
);

// Handle model compilation issues
const modelName = 'Police';
const Police = mongoose.models[modelName] || mongoose.model(modelName, PoliceSchema);

export default Police;
