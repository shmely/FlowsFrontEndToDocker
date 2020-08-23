import React, { Component } from 'react';
import { PhasePreview } from './PhasePreview';
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Add, Close } from '@material-ui/icons';
import { connect } from 'react-redux';
import { updateBoard } from '../store/actions/boardActions';
import { boardService, OPERETIONS, TYPES } from '../services/boardService';


export class _PhaseList extends Component {
    state = {
        board: null,
        isInputShown: false,
        newListName: '',
        phaseListToShow: null
    }

    componentDidMount() {
        this.setState({ board: this.props.board }, () => {

            const phaseListToShow = this.getFilteredPhaseLists(this.props.filteredByUser);
            this.setState({ phaseListToShow })
        })
    }

    componentDidUpdate(prevProps) {

        if (JSON.stringify(prevProps.board) !== JSON.stringify(this.props.board)) {
            const phaseListToShow = this.getFilteredPhaseLists(this.props.filteredByUser);
            this.setState({ board: this.props.board, phaseListToShow });
        }
        if (JSON.stringify(prevProps.filteredByUser) !== JSON.stringify(this.props.filteredByUser)) {
            const phaseListToShow = this.getFilteredPhaseLists(this.props.filteredByUser);
            this.setState({ phaseListToShow })
        }
    }

    componentWillUnmount() {
        this.removeEventListeners();
    }

    getFilteredPhaseLists(searchedName) {
        if (!searchedName) return this.props.board.phaseLists;
        const cloneBoard = boardService.getBoardCopy(this.props.board);

        cloneBoard.phaseLists.map(phase => {
            return phase.cards = phase.cards.filter(card => {
                return card.assignedTo.find(user => user.fullName.toLowerCase().includes(searchedName.trim().toLowerCase()))
            })
        })
        return cloneBoard.phaseLists;
    }

    toggleInputShown = () => {
        if (!this.state.isInputShown) this.addEventListeners();
        else this.removeEventListeners();
        this.setState(prevState => ({ isInputShown: !prevState.isInputShown }))
    }

    hideInput = (ev) => {
        //To allow closing the input through Escape/click on something else
        // Cannot use 'onBlur', in order to allow adding lists in a row(Try at trello)
        if ((ev.code === 'Escape' || ev.target !== this.listNameInput)
            && ev.target !== this.submitBtn) {
            this.setState({ isInputShown: false });
            this.removeEventListeners();
        }
    }

    handleChange = ({ target }) => {
        this.setState(prevState => ({ ...prevState, newListName: target.value }));
    }

    addEventListeners = () => {
        window.addEventListener('keydown', this.hideInput);
        window.addEventListener('mousedown', this.hideInput);
    }

    removeEventListeners = () => {
        window.removeEventListener('keydown', this.hideInput);
        window.removeEventListener('mousedown', this.hideInput);
    }

    onAddPhase = async (ev) => {
        ev.preventDefault();
        if (!this.state.newListName.trim()) return;
        const boardCopy = boardService.getBoardCopy(this.props.board);
        const newPhase = boardService.getNewPhase(this.state.newListName);
        boardCopy.phaseLists.push(newPhase);
        this.setState({ newListName: '' })
        await this.props.updateBoard(boardCopy);
        this.listForm.scrollIntoView({ inline: 'end', behavior: 'smooth' });
    }

    onDragEnd = result => {

        const { destination, source, type } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const boardCopy = boardService.getBoardCopy(this.props.board);
        if (type === 'PhasePreview') {
            const newPhasesOrder = boardCopy.phaseLists;
            const movingPhase = newPhasesOrder.splice(source.index, 1)[0];
            newPhasesOrder.splice(destination.index, 0, movingPhase);
        } else {
            const { phaseLists } = boardCopy;
            const srcPhase = phaseLists.find(phase => phase.id === source.droppableId);
            const dstPhase = phaseLists.find(phase => phase.id === destination.droppableId);

            if (srcPhase.id === dstPhase.id) {
                const movingCard = srcPhase.cards.splice(source.index, 1)[0];
                srcPhase.cards.splice(destination.index, 0, movingCard);
            } else {
                const srcCards = srcPhase.cards;
                const movingCard = srcCards.splice(source.index, 1)[0];
                const dstCards = dstPhase.cards;
                dstCards.splice(destination.index, 0, movingCard);
                boardService.addActivity(boardCopy,
                    this.props.user,
                    OPERETIONS.UPDATE,
                    TYPES.CARD, {
                    id: movingCard.id,
                    title: movingCard.title
                },
                    `moved card from ${srcPhase.name} to ${dstPhase.name} -Card:`);
            }
        }
        this.props.updateBoard(boardCopy);
    }


    render() {
        if (!this.state.board || !this.state.phaseListToShow) return 'loading..'


        const { toggleInputShown, onAddPhase, handleChange, hideInput } = this;
        const { isInputShown, newListName, phaseListToShow } = this.state;

        return (

            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="all-columns" direction="horizontal" type="PhasePreview">
                    {(provided, snapshot) => (
                        <section className="phase-list flex"  {...provided.droppableProps} ref={provided.innerRef} >
                            {phaseListToShow && phaseListToShow.map((phase, index) => <PhasePreview key={phase.id} index={index}
                                phase={phase} />)}

                            {!isInputShown && <button className="add-list-btn flex align-center"
                                onClick={toggleInputShown}> <Add fontSize="small" />Add new list</button>}

                            {isInputShown && <form ref={el => this.listForm = el} className="add-list-form"
                                onSubmit={onAddPhase}>
                                <input ref={el => this.listNameInput = el} type="text" autoFocus spellCheck="false"
                                    name="newListName" onChange={handleChange} required autoComplete="off"
                                    placeholder="Enter list title.." value={newListName} />
                                <div className="flex align-center">
                                    <button ref={el => this.submitBtn = el} className="submit-btn"
                                        type="submit">Add List</button>
                                    <Close className="cancel-btn pointer" onClick={hideInput} />
                                </div>
                            </form>}
                            {provided.placeholder}
                        </section>

                    )}
                </Droppable>
            </DragDropContext>
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
    updateBoard,
}

export const PhaseList = connect(mapStateToProps, mapDispatchToProps)(_PhaseList)