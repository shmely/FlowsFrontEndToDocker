import React, { Component } from 'react';
import { CloseOutlined } from '@material-ui/icons/';
import { ArrowBackIosOutlined } from '@material-ui/icons';

export class BackgroundMenu extends Component {

    render() {
        const shownClass = !this.props.isMenuShown ? 'display-none' : 'shown';
        return (
            <div className={`board-menu ${shownClass}`}>
                <div className="flex column">
                    <div className="board-menu-header">
                        <div className="board-menu-header-content flex justify-center">
                            <ArrowBackIosOutlined onClick={() => this.props.onToggleMenu("mainMenu")} className="btn-header-menu" />
                            <h3 className="menu-header-title">Colors</h3>
                            <CloseOutlined onClick={() => this.props.onToggleMenu(null)} className="btn-header-menu" />
                        </div>
                    </div>
                    <div className="board-menu-content">
                        <div className="flex space-between">
                            <div className="bg-btn flex column align-center" onClick={() => this.props.onToggleMenu("photoMenu")}>
                                <img className="bg-btn-img" src={require("../../style/img/collage.jpg")} alt="" />
                                <span>Photos</span>
                            </div>
                            <div className="bg-btn flex column align-center" onClick={() => this.props.onToggleMenu("colorMenu")}>
                                <img className="bg-btn-img" src={require("../../style/img/colors.jpg")} alt="" />
                                <span>Colors</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
