import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadBoard, setCard, updateBoard } from '../store/actions/boardActions';
import { CardHeader } from './CardHeader';
import { CardDesc } from './CardDesc';
import { CardChecklist } from './CardChecklist';
import { Activities } from '../cmps/Activities'
import {
    PermIdentity, LabelOutlined, PlaylistAddCheck,
    Schedule, CropOriginal, DeleteForeverOutlined,
    // Attachment
} from '@material-ui/icons';
import { LabelsEdit } from './LabelsEdit';
import { MembersEdit } from './MembersEdit';
import { MemberInitials } from './MemberInitials';
import { boardService } from '../services/boardService';
import { DueDateEdit } from './DueDateEdit';
import moment from 'moment';
import { cloudinaryService } from '../services/cloudinaryService';
import { CardImage } from './CardImage';
import { history } from '../history';
// import { CardAttachments } from './CardAttachments';


class _Card extends Component {
    state = {
        card: null,
        isLabelEditShown: false,
        isMembersEditShown: false,
        cardActivities: [],
        isDueDateEditShown: false,
        isImgLoading: false,
        loadingMsg: null
    }

    componentDidMount() {
        window.addEventListener('keydown', this.hideCard);
        var card;
        this.props.board.phaseLists.forEach(phase => {
            const res = phase.cards.find(card => card.id === this.props.cardId);
            if (res) card = res;
        });
        const cardActivities = this.getActivities(card.id);
        this.setState({ card, cardActivities });

    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.hideCard);
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps.board) !== JSON.stringify(this.props.board)) {
            var card;
            this.props.board.phaseLists.forEach(phase => {
                const res = phase.cards.find(card => card.id === this.props.cardId);
                if (res) card = res;
            });
            const cardActivities = this.getActivities(card.id);
            this.setState({ card, cardActivities });
        }
    }

    getUpdatedLabels = () => {
        if (!this.props.board.labels.length) return [];
        const { labels } = this.state.card;
        const boardCopy = boardService.getBoardCopy(this.props.board);
        const updatedLabels = labels.reduce((acc, label) => {
            const foundLabel = boardCopy.labels.find(boardLabel => boardLabel.id === label.id);
            if (foundLabel) acc.push(foundLabel);
            return acc;
        }, [])
        return updatedLabels;
    }

    hideCard = (ev) => {
        const { isLabelEditShown, isMembersEditShown, isDueDateEditShown } = this.state;
        if (ev.code === 'Escape' && !isLabelEditShown
            && !isMembersEditShown && !isDueDateEditShown
        ) {
            this.props.setCard(null);
            history.push(`/board/${this.props.board._id}`);
        }
    }


    toggleProperty = property => {
        this.setState(prevState => ({ [property]: !prevState[property] }));
    }

    getActivities = (cardId, limit = 10) => {
        const cardActivities = this.props.board.activities.filter(activity => activity.object.id === cardId);
        if (cardActivities.length > 10) return cardActivities.slice(0, limit);
        return cardActivities


    }

    addCheckList = () => {
        const cloneCard = JSON.parse(JSON.stringify(this.state.card));
        if (!cloneCard.checkList.length) {
            cloneCard.checkList.push({ txt: '', isDone: false });
            this.setState({ card: cloneCard })
        }
    }

    getPhaseIdxByCardId = (cardId) => {
        return this.props.board.phaseLists.findIndex(phase =>
            phase.cards.some(card => card.id === cardId))
    }


    removeMemberFromCard = (member) => {
        const boardCopy = boardService.getBoardCopy(this.props.board);
        const card = boardService.getCardById(boardCopy, this.props.card.id);
        card.assignedTo = card.assignedTo.filter(mmbr => mmbr._id !== member._id);
        //Changed the card
        const updatedBoard = boardService.replaceCardInBoard(boardCopy, card);
        this.props.updateBoard(updatedBoard);//Updated the board
    }

    changeDueDate = newDate => {
        const boardCopy = boardService.getBoardCopy(this.props.board);
        const card = boardService.getCardById(boardCopy, this.props.card.id);
        card.dueDate = newDate;//Changed the card
        const updatedBoard = boardService.replaceCardInBoard(boardCopy, card);
        this.props.updateBoard(updatedBoard);
    }

    removeImgUrl = () => {
        const boardCopy = boardService.getBoardCopy(this.props.board);
        const card = boardService.getCardById(boardCopy, this.props.card.id);
        card.imgUrl = null;
        const upadtedBoard = boardService.replaceCardInBoard(boardCopy, card);
        this.props.updateBoard(upadtedBoard);
    }

    onUploadImg = async (ev) => {
        this.setState({ isImgLoading: true });
        const imgUrl = await cloudinaryService.uploadImg(ev);
        const boardCopy = boardService.getBoardCopy(this.props.board);
        const card = boardService.getCardById(boardCopy, this.props.card.id);
        card.imgUrl = imgUrl;
        const upadtedBoard = boardService.replaceCardInBoard(boardCopy, card);
        this.props.updateBoard(upadtedBoard);
        this.setState({ isImgLoading: false });
    }

    // handleFileUpload = async (ev) => { //no support for attachments clodinary!!!
    //     const fileName = ev.target.files[0].name;
    //     const ext = fileName.split('.').pop();
    //     this.setState({ isImgLoading: true, loadingMsg: "Uploading your attachment.." });
    //     const attachmentUrl = await cloudinaryService.uploadRawAttachment(ev, fileName);
    //     const boardCopy = boardService.getBoardCopy(this.props.board);
    //     const card = this.props.card;
    //     const cardId = card.id;
    //     const phaseIdx = this.getPhaseIdxByCardId(cardId);
    //     const cardIdx = boardCopy.phaseLists[phaseIdx].cards.findIndex(card => card.id === cardId);
    //     boardCopy.phaseLists[phaseIdx].cards[cardIdx].attachments.push({ at: Date.now(), name: fileName, ext, url: attachmentUrl })
    //     boardService.addActivity(boardCopy, this.props.user, OPERETIONS.ADD, TYPES.CARD, { id: cardId, title: card.title },
    //         `attachment ${fileName} to card`);
    //     this.props.updateBoard(boardCopy);
    //     this.setState({ isImgLoading: false, loadingMsg: null });
    // }


    removeCard = () => {
        const boardCopy = boardService.getBoardCopy(this.props.board);
        const phaseIdx = this.getPhaseIdxByCardId(this.props.card.id);
        const cardIdx = boardService.getCardIdxById(boardCopy, phaseIdx, this.props.card.id);
        //Getting access to the card inside the board
        boardCopy.phaseLists[phaseIdx].cards.splice(cardIdx, 1);
        this.props.setCard(null);
        history.push(`/board/${this.props.board._id}`);
        this.props.updateBoard(boardCopy);
    }

    render() {
        if (!this.props.board || !this.state.card) return 'Loading';
        const { card, isLabelEditShown, isMembersEditShown, cardActivities, isDueDateEditShown, isImgLoading } = this.state;
        const { assignedTo, dueDate, imgUrl, title } = card;
        const { toggleProperty, changeDueDate, removeImgUrl } = this;
        const labels = this.getUpdatedLabels();

        return (
            <section>
                <div onClick={() => {
                    history.push(`/board/${this.props.board._id}`);
                    this.props.setCard(null);
                }} className="card-modal" >
                    <div onClick={(ev) => ev.stopPropagation()} className="card-container" >
                        <div className="card-img-container flex justify-center">
                            <CardImage isImgLoading={isImgLoading} loadingMsg={this.state.loadingMsg} imgUrl={imgUrl}
                                title={title} removeImgUrl={removeImgUrl} />
                        </div>
                        < CardHeader card={card} />
                        <div className="card-content flex">
                            <div className="card-details flex column grow">
                                {assignedTo.length > 0 && <div className="card-details-members">
                                    <h3>Members</h3>
                                    <div className="flex align-center">
                                        {assignedTo.map((member) => <span key={member._id}
                                            onClick={() => { this.removeMemberFromCard(member) }}>
                                            <MemberInitials member={member} />
                                        </span>)}
                                    </div>
                                </div>}

                                {labels.length > 0 && <div className="card-details-labels">
                                    <h3>Labels</h3>
                                    <div className="labels-gallery flex wrap align-center">
                                        {labels.map(label => <span title={label.txt} className="label"
                                            onClick={() => { toggleProperty('isLabelEditShown') }}
                                            style={{ backgroundColor: label.color }}
                                            key={label.id}> <span className="label-txt">{label.txt}</span>
                                        </span>)}
                                    </div>
                                </div>}

                                {dueDate && <div className="card-details-date">
                                    <h3>Due Date</h3>
                                    <div onClick={() => { toggleProperty('isDueDateEditShown') }}
                                        className="date flex align-center">
                                        <span className="date-str">{`${moment(dueDate).format("MMM Do")}
                                     at ${moment(dueDate).format("HH:mm")}`}</span>
                                    </div>
                                </div>}
                                < CardDesc card={card} />
                                {/* <CardAttachments card={card} /> //coudinary do not suppot pdf right now */}
                                {(card.checkList.length > 0) && < CardChecklist card={card} />}
                                <Activities card={card} showCommentBox={true} activities={cardActivities} />
                            </div>
                            <div className="card-sidebar">
                                <button onClick={() => { toggleProperty('isMembersEditShown') }}
                                    className="card-sidebar-btn"><span>
                                        <PermIdentity className="icon" /></span>Members</button>
                                {isMembersEditShown &&
                                    <MembersEdit members={this.props.board.members} card={card}
                                        toggleProperty={toggleProperty} />}

                                <button onClick={() => { toggleProperty('isLabelEditShown') }} className="card-sidebar-btn">
                                    <span ><LabelOutlined className="icon" /></span>Labels</button>

                                {isLabelEditShown &&
                                    <LabelsEdit card={card} toggleProperty={toggleProperty} />}

                                {(card.checkList.length < 1) && <button className="card-sidebar-btn"
                                    onClick={this.addCheckList}><span>
                                        <PlaylistAddCheck className="icon" /></span>Checklist</button>}

                                <button onClick={() => { toggleProperty('isDueDateEditShown') }}
                                    className="card-sidebar-btn"><span>
                                        <Schedule className="icon" /></span>Due Date</button>
                                {isDueDateEditShown && <DueDateEdit changeDueDate={changeDueDate}
                                    toggleProperty={toggleProperty} />}

                                {/* <label htmlFor="attachmentUrl" className="card-sidebar-btn pointer"><span> no support from cloudinary attchemnts other then media
                                    <Attachment className="icon" /></span>Attachment</label>
                                <input type="file" className="get-file display-none" name="file" id="attachmentUrl" onChange={this.handleFileUpload} ></input> */}

                                {!imgUrl && <React.Fragment>
                                    <label htmlFor="imgUrl" className="card-sidebar-btn pointer"><span>
                                        <CropOriginal className="icon" /></span>Cover</label>
                                    <input className="display-none" type="file" id="imgUrl"
                                        onChange={this.onUploadImg} />
                                </React.Fragment>}

                                <button onClick={this.removeCard} className="card-sidebar-btn"><span>
                                    <DeleteForeverOutlined className="icon"
                                    /></span>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        )
    }
}




const mapStateToProps = (state) => {
    return {
        board: state.trelloApp.board,
        card: state.trelloApp.card,
        user: state.trelloUser.user
    }
}

const mapDispatchToProps = {
    loadBoard,
    updateBoard,
    setCard
}

export const Card = connect(mapStateToProps, mapDispatchToProps)(_Card)