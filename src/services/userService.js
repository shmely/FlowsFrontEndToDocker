import { httpService } from './httpService'
export const OPERETIONS = {
    ADD: 'Add',
    UPDATE: 'Updated',
    DELETE: 'Delete'
}
export const TYPES = {
    User: 'User'
}

async function query() {
    const users = await httpService.get(`user`);
    return users;
}

async function getById(id) {
    const user = await httpService.get(`user/${id}`);
    return user
}

async function getByEmail(email) {
    const user = await httpService.get(`user/${email}`);
    return user
}

async function login(userCred) {
    const user = await httpService.post('auth/login', userCred)
    return _handleLogin(user)
}

function _handleLogin(user) {
    sessionStorage.setItem('user', JSON.stringify(user))
    return user;
}
async function logout() {
    await httpService.post('auth/logout');
    sessionStorage.clear();
}

async function signup(userCred) {
    const user = await httpService.post('auth/signup', userCred)
    return _handleLogin(user)
}

async function update(updateuser) {
    const user = await httpService.put('user', updateuser);
    return user;
}

async function remove(id) {
    await httpService.delete(`user/${id}`);
}

function getUserCopy(user) {
    return JSON.parse(JSON.stringify(user));
}

function makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

export const userService = {
    query,
    getById,
    remove,
    signup,
    update,
    makeId,
    getUserCopy,
    getByEmail,
    login,
    logout
}