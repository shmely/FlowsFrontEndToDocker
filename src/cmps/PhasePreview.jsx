import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { MoreHoriz, Close, Add } from '@material-ui/icons';
import { AddCard } from './AddCard';
import { CardPreview } from './CardPreview';
import { connect } from 'react-redux';
import { updateBoard } from '../store/actions/boardActions';
import { boardService } from '../services/boardService';
import NaturalDragAnimation from 'natural-drag-animation-rbdnd';

export class _PhasePreview extends Component {

    state = {
        isInputShown: false,
        isMenuShown: false,
        isSortShown: false,
        newPhaseName: '',
        isAddCardShown: false
    }

    componentDidMount() {
        this.setState({ newPhaseName: this.props.phase.name })
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.hideInput);
    }

    toggleInputShown = () => {
        if (!this.state.isInputShown) window.addEventListener('keydown', this.hideInput);
        else window.removeEventListener('keydown', this.hideInput);
        this.setState(prevState => ({ isInputShown: !prevState.isInputShown }))
    }

    hideInput = (ev) => {
        if (ev.code === 'Escape' || ev.type === 'onblur') {
            this.setState({ isInputShown: false });
            window.removeEventListener('keydown', this.hideInput);
        }
    }

    handleChange = ({ target }) => {
        this.setState({ newPhaseName: target.value })
    }

    handleSubmit = (ev) => {
        ev.preventDefault();
        if (!this.state.newPhaseName.trim()) return;
        const boardCopy = boardService.getBoardCopy(this.props.board);
        const phaseIdx = boardCopy.phaseLists.findIndex(phase => phase.id === this.props.phase.id);
        boardCopy.phaseLists[phaseIdx].name = this.state.newPhaseName;
        this.props.updateBoard(boardCopy);
        this.toggleInputShown();
    }

    toggleMenuShown = () => {
        if (this.state.isSortShown) {
            //making sure menu returns to default "state"
            this.setState({ isMenuShown: false, isSortShown: false });
        } else this.setState(prevState => ({ isMenuShown: !prevState.isMenuShown }));
    }

    showAddCard = () => {
        this.setState({ isAddCardShown: true });
        this.toggleMenuShown();
    }

    toggleAddCardShown = () => {
        this.setState(prevState => ({ isAddCardShown: !prevState.isAddCardShown }));
    }

    toggleIsSortShown = () => {
        this.setState(prevState => ({ isSortShown: !prevState.isSortShown }));
    }

    sortListBy = (sortBy) => {
        const boardCopy = boardService.getBoardCopy(this.props.board);
        const { id } = this.props.phase;
        const phase = boardCopy.phaseLists.find(phase => phase.id === id);
        const sortedPhase = boardService.getSortedPhase(sortBy, phase);
        boardCopy.phaseLists = boardCopy.phaseLists.filter(phase => phase.id ===
            sortedPhase.id ? sortedPhase : phase);
        this.props.updateBoard(boardCopy);
        this.toggleIsSortShown();//to close the menu
        this.toggleMenuShown();
    }

    onDeletePhase = () => {
        this.toggleMenuShown();
        const boardCopy = boardService.getBoardCopy(this.props.board);
        boardCopy.phaseLists = boardCopy.phaseLists.filter(phase => phase.id !== this.props.phase.id);
        this.props.updateBoard(boardCopy);
    }

    render() {
        const { name, id, cards } = this.props.phase;
        const { newPhaseName, isInputShown, isMenuShown, isSortShown, isAddCardShown } = this.state;

        return (
            <Draggable draggableId={id} index={this.props.index}>
                {(provided, snapshot) => (
                    <NaturalDragAnimation
                        style={provided.draggableProps.style}
                        snapshot={snapshot}
                    >
                        {style => (
                            <article className="phase flex column"
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                                {...snapshot.isDropAnimating = true} style={style}
                            >
                                <div {...provided.dragHandleProps} className="phase-header flex space-between">

                                    {!isInputShown && <h5 className="phase-title grow"
                                        onClick={this.toggleInputShown}>{name}</h5>}
                                    {isInputShown && <form className="flex grow" onSubmit={this.handleSubmit}>
                                        <input className="phase-name-input grow" type="text" name="newPhaseName"
                                            value={newPhaseName} autoFocus autoComplete="off" spellCheck="false"
                                            onBlur={this.toggleInputShown} onChange={this.handleChange} />
                                    </form>}

                                    <MoreHoriz className="pointer" onClick={this.toggleMenuShown} />
                                    {isMenuShown && <div className="phase-menu flex column">
                                        <div className="menu-header flex align-center">

                                            <h5 className="grow">List Actions</h5>
                                            <Close className="pointer" onClick={this.toggleMenuShown} />
                                        </div>
                                        <div className="menu-btns flex column">
                                            <button onClick={this.showAddCard} >Add A Card</button>
                                            <button onClick={this.toggleIsSortShown}>Sort By..</button>
                                            {isSortShown && <div className="sort-options flex column">
                                                <button onClick={() => {
                                                    this.sortListBy('title')
                                                }}>Title</button>
                                                <button onClick={() => {
                                                    this.sortListBy('firstCreated')
                                                }}>First Created</button>
                                                <button onClick={() => {
                                                    this.sortListBy('lastCreated')
                                                }}>Last Created</button>
                                            </div>}
                                            <button onClick={this.onDeletePhase}>Delete List</button>

                                        </div>
                                    </div>}
                                </div>
                                <Droppable droppableId={id}>
                                    {(provided) => (
                                        <div className="cards-list" ref={provided.innerRef} {...provided.droppableProps}>
                                            {cards.map((card, index) => <CardPreview key={card.id} card={card} index={index} />)}
                                            {provided.placeholder}
                                            <AddCard isAddCardShown={isAddCardShown} bottomCard={this.bottomCard}
                                                toggleAddCardShown={this.toggleAddCardShown} phaseId={this.props.phase.id} />
                                            <div style={{ opacity: 0 }} ref={el => this.bottomCard = el}></div>
                                        </div>
                                    )}
                                </Droppable>
                                {!isAddCardShown && <button onClick={this.toggleAddCardShown}
                                    className="add-card-btn flex align-center">
                                    <Add className="add-icon" fontSize="large" />Add a card</button>}
                            </article>
                        )}
                    </NaturalDragAnimation>
                )}

            </Draggable>
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

export const PhasePreview = connect(mapStateToProps, mapDispatchToProps)(_PhasePreview)