import React, { Component } from 'react'
import DescriptionIcon from '@material-ui/icons/Description';
import { connect } from 'react-redux';
import { loadBoard, updateBoard } from '../store/actions/boardActions';

class _CardDesc extends Component {
    state = {
        txt: ''
    }

    componentDidMount() {
        this.setState({ txt: this.props.card.desc })
    }

    handleChange = ({ target }) => {
        var value = target.value
        this.setState({ txt: value })
    }


    handleSaveBoard = () => {
        let boardClone = JSON.parse(JSON.stringify(this.props.board));
        const cardId = this.props.card.id;
        let currPhase = boardClone.phaseLists.filter(phase => phase.cards.find(card => card.id === cardId));

        currPhase[0].cards.forEach(card => {
            if (card.id === this.props.card.id) {
                card.desc = this.state.txt;
            }
        })
        this.props.updateBoard(boardClone);
    }

    render() {
        return (
            <section>
                <div className="desc-header-container flex">
                    <DescriptionIcon className="icon" />
                    <span className="desc-header">Description</span>
                </div>
                <textarea className="card-desc-input"
                    placeholder="Add a more detailed description..." onChange={this.handleChange}
                    spellCheck="false"
                    onBlur={this.handleSaveBoard} value={this.state.txt}></textarea>
            </section>
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
    updateBoard
}


export const CardDesc = connect(mapStateToProps, mapDispatchToProps)(_CardDesc)


