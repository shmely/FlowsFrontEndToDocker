import { httpService } from './httpService';
export const OPERETIONS = {
    ADD: 'added',
    UPDATE: 'updated',
    DELETE: 'deleted'
}
export const TYPES = {
    CARD: 'a card',
    PHASE: 'a phase',
    Board: 'a board'
}



async function query(filter) {
    var queryString = '';
    // if (filter) {
    //     if (filter.inStock !== '') queryString = `?inStock=${filter.inStock}`;
    //     if (filter.type !== '') (queryString === '') ? queryString = `?type=${filter.type}` : queryString += `&type=${filter.type}`;
    //     if (filter.name !== '') (queryString === '') ? queryString = `?q=${filter.name}` : queryString += `&q=${filter.name}`;
    // }
    const boards = await httpService.get(`board/${queryString}`);
    return boards;
}

async function getById(id) {
    const board = await httpService.get(`board/${id}`);
    return board
}

async function add(addboard) {

    const board = await httpService.post(`board`, addboard);
    return board;
}

async function update(updateboard) {
    const board = await httpService.put('board', updateboard);
    return board;
}

async function remove(id) {
    await httpService.delete(`board/${id}`);
}

function getBoardCopy(board) {
    return JSON.parse(JSON.stringify(board));
}

function getNewCard(partialCard) {
    return {
        ...partialCard,//this currently has only a title
        id: makeId(),
        bgColor: '',
        desc: '',
        dueDate: null,
        createdAt: Date.now(),
        labels: [],
        checkList: [],
        assignedTo: [],
        attachments: []
    }
}

function getNewPhase(name) {
    return {
        id: makeId(),
        name,
        desc: '',
        cards: []
    }
}

function addActivity(board, user, operation, type, object, desc = null) {
    const activity = {
        at: Date.now(),
        operation,
        user,
        type,
        object,
        desc
    }
    board.activities.unshift(activity);
}

function getSortedPhase(sortBy, phase) {
    if (sortBy === 'title') {
        return phase.cards.sort((card1, card2) => card1.title.localeCompare(card2.title))
    } else if (sortBy === 'firstCreated') {
        return phase.cards.sort((card1, card2) => card1.createdAt - card2.createdAt);
    } else return phase.cards.sort((card1, card2) => card2.createdAt - card1.createdAt);
}

function createNewBoard(name, bgColor, loggedInUser) {
    const _board = {

        name: name,
        bgColor: bgColor,
        createdAt: Date.now(),
        creator: loggedInUser,
        members: [loggedInUser],
        desc: null,
        activities: [],
        phaseLists: [],
        labels: [],
        isLabelTxtShown: false,
        imgUrl: null
    }
    return _board;
}

function getNewLabel({ txt, color }) {
    return {
        txt,
        color,
        id: makeId(),
    }
}

function makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function getPhaseIdxByCardId(board, cardId) {
    return board.phaseLists.findIndex(phase => phase.cards.some(card => card.id === cardId))
}

function getCardIdxById(board, phaseIdx, cardId) {
    return board.phaseLists[phaseIdx].cards.findIndex(card => card.id === cardId);
}

function getCardById(board, cardId) {
    const phaseIdx = getPhaseIdxByCardId(board, cardId);
    const cardIdx = getCardIdxById(board, phaseIdx, cardId);
    return board.phaseLists[phaseIdx].cards[cardIdx];
}

function replaceCardInBoard(board, modifiedCard) {
    const phaseIdx = getPhaseIdxByCardId(board, modifiedCard.id);
    const cardIdx = getCardIdxById(board, phaseIdx, modifiedCard.id);
    board.phaseLists[phaseIdx].cards[cardIdx] = modifiedCard;
    return board;
}

export const boardService = {
    query,
    getById,
    remove,
    add,
    update,
    makeId,
    getBoardCopy,
    getNewCard,
    getNewPhase,
    getSortedPhase,
    addActivity,
    createNewBoard,
    getNewLabel,
    getPhaseIdxByCardId,
    getCardIdxById,
    getCardById,
    replaceCardInBoard

}