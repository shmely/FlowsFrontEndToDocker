import { UPDATE_BOARD, QUERY_BOARDS, REMOVE_BOARD, ADD_BOARD, LOAD_BOARD } from '../actions/boardActions';
import { socketService } from '../../services/socketService';




const initialState = {
    boards: [],
    board: null,
    card: null
}

export function boardReducer(state = initialState, action) {
    switch (action.type) {
        case QUERY_BOARDS:
            return {
                ...state,
                boards: action.boards
            }
        case LOAD_BOARD:

            return {
                ...state,
                board: { ...action.board }
            };
        case ADD_BOARD:
            return {
                ...state,
                board: action.board
            };
        case UPDATE_BOARD:
            socketService.emit('board updated', action.board._id)
            return {
                ...state,
                board: { ...action.board }
            }
        case REMOVE_BOARD:
            return {
                ...state,
                boards: state.boards.filter(board => board._id !== action.boardId)
            };
        case 'SET_CARD':
            return {
                ...state,
                card: action.card
            }
        default:
            return state;
    };
}


