import fetch from 'node-fetch';
import Unsplash from 'unsplash-js';
global.fetch = fetch;
const unsplash = new Unsplash({ accessKey: "8ZH8zzN8CDDrZJWGYhpPmzEreLvOZ6WRPVTgnEH_6Ac" });


function getListPhotos(perPage = 14) {
    const page = _getRandomInt(1, 5)
    return unsplash.photos.listPhotos(page, perPage, "popular")
        .then(res => res.json());
}

export const unsplashService = {
    getListPhotos
}
function _getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
