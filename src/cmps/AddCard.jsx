import React, { Component } from 'react';
import { Close } from '@material-ui/icons';
import { connect } from 'react-redux';
import { updateBoard } from '../store/actions/boardActions';
import { boardService, OPERETIONS, TYPES } from '../services/boardService';

export class _AddCard extends Component {
    state = {
        card: {
            title: ''
        }
    }

    componentDidUpdate() {
        if (this.props.isAddCardShown) {
            this.cardNameInput.addEventListener("keypress", this.submitOnEnter);
            window.addEventListener("mouseup", this.handleClick);
            this.props.bottomCard.scrollIntoView({ behavior: 'smooth' });
        }
        else window.removeEventListener("mouseup", this.handleClick);
    }


    handleChange = ({ target }) => {
        this.setState({ card: { title: target.value } })
    }

    onAddCard = async (ev) => {
        ev.preventDefault();
        if (!this.state.card.title.trim()) return;
        const boardCopy = boardService.getBoardCopy(this.props.board);
        const phaseIdx = boardCopy.phaseLists.findIndex(phase => phase.id === this.props.phaseId);
        const newCard = boardService.getNewCard(this.state.card);
        boardCopy.phaseLists[phaseIdx].cards.push(newCard);
        boardService.addActivity(boardCopy, this.props.user, OPERETIONS.ADD, TYPES.CARD, { id: newCard.id, title: newCard.title });

        this.setState({ card: { title: '' } });
        await this.props.updateBoard(boardCopy);//async await is for the scroll
        this.props.bottomCard.scrollIntoView({ behavior: 'smooth' });
    }

    submitOnEnter(ev) {
        // this allows Shift+Enter = new line, Enter = submit form
        if (ev.which === 13 && !ev.shiftKey) {
            ev.target.form.dispatchEvent(new Event("submit", { cancelable: true }));
            ev.preventDefault();
        }
    }

    handleClick = (ev) => {
        if (ev.target !== this.addCardBtn &&//If user clicked add button or the input
            ev.target !== this.cardNameInput) {
            if (this.state.card.title) {//If there's input- add the card
                this.addCardBtn.form.dispatchEvent(new Event("submit", { cancelable: true }));
            }
            this.props.toggleAddCardShown();
        }//This rather than onBlur because it gives the user
        // the experience of clicking the button himself
    }

    render() {
        const { handleChange, onAddCard, state } = this;
        const { toggleAddCardShown, isAddCardShown } = this.props;

        return (
            <React.Fragment>
                {isAddCardShown && <form className="add-card" onSubmit={onAddCard}>
                    <textarea className="card-name-input" required autoFocus type="text"
                        name="title" autoComplete="off" onChange={handleChange} spellCheck="false"
                        ref={el => this.cardNameInput = el} value={state.card.title}
                        placeholder="Enter a title for this card.." />
                    <div className="form-btns flex align-end">
                        <button ref={(el) => this.addCardBtn = el} className="submit-btn"
                            type="submit">Add Card</button>
                        <button className="close-btn" onClick={toggleAddCardShown}><Close /></button>
                    </div>
                </form>}
            </React.Fragment>
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

export const AddCard = connect(mapStateToProps, mapDispatchToProps)(_AddCard)
