import React, { Component } from 'react'
import NoteOutlinedIcon from '@material-ui/icons/NoteOutlined';
import { history } from '../history'
import { connect } from 'react-redux';
import { loadBoard, updateBoard, setCard } from '../store/actions/boardActions';
import { Clear } from '@material-ui/icons';

class _CardHeader extends Component {
    state = {
        txt: '',
        onPhase: '',
        isTitleOnEdit: false
    }

    componentDidMount() {
        const cardId = this.props.card.id;
        let currPhase = this.props.board.phaseLists.filter(phase =>
            phase.cards.find(card => card.id === cardId));
        this.setState({ txt: this.props.card.title, onPhase: currPhase[0].name })
    }

    toggleInput = () => {
        this.setState(prevState => ({ isTitleOnEdit: !prevState.isTitleOnEdit }))
    }

    handleSaveBoard = () => {
        if (!this.state.txt.trim()) return this.toggleInput();
        if (this.state.isTitleOnEdit) {
            let boardClone = JSON.parse(JSON.stringify(this.props.board));
            const cardId = this.props.card.id;
            let currPhase = boardClone.phaseLists.filter(phase => phase.cards.find(card => card.id === cardId));
            currPhase[0].cards.forEach(card => {
                if (card.id === this.props.card.id) {
                    card.title = this.state.txt;
                }
            })
            this.props.updateBoard(boardClone)
            this.toggleInput();
        }
    }

    handleChange = ({ target }) => {
        var value = target.value
        this.setState({ txt: value })
        this.autoGrow(this.elTextarea)
    }

    handleKeyPress(e) {
        if (e.keyCode === 13) {
            e.target.blur();
        }
    }

    autoGrow = (el) => {
        el.style.height = (el.scrollHeight) + "px";
    }

    backToboard = () => {
        this.props.setCard(null);
        history.push(`/board/${this.props.board._id}`);
    }

    render() {
        if (!this.state) return 'loading';
        const { txt, isTitleOnEdit, onPhase } = this.state;

        return (<div className="card-header">
            <div className="card-header-container flex align-center">
                <NoteOutlinedIcon className="icon" />
                {!isTitleOnEdit && <h3 onClick={this.toggleInput} className="card-title grow">{txt}</h3>}
                {isTitleOnEdit && <textarea ref={el => this.elTextarea = el} spellCheck="false"
                    onFocus={(ev) => { this.autoGrow(ev.target) }} onKeyDown={(e) => this.handleKeyPress(e)}
                    className="card-title-input" autoFocus
                    onBlur={this.handleSaveBoard} placeholder="Title..." autoCorrect="false"
                    onChange={this.handleChange} value={txt} />}
            </div>
            <button className="close-btn" onClick={this.backToboard}>
                <Clear className="close-icon" /></button>
            <p className="card-link">in list <span
                onClick={this.backToboard}>{onPhase}</span></p>
        </div>
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
    updateBoard,
    setCard
}


export const CardHeader = connect(mapStateToProps, mapDispatchToProps)(_CardHeader)


