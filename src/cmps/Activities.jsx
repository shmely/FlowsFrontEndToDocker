import React from 'react';
import { connect } from 'react-redux';
import { updateBoard } from '../store/actions/boardActions';
import { boardService, OPERETIONS, TYPES } from '../services/boardService';
import { MemberInitials } from '../cmps/MemberInitials';
import { Activity } from './Activity';
import { ListOutlined } from '@material-ui/icons';

class _Activities extends React.Component {

    state = {
        txt: '',

    }

    handleChange = ({ target }) => {
        var value = target.value
        this.setState({ txt: value })
    }

    onEnterDown = (ev) => {
        if (ev.which === 13 && !ev.shiftKey) {
            this.handleSaveBoard();
            ev.preventDefault();
        }
    }

    handleSaveBoard = () => {

        let boardClone = JSON.parse(JSON.stringify(this.props.board));
        const card = this.props.card;
        if (!this.state.txt.trim()) return;
        boardService.addActivity(boardClone, this.props.user, OPERETIONS.ADD, TYPES.CARD, { id: card.id, title: card.title },
            `commented "${this.state.txt}"`);
        this.setState({ txt: '' });
        this.props.updateBoard(boardClone);
    }

    render() {
        const { activities, showCommentBox } = this.props;
        const { txt } = this.state
        return (

            <div className="activity-container">
                <div className="activity-header flex align-center">
                    <ListOutlined className="activity-icon" />
                    <span className="activity-header-text">Activity</span>
                </div>

                {showCommentBox &&
                    <div className="flex column">
                        <div className="flex">
                            <MemberInitials fullName={this.props.user.fullName} />
                            <input type="text" className="comment-input" ref={el => this.cardNameInput = el}
                                placeholder="Write a comment..." onChange={this.handleChange}
                                spellCheck="false"
                                onBlur={this.handleSaveBoard} onKeyDown={this.onEnterDown} value={this.state.txt}></input>

                        </div>
                        {txt.length > 0 && <button onClick={this.handleSaveBoard} className="add-comment-btn" type="submit">Save</button>}
                    </div>
                }

                {activities.map((activity, index) => {
                    return <Activity allowOpenCard={!showCommentBox} onCloseMenu={this.props.onCloseMenu} key={index} activity={activity}>

                    </Activity>
                })}
            </div>

        )
    }
}
const mapStateToProps = (state) => {
    return {
        board: state.trelloApp.board,
        user:  state.trelloUser.user
    }
}

const mapDispatchToProps = {
    updateBoard,
}

export const Activities = connect(mapStateToProps, mapDispatchToProps)(_Activities)