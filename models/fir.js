import mongoose from 'mongoose';

const FirSchema = new mongoose.Schema(
    {
        state: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        policeStation: {
            type: String,
            required: true
        },
        firNo: {
            type: String,
            required: true,
            unique: true,
        },
        date: {
            type: Date,
            required: true
        },
        acts: {
            type: String,
            required: true
        },
        occurrenceDay: {
            type: String,
            required: true
        },
        occurrenceDate: {
            type: Date,
            required: true
        },
        occurrenceTime: {
            type: String,
            required: true
        },
        informationReceivedDate: {
            type: Date,
            required: true
        },
        informationReceivedDay: {
            type: String,
            required: true
        },
        informationReceivedTime: {
            type: String,
            required: true
        },
        diaryReferenceEntryNo: {
            type: String,
            required: true,
            unique: true
        },
        diaryReferenceTime:{
            type: String,
            required: true,
        },
        directionAndDistanceFromPS:{
            type: String,
            required: true,
        },
        beatNo: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },

        complainantName: {
            type: String,
            required: true,
        },
        complainantFatherOrHusbandName: {
            type: String,
            required: true,
        },
        complainantDateOfBirth: {
            type: Date,
            required: true,
        },
        complainantNationality: {
            type: String,
            required: true,
        },
        complainantOccupation: {
            type: String,
            required: true,
        },
        complainantPassportNo: {
            type: String,
            default: null,
        },
        complainantDateOfIssue: {
            type: Date,
            required: true,
        },
        complainantPlaceOfIssue: {
            type: String,
            required: true,
        },
        complainantAddress: {
            type: String,
            required: true,
        },

        detailsOfSuspected: {
            type: String,
            required: true,
        },
        cadre: {
            type: String,
            required: true
        },
        reasonsForDelay: {
            type: String,
            default: null,
        },
        particularsOfPropertiesStolenInvolved: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const modelName = 'Fir'; // Use the model name you want

const Fir = mongoose.models[modelName] || mongoose.model(modelName, FirSchema);

export default Fir;
