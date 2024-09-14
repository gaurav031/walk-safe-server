import mongoose from 'mongoose';

const MissingpersonSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        age: {
            type: String,
            maxlength: 2, // Corrected to maxlength
            required: true
        },
        place: {
            type: String,
            maxlength: 50, // Corrected to maxlength
            required: true
        },
        aadhar: {
            type: String,
            required: true,
            maxlength: 12,
            unique: true
        },
        description: {
            type: String,
            maxlength: 200, // Corrected to maxlength
            required: true
        },
        personreporting: {
            type: String,
            required: true
        },
        found: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Handle model compilation issues
const modelName = 'Missingperson';
const Missingperson = mongoose.models[modelName] || mongoose.model(modelName, MissingpersonSchema);

export default Missingperson;
