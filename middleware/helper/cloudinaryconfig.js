import cloudinary from 'cloudinary';

// Configure cloudinary with your credentials
cloudinary.v2.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET
});

// Optionally, export cloudinary for use in other parts of your project
export default cloudinary;
