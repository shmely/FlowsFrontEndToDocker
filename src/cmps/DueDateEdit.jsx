import React, { Component } from 'react';
import { Clear } from '@material-ui/icons';
import { DateTimePicker } from '@material-ui/pickers';

export class DueDateEdit extends Component {

    state = {
        dueDate: 0
    }

    componentDidMount() {
        window.addEventListener('keydown', this.hideDueDateEdit);
        this.setState({ dueDate: Date.now() })
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.hideDueDateEdit);
    }

    hideDueDateEdit = (ev) => {
        if (ev.code === 'Escape') this.props.toggleProperty('isDueDateEditShown');
    }

    handleDateChange = date => {
        this.setState({ dueDate: date._d.getTime() })
    }

    handleSave = () => {
        this.props.changeDueDate(this.state.dueDate);
        this.props.toggleProperty('isDueDateEditShown');
    }

    removeDueDate = () => {
        this.props.changeDueDate(null);
        this.props.toggleProperty('isDueDateEditShown');
    }

    render() {
        const { toggleProperty } = this.props;
        const { dueDate } = this.state;
        return (
            <div className="date-picker">
                <div className="date-picker-header flex align-center">
                    <p className="grow">Change Due Date</p>
                    <button onClick={() => { toggleProperty('isDueDateEditShown') }}>
                        <Clear className="icon" /></button>
                </div>
                <div className="date-picker-content flex column justify-center">
                    <DateTimePicker className="picker-input"
                        disablePast="true"
                        views={["date", "month", "hours", "minutes"]}
                        minDateMessage=""
                        value={dueDate} onChange={this.handleDateChange} />
                    <div className="flex space-between">
                        <button onClick={this.removeDueDate}
                            className="remove-btn">Remove</button>
                        <button onClick={this.handleSave} className="save-btn">Save</button>
                    </div>
                </div>
            </div>
        );
    }
}