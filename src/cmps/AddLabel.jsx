import React, { Component } from 'react';
import { Clear } from '@material-ui/icons';

export class AddLabel extends Component {

    state = {
        txt: '',
        color: '#b3bac5'
    }

    handleChangeColor = ({ target }) => {
        this.setState({ color: target.value });
    }

    handleChange = ({ target }) => {
        this.setState({ txt: target.value });
    }

    handleSubmit = (ev) => {
        ev.preventDefault();
        this.props.addLabel(this.state);
    }

    render() {
        const { txt, color } = this.state;
        return (
            <section className="add-label">
                <div className="add-label-header flex align-center">
                    <p className="grow">Add a label</p>
                    <button onClick={this.props.toggleIsAddLabelShown}>
                        <Clear /></button>
                </div>
                <div className="add-label-gallery">
                    <p>Select a color</p>
                    <label className={"#61bd4f" === color ? "color-preview c-61bd4f selected" : "color-preview c-61bd4f"}  >
                        <input onClick={this.handleChangeColor} className="display-none" type="radio"
                            value="#61bd4f" /></label>

                    <label className={"#f2d600" === color ? "color-preview f2d600 selected" : "color-preview f2d600"} >
                        <input onClick={this.handleChangeColor} className="display-none" type="radio"
                            value="#f2d600" /></label>

                    <label className={"#ff9f1a" === color ? "color-preview ff9f1a selected" : "color-preview ff9f1a"} >
                        <input onClick={this.handleChangeColor} className="display-none" type="radio"
                            value="#ff9f1a" /></label>

                    <label className={"#eb5a46" === color ? "color-preview eb5a46 selected" : "color-preview eb5a46"} >
                        <input onClick={this.handleChangeColor} className="display-none" type="radio"
                            value="#eb5a46" /></label>

                    <label className={"#0079bf" === color ? "color-preview c-0079bf selected" : "color-preview c-0079bf"} >
                        <input onClick={this.handleChangeColor} className="display-none" type="radio"
                            value="#0079bf" /></label>

                    <label className={"#00c2e0" === color ? "color-preview c-00c2e0 selected" : "color-preview c-00c2e0"} >
                        <input onClick={this.handleChangeColor} className="display-none" type="radio"
                            value="#00c2e0" /></label>

                    <label className={"#ff78cb" === color ? "color-preview ff78cb selected" : "color-preview ff78cb"} >
                        <input onClick={this.handleChangeColor} className="display-none" type="radio"
                            value="#ff78cb" /></label>

                    <label className={"#344563" === color ? "color-preview c-344563 selected" : "color-preview c-344563"} >
                        <input onClick={this.handleChangeColor} className="display-none" type="radio"
                            value="#344563" /></label>

                    <label className={"#b3bac5" === color ? "color-preview b3bac5 selected" : "color-preview b3bac5"} >
                        <input onClick={this.handleChangeColor} className="display-none" type="radio"
                            value="#b3bac5" /></label>

                    <label className={"#c377e0" === color ? "color-preview c377e0 selected" : "color-preview c377e0"} >
                        <input onClick={this.handleChangeColor} className="display-none" type="radio"
                            value="#c377e0" /></label>
                    <form onSubmit={(ev) => {
                        ev.preventDefault();
                        this.props.addLabel(this.state);
                    }}>
                        <input type="text" name="txt" value={txt} autoFocus
                            placeholder="Enter label name.." required
                            autoComplete="off" spellCheck="false" onChange={this.handleChange} />
                        <button className="save-btn">Save</button>
                    </form>
                    <button className="cancel-btn" onClick={this.props.toggleIsAddLabelShown}>
                        Cancel</button>
                </div>

            </section>
        )
    }
}
