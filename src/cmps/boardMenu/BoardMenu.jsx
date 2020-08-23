import React, { Component } from 'react';
import { CloseOutlined } from '@material-ui/icons';
import { Activities } from '../Activities'

export class BoardMenu extends Component {


    render() {

        const shownClass = !this.props.isMenuShown ? '' : 'shown';
        const board = this.props.board;
        const boardBg = board.bgColor ? { "backgroundColor": board.bgColor } :
            { "backgroundImage": `url("${board.imgUrl}")`, "backgroundSize": "cover" }
        return (
            <div className={`board-menu ${shownClass}`}>
                <div className="board-menu-header flex">
                    <div className="board-menu-header-content flex align-center grow">
                        <h3 className="menu-header-title">Menu</h3>
                        <CloseOutlined onClick={() => this.props.onToggleMenu(null)} className="btn-header-menu" />
                    </div>
                </div>
                <div className="flex column">
                    <div className="board-menu-content flex column">
                        <div className="board-menu-item flex align-center" onClick={() => this.props.onToggleMenu('backgroundMenu')}>
                            <div className="board-menu-icon" style={boardBg}></div>
                            <span className="board-menu-text">Change Background</span>
                        </div>
                        <span className="board-menu-header-divider"></span>
                        <Activities onCloseMenu={this.props.onToggleMenu} activities={board.activities} />
                    </div>
                </div>
            </div>
        )
    }
}
