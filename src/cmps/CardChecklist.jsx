import React, { Component } from 'react'
import { connect } from 'react-redux';
import { PlaylistAddCheck } from '@material-ui/icons';
import { ChecklistItem } from './ChecklistItem';
import { loadBoard, updateBoard } from '../store/actions/boardActions';
import { boardService, OPERETIONS, TYPES } from '../services/boardService'

class _CardChecklist extends Component {
    state = {
        checkList: null,
        todoText: '',
        onAdd: false,
        progress: 0,
        checklistTitle: ''
    }

    componentDidMount() {
        let checklistTitle = this.props.card.checklistTitle
            ? this.props.card.checklistTitle : 'My Checklist';
        this.setState({ checkList: this.props.card.checkList, onAdd: false, checklistTitle },
            () => this.progressBarUpdate());
    }

    progressBarUpdate = () => {
        const doneTodos = this.state.checkList.reduce((acc, currVal) => {
            if (currVal.isDone) acc++
            return acc
        }, 0)
        this.setState({ progress: Math.floor((doneTodos / this.state.checkList.length) * 100) });
    }

    addTodo = () => {
        if (!this.state.todoText) return

        let newTodo = { txt: this.state.todoText, isDone: false }
        let clone = this.state.checkList.slice();
        clone.push(newTodo);
        this.setState({ checkList: clone, todoText: '' }, () => {
            this.handleSaveBoard();
        });
    }

    handleSaveBoard = () => {
        const boardClone = JSON.parse(JSON.stringify(this.props.board));
        const cardId = this.props.card.id;
        const currPhase = boardClone.phaseLists.find(phase => phase.cards.some(card => card.id === cardId));

        const updatedCards = currPhase.cards.map(card => {
            if (card.id === this.props.card.id) {
                card.checkList = this.state.checkList;
                card.checklistTitle = this.state.checklistTitle;
            }
            return card;
        })
        const phaseIndex = boardClone.phaseLists.findIndex(phase => phase.id === currPhase.id)
        currPhase.cards = updatedCards;
        boardClone.phaseLists[phaseIndex] = currPhase;
        boardService.addActivity(boardClone, this.props.user, OPERETIONS.UPDATE, TYPES.CARD,
            { id: this.props.card.id, title: this.props.card.title },
            'update checklist on card');

        this.props.updateBoard(boardClone)
            .then(() => {
                this.progressBarUpdate();
            })
    }


    toggleAdd = () => {
        if (this.state.todoText) this.addTodo();
        this.setState(prevState => ({ onAdd: !prevState.onAdd }));
    }


    onDelete = (idx) => {
        let clone = this.state.checkList.slice();
        clone.splice(idx, 1);
        const checklistTitle = this.state.checkList.length === 1 ? '' : this.state.checklistTitle;
        this.setState({ checkList: clone, checklistTitle }, () => {
            this.handleSaveBoard();
        })
    }

    handleChange = ({ target }, idx = -1) => {
        const field = target.name;
        const value = (field === 'isDone') ? target.checked : target.value;
        let cloneChkList = this.state.checkList.slice();
        if (field === 'isDone') {
            cloneChkList[idx].isDone = value;
            this.setState({ checkList: cloneChkList }, () => {
                this.handleSaveBoard();
            });
        }
        else {
            if (idx === -1)
                (this.state.onAdd ? this.setState({ todoText: value }) : this.setState({ checklistTitle: value }))

            else {

                cloneChkList[idx].txt = value;
            }
        }
        this.setState({ checkList: cloneChkList });
    }

    handleFocus = (ev) => ev.target.select();

    handleKeyPress(e) {
        if (e.keyCode === 13) {
            e.target.blur();
        }
    }



    render() {
        const { todoText, onAdd, checklistTitle, progress, checkList } = this.state;
        if (!checkList || !checkList.length) return null;
        const progressBgc = this.state.progress === 100 ? '#61bd4f' : '#2196f3';

        return (
            <div className="card-check-list">
                <div className="checklist-title-container flex align-center">
                    <PlaylistAddCheck className="checklist-icon" />
                    <input className="checklist-title" type="text" name="txt" placeholder="Checklist name..."
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyPress} spellCheck="false"
                        onFocus={this.handleFocus} onBlur={this.handleSaveBoard}
                        value={checklistTitle} /></div>
                {checkList && checkList.length > 0 && < div className="progress-bar-container">
                    <div className="progress-bar"
                        style={{ width: `${progress}%`, backgroundColor: progressBgc }}></div>
                </div>}
                {
                    checkList && checkList.length > 0 && this.state.checkList.map((todo, idx) => <ChecklistItem todo={todo} key={idx}
                        onDelete={this.onDelete} handleChange={this.handleChange}
                        handleSaveBoard={this.handleSaveBoard} idx={idx}
                        handleKeyPress={this.handleKeyPress} />)
                }

                {!onAdd && <button className="add-btn" onClick={this.toggleAdd}>Add Todo</button>}
                {
                    onAdd && <div className="add-item flex align-center">
                        <input type="text" onChange={this.handleChange}
                            onKeyDown={this.handleKeyPress} autoFocus onBlur={this.toggleAdd} value={todoText} />
                        <button className="save-checklist-item-btn">Save</button>
                    </div>
                }
            </div >
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
    loadBoard,
    updateBoard
}

export const CardChecklist = connect(mapStateToProps, mapDispatchToProps)(_CardChecklist)




