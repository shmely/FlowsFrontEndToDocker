import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { boardService } from '../services/boardService'
import { HomeOutlined, DashboardOutlined, AccountTreeOutlined, Add, Close } from '@material-ui/icons';
import { MemberInitials } from './MemberInitials';
import { history } from '../history'
import { connect } from 'react-redux';
import { loadBoard, updateBoard, addBoard } from '../store/actions/boardActions';
import { logout, login } from '../store/actions/userActions'

class _MainNav extends Component {


    state = {
        isCreateBoardMenuShown: false,
        newBoardName: '',
        newBoardColor: '#61acca'
    }


    handleChangeColor = async ({ target }) => {

        const boardColor = target.value;
        await this.setState({ newBoardColor: boardColor });
    }

    handleChange = ({ target }) => {
        var value = target.value
        this.setState({ newBoardName: value })
    }

    toggleAddBoard = () => {
        this.setState(prevState => ({ isCreateBoardMenuShown: !prevState.isCreateBoardMenuShown }))
    }

    createNewBoard = async () => {
        let boardName;
        if (!this.state.newBoardName.trim()) boardName = 'New Board';
        else boardName = this.state.newBoardName;
        const newBoard = boardService.createNewBoard(boardName, this.state.newBoardColor, this.props.user);
        await this.props.addBoard(newBoard);
        history.push(`/board/${this.props.board._id}`)
        this.setState({ isCreateBoardMenuShown: false, newBoardName: '' })
    }

    render() {

        const { isCreateBoardMenuShown, newBoardName, newBoardColor } = this.state
        const { user } = this.props;
        if (!this.state) return ''
        return (
            <header className="main-header flex space-between">
                <nav className="flex align-center">
                    <Link to="/">
                        <div className="btn-main-nav flex align-center">
                            <HomeOutlined className="btn-icon" />
                        </div>
                    </Link>
                    <Link to="/boards">
                        <div className="btn-main-nav flex align-center">
                            <DashboardOutlined className="btn-icon" />
                            <span className="btn-text">Boards</span>
                        </div>
                    </Link>
                </nav>

                <div className="nav-center flex align-center justify-center">
                    <Link to="/">
                        <div className="logo flex align-center">
                            <AccountTreeOutlined className="btn-icon" />
                            <span className="logo-text">Flowz</span>
                        </div>
                    </Link>
                </div>

                <nav className="right-nav flex flex-end align-center">
                    <div className="btn-main-nav flex align-center" onClick={this.toggleAddBoard}>
                        <Add className="btn-icon" />
                    </div>
                    {isCreateBoardMenuShown && <div className="create-board-menu  flex column">
                        <div className="create-board-header flex align-center">
                            <h5 className="grow">New Board</h5>
                            <Close className="close-create-board-menu" onClick={this.toggleAddBoard} />
                        </div>
                        <div className="create-board-btns flex column">
                            <div className="color-container">

                                <label className={"rgb(81, 152, 57)" === newBoardColor ? "color-preview green selected" : "color-preview green"}  >
                                    <input onClick={this.handleChangeColor} className="color-preview-input" type="radio"
                                        name="green" value="rgb(81, 152, 57)" /></label>

                                <label className={"#d29034" === newBoardColor ? "color-preview orange selected" : "color-preview orange"} >
                                    <input onClick={this.handleChangeColor} className="color-preview-input" type="radio"
                                        name="orange" value="#d29034" /></label>

                                <label className={"rgb(0, 121, 191)" === newBoardColor ? "color-preview blue selected" : "color-preview blue"} >
                                    <input onClick={this.handleChangeColor} className="color-preview-input" type="radio"
                                        name="blue" value="rgb(0, 121, 191)" /></label>

                                <label className={"rgb(176, 70, 50)" === newBoardColor ? "color-preview red selected" : "color-preview red"} >
                                    <input onClick={this.handleChangeColor} className="color-preview-input" type="radio"
                                        name="red" value="rgb(176, 70, 50)" /></label>

                                <label className={"rgb(137, 96, 158)" === newBoardColor ? "color-preview purple selected" : "color-preview purple"} >
                                    <input onClick={this.handleChangeColor} className="color-preview-input" type="radio"
                                        name="purple" value="rgb(137, 96, 158)" /></label>

                                <label className={"rgb(205, 90, 145)" === newBoardColor ? "color-preview pink selected" : "color-preview pink"} >
                                    <input onClick={this.handleChangeColor} className="color-preview-input" type="radio"
                                        name="pink" value="rgb(205, 90, 145)" /></label>

                                <label className={"rgb(75, 191, 107)" === newBoardColor ? "color-preview light-green selected" : "color-preview light-green"} >
                                    <input onClick={this.handleChangeColor} className="color-preview-input" type="radio"
                                        name="light-green" value="rgb(75, 191, 107)" /></label>

                                <label className={"rgb(73, 169, 215)" === newBoardColor ? "color-preview turquise selected" : "color-preview turquise"} >
                                    <input onClick={this.handleChangeColor} className="color-preview-input" type="radio"
                                        name="turquise" value="rgb(73, 169, 215)" /></label>
                            </div>
                            <input className="board-name-input" type="text" onChange={this.handleChange} placeholder="Your Board's name..." value={newBoardName} />
                            <button className="create-board-btn" onClick={this.createNewBoard} >Create a new Board</button>
                        </div>
                    </div>}
                    {(user && user.fullName !== "Guest") &&
                        <div className="logout-btn btn-main-nav flex align-center">
                            <span className="btn-text" onClick={this.props.logout}>Logout</span>
                        </div>}
                    {(user) && <span className="logged-in flex align-center"><MemberInitials member={user} /></span>}

                    {user && user.fullName === "Guest" && <div className="login-btn btn-main-nav flex align-center">
                        <Link to="/login"> <span className="btn-text">Login</span></Link>
                    </div>}
                </nav>
            </header >

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
    loadBoard,
    updateBoard,
    addBoard,
    logout,
    login
}


export const MainNav = connect(mapStateToProps, mapDispatchToProps)(_MainNav)

