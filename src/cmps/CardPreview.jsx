import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { CardLabels } from './CardLabels';
import { AttachmentOutlined, CheckBoxOutlined, CreateOutlined } from '@material-ui/icons';
import NaturalDragAnimation from 'natural-drag-animation-rbdnd';
import { loadBoard, setCard } from '../store/actions/boardActions';
import { connect } from 'react-redux';
import { DueBadge } from './DueBadge';
import { MemberInitials } from './MemberInitials';
import { CardMenu } from './CardMenu';
import { boardService } from '../services/boardService';
import { history } from '../history';


class _CardPreview extends React.Component {

    state = {
        isMenuShown: false,
        pageX: 0,
        pageY: 0
    }

    getUpdatedLabels = () => {
        if (!this.props.board.labels.length) return [];
        const { labels } = this.props.card;
        const boardCopy = boardService.getBoardCopy(this.props.board);
        const updatedLabels = labels.reduce((acc, label) => {
            const foundLabel = boardCopy.labels.find(boardLabel => boardLabel.id === label.id);
            if (foundLabel) acc.push(foundLabel);
            return acc;
        }, [])
        return updatedLabels;
    }

    toggleIsMenuShown = (ev) => {
        if (ev) {
            ev.preventDefault();//This prevents context menu
            ev.stopPropagation();//This prevents card from opening
        }
        this.setState(prevState => ({ isMenuShown: !prevState.isMenuShown }));
    }

    render() {
        const { toggleIsMenuShown, state } = this;
        const { isMenuShown } = state;
        const { title, imgUrl, dueDate, checkList, assignedTo, attachments } = this.props.card;
        const checklistDoneCount = checkList.filter(item => item.isDone).length;
        const checklistBgc = checklistDoneCount === checkList.length ? '#61bd4f' : '';
        const checklistColor = checklistBgc ? '#fff' : '';
        const labels = this.getUpdatedLabels();
        return (
            <React.Fragment>

                {isMenuShown && <CardMenu card={this.props.card} toggleIsMenuShown={toggleIsMenuShown} />}

                <Draggable draggableId={this.props.card.id} index={this.props.index}>
                    {(provided, snapshot) => (
                        <NaturalDragAnimation style={provided.draggableProps.style} snapshot={snapshot}>
                            {style => (
                                <section onContextMenu={toggleIsMenuShown}
                                    onClick={() => {
                                        history.push(`/board/${this.props.board._id}/${this.props.card.id}`)
                                    }}
                                    // onClick={() => { this.props.setCard(this.props.card) }}
                                    className="card-preview flex column"
                                    {...provided.draggableProps} {...provided.dragHandleProps}
                                    ref={provided.innerRef} style={style}>

                                    <button onClick={toggleIsMenuShown}
                                        className="show-menu-btn">
                                        <CreateOutlined className="show-menu-icon" />
                                    </button>

                                    {imgUrl && <div className="card-img flex justify-center">
                                        <img alt="Card" src={imgUrl} /></div>}
                                    {labels && <CardLabels labels={labels} />}

                                    <p>{title}</p>

                                    <div className="card-badges flex wrap">
                                        {dueDate && <DueBadge dueDate={dueDate} />}

                                        {attachments.length > 0 &&
                                            <div className="attach-badge flex align-center">
                                                <AttachmentOutlined className="attach-icon" />
                                                <span>{attachments.length}</span>
                                            </div>}

                                        {checkList.length > 0 &&
                                            <div style={{ backgroundColor: checklistBgc, color: checklistColor }}
                                                className="checklist-badge flex align-center">
                                                <span><CheckBoxOutlined className="checklist-icon" />
                                                </span>
                                                <span>{checklistDoneCount}/{checkList.length}</span>
                                            </div>}
                                    </div>
                                    <div className="members-badge flex align-center">
                                        {assignedTo.length > 0 &&
                                            assignedTo.map((member) => <MemberInitials key={member._id} member={member} />)}
                                    </div>
                                </section>
                            )}
                        </NaturalDragAnimation>
                    )}
                </Draggable>
            </React.Fragment>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        board: state.trelloApp.board
    }
}

const mapDispatchToProps = {
    loadBoard,
    setCard
}

export const CardPreview = connect(mapStateToProps, mapDispatchToProps)(_CardPreview)