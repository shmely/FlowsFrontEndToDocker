import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateBoard } from '../store/actions/boardActions';
import { Clear, Add } from '@material-ui/icons';
import { boardService } from '../services/boardService';
import { LabelEdit } from './LabelEdit';
import { AddLabel } from './AddLabel';

class _LabelsEdit extends Component {

    state = {
        editLabel: null,
        isAddLabelShown: false
    }

    componentDidMount() {
        window.addEventListener('keydown', this.hideLabelsEdit);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.hideLabelsEdit);
    }

    hideLabelsEdit = (ev) => {
        if (ev.code === 'Escape') this.props.toggleProperty('isLabelEditShown');
    }

    toggleEditMode = (editLabel) => {
        this.setState({ editLabel });
    }

    handleChange = ({ target }) => {
        this.setState(prevState => ({
            editLabel: {
                ...prevState.editLabel,
                txt: target.value
            }
        }));
    }

    saveLabel = (ev) => {
        ev.preventDefault();
        const editedLabel = this.state.editLabel;
        const boardCopy = boardService.getBoardCopy(this.props.board);

        boardCopy.labels = boardCopy.labels.map(label => {
            if (label.id === editedLabel.id) return editedLabel;
            return label;
        })
        this.toggleEditMode();
        this.props.updateBoard(boardCopy);
    }

    toggleLabelOnCard = (label) => {
        const boardCopy = boardService.getBoardCopy(this.props.board);
        const card = boardService.getCardById(boardCopy, this.props.card.id);

        //Checking if the card has the label or not and flip it
        if (card.labels.some(lbl => lbl.id === label.id)) {
            card.labels = card.labels.filter(lbl => lbl.id !== label.id);
        } else card.labels.push(label);
        
        const updatedBoard = boardService.replaceCardInBoard(boardCopy, card);
        this.props.updateBoard(updatedBoard);//Updated the board
    }

    toggleIsAddLabelShown = () => {
        this.setState(prevState => ({ isAddLabelShown: !prevState.isAddLabelShown }));
    }

    addLabel = (partialLabel) => {
        const labelToSave = boardService.getNewLabel(partialLabel);
        const boardCopy = boardService.getBoardCopy(this.props.board);
        boardCopy.labels.push(labelToSave);
        this.props.updateBoard(boardCopy);
        this.toggleIsAddLabelShown();
    }

    removeLabel = (id) => {
        const boardCopy = boardService.getBoardCopy(this.props.board);
        const updatedLabels = boardCopy.labels.filter(label => label.id !== id);
        boardCopy.labels = updatedLabels;
        this.props.updateBoard(boardCopy);
        this.toggleEditMode(null);
    }

    render() {
        const { toggleEditMode, saveLabel, toggleLabelOnCard, removeLabel } = this;
        const { editLabel, isAddLabelShown } = this.state;
        const { labels } = this.props.board;
        return (
            <React.Fragment>
                {!isAddLabelShown && <section className="edit-labels flex column">
                    <div className="edit-labels-header flex align-center">
                        <p className="grow">Labels</p>
                        <button onClick={() => { this.props.toggleProperty('isLabelEditShown') }}>
                            <Clear /></button>
                    </div>
                    <div className="labels-gallery grow">
                        {!editLabel && labels.map(label => <LabelEdit toggleLabelOnCard={toggleLabelOnCard}
                            card={this.props.card} saveLabel={saveLabel} key={label.id} label={label}
                            toggleEditMode={toggleEditMode} />)}

                        {editLabel && <div>
                            <form onSubmit={saveLabel}>
                                <input type="text" name="txt" value={editLabel.txt} autoFocus
                                    autoComplete="off" spellCheck="false" onChange={this.handleChange} />
                                <button className="save-btn">Save</button>
                            </form>
                            <button className="cancel-btn" onClick={() => { removeLabel(editLabel.id) }}>
                                Delete</button>
                        </div>}

                    </div>
                    <button className="add-label-btn flex align-center justify-center"
                        onClick={this.toggleIsAddLabelShown}
                    ><Add className="add-icon" />Add Label</button>
                </section>}

                {isAddLabelShown &&
                    <AddLabel addLabel={this.addLabel}
                        toggleIsAddLabelShown={this.toggleIsAddLabelShown} />}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        board: state.trelloApp.board,
    }
}

const mapDispatchToProps = {
    updateBoard
}

export const LabelsEdit = connect(mapStateToProps, mapDispatchToProps)(_LabelsEdit)