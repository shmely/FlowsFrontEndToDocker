import { boardService } from '../../services/boardService'
import { socketService } from '../../services/socketService'
export const LOAD_BOARD = 'LOAD_BOARD';
export const UPDATE_BOARD = 'UPDATE_BOARD';
export const ADD_BOARD = 'ADD_BOARD';
export const REMOVE_BOARD = 'REMOVE_BOARD';
export const QUERY_BOARDS = 'QUERY_BOARDS'
export const CREATE_BOARD = 'CREATE_BOARD';

export function queryBoards(filter) {
    return dispatch => {
        boardService.query(filter)
            .then(boards => dispatch({ type: QUERY_BOARDS, boards }));
    }
}

export function loadBoard(id) {
    return async dispatch => {
        const board = await boardService.getById(id);
        dispatch({ type: LOAD_BOARD, board });
    }
}

export function addBoard(addedBoard) {
    return async dispatch => {
        const board = await boardService.add(addedBoard);
        dispatch({ type: ADD_BOARD, board })
    }
}

export function updateBoard(updatedBoard) {

    return async (dispatch, state) => {
        //const keepBoard = boardService.getBoardCopy(state.board); not working right now the state.board is undifined; wierd!!!
        dispatch({ type: UPDATE_BOARD, board: updatedBoard });

        try {
            await boardService.update(updatedBoard);
        } catch (err) {
            // dispatch({ type: UPDATE_BOARD, board: keepBoard });
        }

        socketService.emit('board updated', updatedBoard._id);
    }
}

export function removeBoard(boardId) {
    return dispatch => {
        boardService.remove(boardId)
            .then(() => dispatch({ type: REMOVE_BOARD, boardId }));
    }
}

export function setCard(card) {
    return dispatch => {
        dispatch({ type: 'SET_CARD', card });
    }
}
