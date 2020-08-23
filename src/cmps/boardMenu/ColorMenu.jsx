import React, { Component } from 'react'
import { CloseOutlined } from '@material-ui/icons/';
import { loadBoard, updateBoard } from '../../store/actions/boardActions'
import { boardService, OPERETIONS, TYPES } from '../../services/boardService'
import { connect } from 'react-redux';
import { ArrowBackIosOutlined } from '@material-ui/icons';

export class _ColorMenu extends Component {

    changeBoardColor = (color) => {

        if (!color) return;
        const clonedBoard = boardService.getBoardCopy(this.props.board);
        clonedBoard.bgColor = color;
        clonedBoard.imgUrl = null;
        boardService.addActivity(clonedBoard, this.props.user, OPERETIONS.UPDATE, TYPES.Board,
            { id: clonedBoard._id, title: clonedBoard.name },
            `changed board background color`);
        this.props.updateBoard(clonedBoard);

    }

    render() {
        const shownClass = !this.props.isMenuShown ? 'display-none' : 'shown';
        return (
            <div className={`board-menu ${shownClass}`}>
                <div className="flex column">
                    <div className="board-menu-header">
                        <div className="board-menu-header-content  flex justify-center">
                            <ArrowBackIosOutlined onClick={() => this.props.onToggleMenu("backgroundMenu")} className="btn-header-menu" />
                            <h3 className="menu-header-title">Change Background</h3>
                            <CloseOutlined onClick={() => this.props.onToggleMenu(null)} className="btn-header-menu" />
                        </div>
                    </div>

                    <div className="board-menu-content">
                        <div className="flex space-between wrap">
                            <div className='btn-color'
                                style={{ "backgroundColor": "rgb(0, 121, 191)" }}
                                onClick={() => this.changeBoardColor("rgb(0, 121, 191)")} >
                            </div>
                            <div className='btn-color'
                                style={{ "backgroundColor": "rgb(210, 144, 52)" }}
                                onClick={() => this.changeBoardColor("rgb(210, 144, 52)")} >
                            </div>
                            <div className='btn-color'
                                style={{ "backgroundColor": "rgb(81, 152, 57)" }}
                                onClick={() => this.changeBoardColor("rgb(81, 152, 57)")} >
                            </div>
                            <div className='btn-color'
                                style={{ "backgroundColor": "rgb(176, 70, 50)" }}
                                onClick={() => this.changeBoardColor("rgb(176, 70, 50)")} >
                            </div>
                            <div className='btn-color'
                                style={{ "backgroundColor": "rgb(137, 96, 158)" }}
                                onClick={() => this.changeBoardColor("rgb(137, 96, 158)")} >
                            </div>
                            <div className='btn-color'
                                style={{ "backgroundColor": "rgb(205, 90, 145)" }}
                                onClick={() => this.changeBoardColor("rgb(205, 90, 145)")} >
                            </div>
                            <div className='btn-color'
                                style={{ "backgroundColor": "rgb(75, 191, 107)" }}
                                onClick={() => this.changeBoardColor("rgb(75, 191, 107)")} >
                            </div>
                            <div className='btn-color'
                                style={{ "backgroundColor": "rgb(0, 174, 204)" }}
                                onClick={() => this.changeBoardColor("rgb(0, 174, 204)")} >
                            </div>
                            <div className='btn-color'
                                style={{ "backgroundColor": "rgb(131, 140, 145)" }}
                                onClick={() => this.changeBoardColor("rgb(131, 140, 145)")} >
                            </div>




                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        board: state.trelloApp.board,
        user: state.trelloUser.user
    }
}

const mapDispatchToProps = {
    loadBoard,
    updateBoard
}

export const ColorMenu = connect(mapStateToProps, mapDispatchToProps)(_ColorMenu)
