import mongoose from 'mongoose';
import validator from 'validator';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            maxLength: 50,
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email address");
                }
            }
        },
        aadhar: {
            type: String,
            required: true,
            maxlength: 12,
            unique: true
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
        verified: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

// Handle model compilation issues
const modelName = 'firUsers';
const FirUsers = mongoose.models[modelName] || mongoose.model(modelName, UserSchema);

export default FirUsers;
