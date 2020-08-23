import React, { Component } from 'react';
import { Clear } from '@material-ui/icons';
import { MemberEdit } from './MemberEdit';
import { boardService } from '../services/boardService';
import { connect } from 'react-redux';
import { updateBoard } from '../store/actions/boardActions';

export class _MembersEdit extends Component {

    state = {
        name: ''
    }

    componentDidMount() {
        window.addEventListener('keydown', this.hideMembersEdit);

    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.hideMembersEdit);
    }

    hideMembersEdit = (ev) => {
        if (ev.code === 'Escape') this.props.toggleProperty('isMembersEditShown');
    }

    handleChange = ({ target }) => {
        this.setState({ name: target.value });
    }

    toggleMemberOnCard = (member) => {
        const boardCopy = boardService.getBoardCopy(this.props.board);
        const card = boardService.getCardById(boardCopy, this.props.card.id);

        //Checking if the member is assigned or not and flip it
        if (card.assignedTo.some(mmbr => mmbr._id === member._id)) {
            card.assignedTo = card.assignedTo.filter(mmbr => mmbr._id !== member._id);
        } else card.assignedTo.push(member);

        const updatedBoard = boardService.replaceCardInBoard(boardCopy, card);
        this.props.updateBoard(updatedBoard);
    }

    render() {
        const { members, toggleProperty, card } = this.props;
        // const { users, board } = this.props; members  //TODO LATER WHEN ADD USER TO BOARD
        // if (!members && !users) return 'loading!!!!';
        const { name } = this.state;
        // var membersToDisplay;
        // if (!users) {
        //     membersToDisplay = members.filter(mmbr =>
        //         mmbr.fullName.toLowerCase().includes(name.toLowerCase()));  //TODO LATER WHEN ADD USER TO BOARD
        // }
        const membersToDisplay = members.filter(mmbr =>
            mmbr.fullName.toLowerCase().includes(name.toLowerCase()));

        return (
            <section className="edit-members" >
                <div className="edit-members-header flex align-center">
                    <p className="grow">Members</p>
                    <button onClick={() => { toggleProperty('isMembersEditShown') }}><Clear /></button>
                </div>
                <input className="search-name" onChange={this.handleChange} autoComplete="off"
                    type="search" name="name" value={name} placeholder="Search members" />
                <div className="members-gallery">
                    {members && membersToDisplay.map(member =>
                        <MemberEdit toggleMemberOnCard={this.toggleMemberOnCard} card={card}
                            key={member._id} member={member} />)}
                    {/* {users && membersToDisplay.map(member =>
                        <MemberEdit toggleMemberOnCard={this.toggleMemberOnCard} card={card} //board={board} //TODO LATER WHEN ADD USER TO BOARD
                            key={member._id} member={member} />)} */}
                </div>

            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        board: state.trelloApp.board
    }
}

const mapDispatchToProps = {
    updateBoard,
}

export const MembersEdit = connect(mapStateToProps, mapDispatchToProps)(_MembersEdit)