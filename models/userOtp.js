import mongoose from 'mongoose';

const UserOTPVerificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address");
            }
        }
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set to the current date if not provided
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                // Ensure expiresAt is greater than createdAt
                return v > this.createdAt;
            },
            message: 'Expiration date must be greater than creation date'
        }
    }
});

// Ensure indexes on frequently queried fields
UserOTPVerificationSchema.index({ email: 1 });
UserOTPVerificationSchema.index({ userId: 1 });

const UserOtpVerification = mongoose.model('UserOtpVerification', UserOTPVerificationSchema);
export default UserOtpVerification;
