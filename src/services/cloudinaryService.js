import axios from 'axios';

async function uploadImg({ target }) {
    const CLOUD_NAME = 'marmelada';
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append('file', target.files[0]);
    formData.append('upload_preset', 'balulu');
    try {
        const res = await axios.post(UPLOAD_URL, formData);
        return res.data.url
    } catch (err) {
        console.error(err);
        throw err;
    }

}

async function uploadRawAttachment({ target }) {
    const CLOUD_NAME = 'marmelada';
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`;

    const formData = new FormData();
    formData.append('file', target.files[0]);
    formData.append('upload_preset', 'balulu');
    try {
        const res = await axios.post(UPLOAD_URL, formData);
        return res.data.url
    } catch (err) {
        console.error(err);
        throw err;
    }

}



export const cloudinaryService = {
    uploadImg,
    uploadRawAttachment
}