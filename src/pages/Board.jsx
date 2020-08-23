import React, { Component } from 'react';
import { loadBoard, updateBoard, setCard } from '../store/actions/boardActions';
// import { queryUsers } from '../store/actions/userActions'
import { connect } from 'react-redux';
import { PhaseList } from '../cmps/PhaseList';
import { MemberInitials } from '../cmps/MemberInitials';
import { BoardMenu } from '../cmps/boardMenu/BoardMenu';
import { ColorMenu } from '../cmps/boardMenu/ColorMenu';
import { PhotoMenu } from '../cmps/boardMenu/PhotoMenu';
import {
    MenuOutlined, PieChartOutlined,
    // PersonAddOutlined  //TODO LATER WHEN ADD USER TO BOARD
}
    from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { BackgroundMenu } from '../cmps/boardMenu/BackgroundMenu';
import { Card } from '../cmps/Card';
import { BoardUserFilter } from '../cmps/BoardUserFilter'
import { socketService } from '../services/socketService';
import { boardService, OPERETIONS, TYPES } from '../services/boardService.js';
//import { MembersEdit } from '../cmps/MembersEdit' //TODO LATER WHEN ADD USER TO BOARD



class _Board extends Component {

    state = {
        boardMenus: {
            currentOpend: null,
            menusState: {
                mainMenu: false,
                backgroundMenu: false,
                colorMenu: false,
                photoMenu: false
            }
        },
        filteredByUser: null,
        boardName: '',
        isTitleOnEdit: false,
        // isMembersEditShown: false //TODO LATER WHEN ADD USER TO BOARD
    }

    async componentDidMount() {
        await this.getBoardById();
        this.openSocket();
        if (this.props.match.params.cardId && this.props.board) {
            const cardId = this.props.match.params.cardId;
            const card = boardService.getCardById(this.props.board, cardId);
            this.props.setCard(card);
        } else this.props.setCard(null);
    }

    componentDidUpdate(prevProps) {
        if ((JSON.stringify(prevProps.match.params) !== JSON.stringify(this.props.match.params))
            && this.props.board) {
            if (this.props.match.params.cardId) {
                this.loadCardById(this.props.match.params.cardId);
            }
        }
    }

    componentWillUnmount() {
        socketService.off('board updated', this.getBoardById);
        socketService.terminate();
    }

    loadCardById = () => {
        const cardId = this.props.match.params.cardId;
        const card = boardService.getCardById(this.props.board, cardId);
        this.props.setCard(card);
    }

    openSocket = () => {
        socketService.setup();
        const id = this.props.match.params.id;
        socketService.emit('open board socket', id);
        socketService.on('board updated', this.getBoardById)

    }

    getBoardById = async () => {
        const id = this.props.match.params.id;
        await this.props.loadBoard(id);
        this.setState({ boardName: this.props.board.name })
    }

    toggleMenu = (menuName) => {
        const { boardMenus } = this.state;
        const clonedMenus = JSON.parse(JSON.stringify(boardMenus));
        //close open menu if their is
        if (!menuName) { //menuName===null mean no menu should be open
            clonedMenus.menusState[clonedMenus.currentOpend] = false;
            clonedMenus.currentOpend = null;
        } else {
            if (clonedMenus.currentOpend != null)
                clonedMenus.menusState[clonedMenus.currentOpend] = !clonedMenus.menusState[clonedMenus.currentOpend];
            //open menu new menu
            clonedMenus.menusState[menuName] = !clonedMenus.menusState[menuName];
            //set currentOpend 
            clonedMenus.currentOpend = menuName;
        }
        this.setState({ boardMenus: clonedMenus }, () => {
            if (this.state.boardMenus.currentOpend) window.addEventListener('keydown', this.handleKeyDown);
            else window.removeEventListener('keydown', this.handleKeyDown)
        });
    }

    handleNameChange = ({ target }) => {
        const value = target.value;
        this.setState({ boardName: value });
    }


    handleChangeBoardName = () => {

        let boardClone = JSON.parse(JSON.stringify(this.props.board));
        const nameBeforeChange = this.state.boardName;
        if (!this.state.boardName.trim()) return this.toggleProperty('isTitleOnEdit');
        boardService.addActivity(boardClone, this.props.user, OPERETIONS.UPDATE, TYPES.BOARD, { id: this.props.board._id, title: this.props.board.name },
            `the name of the board from ${nameBeforeChange} to ${this.state.boardName}`);
        boardClone.name = this.state.boardName;
        this.props.updateBoard(boardClone);
        this.toggleProperty('isTitleOnEdit');
    }
    handleKeyPress(e) {
        if (e.keyCode === 13) {
            e.target.blur();
        }
    }

    handleKeyDown = (ev) => {
        if (ev.code === 'Escape') this.toggleMenu(null);
    }
    onInputChanged = async (name) => {
        await this.setState({ filteredByUser: name })
    }

    AddUserToBoard = async () => {
        await this.props.queryUsers();
        this.toggleProperty('isMembersEditShown');
    }

    toggleProperty = property => {
        this.setState(prevState => ({ [property]: !prevState[property] }));
    }

    render() {
        const { filteredByUser, isTitleOnEdit } = this.state;
        // const {isMembersEditShown}  = this.state; TODO: FOR ADDING USER TO BOARD
        const { board } = this.props;
        if ((!board) || (!this.state)) return '';

        const { mainMenu, backgroundMenu, colorMenu, photoMenu } = this.state.boardMenus.menusState;
        const boardBg = board.bgColor ? { "backgroundColor": board.bgColor } :
            { "backgroundImage": `url("${board.imgUrl}")`, "backgroundSize": "cover" }

        return (
            (!board) ? 'loading' : <main style={boardBg} className="board flex column grow">
                <section className="board-nav flex space-between align-center">
                    <div className="board-nav-controls flex align-center wrap">
                        {!isTitleOnEdit && <h4 onClick={() => { this.toggleProperty('isTitleOnEdit') }}
                            className="board-title">{board.name}</h4>}
                        {isTitleOnEdit && <input className="board-title grow" type="text" name="txt"
                            onChange={(e) => this.handleNameChange(e)} spellCheck="false" autoFocus
                            onBlur={this.handleChangeBoardName} value={this.state.boardName}
                            onKeyDown={this.handleKeyPress} />}
                        <span className="board-nav-divider"></span>
                        <div className="board-members flex align-center">
                            {board.members && board.members.map((member) =>
                                <MemberInitials key={member._id} member={member} />)}
                        </div>
                        {/* <div className="add-member" onClick={this.AddUserToBoard}> TODO: ADD USERS TO BOARD!!!
                            <PersonAddOutlined />

                            {isMembersEditShown && <MembersEdit users={this.props.users} board={this.props.board}
                                toggleProperty={this.toggleProperty} />}
                        </div> */}

                        <BoardUserFilter users={board.members} onInputChanged={this.onInputChanged} />
                        <Link to={`/board/${board._id}/dashboard`}>
                            <div className="nav-btn  flex align-center">
                                <PieChartOutlined className="nav-icon" />
                                <span className="btn-text">Statistics</span>
                            </div>
                        </Link>
                    </div>
                    <div className="nav-btn flex align-center" onClick={() => this.toggleMenu("mainMenu")}>
                        <MenuOutlined />
                    </div>
                    <BoardMenu isMenuShown={mainMenu} board={board} onToggleMenu={this.toggleMenu} />
                    <BackgroundMenu isMenuShown={backgroundMenu} board={board} onToggleMenu={this.toggleMenu} />
                    <ColorMenu isMenuShown={colorMenu} board={board} onToggleMenu={this.toggleMenu} />
                    <PhotoMenu isMenuShown={photoMenu} board={board} onToggleMenu={this.toggleMenu} />
                </section>
                <section className="board-content flex grow">
                    <PhaseList filteredByUser={filteredByUser} />
                </section>
                {this.props.card && <Card cardId={this.props.card.id} />}
            </main>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        board: state.trelloApp.board,
        card: state.trelloApp.card,
        user: state.trelloUser.user,
        //users: state.trelloUser.users //TODO LATER WHEN ADD USER TO BOARD
    }
}

const mapDispatchToProps = {
    loadBoard,
    updateBoard,
    setCard
    //queryUsers //TODO LATER WHEN ADD USER TO BOARD

}

export const Board = connect(mapStateToProps, mapDispatchToProps)(_Board)