import React, { Component } from 'react'
import { history } from '../history'
import { connect } from 'react-redux';
import { loadBoard, queryBoards } from '../store/actions/boardActions';

class _Boards extends Component {
    componentDidMount() {

        this.props.queryBoards();
    }

    handleLoadBoard = (id) => {
        this.props.loadBoard(id)
        history.push(`/board/${id}`)
    }

    render() {

        const { boards } = this.props
        return (
            <section className="boards-page">
                <div className='boards' >
                    <h1 className="boards-title flex">Boards</h1>
                    <div className="boards-container">
                        {!boards && <p>Your boards will appear here</p>}
                        {boards && boards.map((board, idx) =>
                            <div className={`board-item board-item${idx}`} key={idx}
                                onClick={() => this.handleLoadBoard(board._id)}
                                style={board.imgUrl ?
                                    { backgroundImage: `url(${board.imgUrl})`, backgroundSize: 'cover' } : { backgroundColor: board.bgColor }} >
                                {<h3>{board.name}</h3>}
                            </div>)}
                    </div>
                </div>
            </section>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        board: state.trelloApp.board,
        boards: state.trelloApp.boards,
        user: state.trelloApp.user
    }
}

const mapDispatchToProps = {
    loadBoard,
    queryBoards
}

export const Boards = connect(mapStateToProps, mapDispatchToProps)(_Boards)


