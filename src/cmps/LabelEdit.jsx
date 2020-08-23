import React from 'react';
import { CreateOutlined, Check } from '@material-ui/icons';

export function LabelEdit(props) {

    const { label, toggleEditMode } = props;
    const isLabelOnCard = props.card.labels.some(lbl => lbl.id === label.id);
    return (
        <div className="label-edit flex align-center">
            <span onClick={() => { props.toggleLabelOnCard(label) }}
                className="grow flex align-center" style={{ backgroundColor: label.color }}>
                {label.txt}{isLabelOnCard && <Check className="icon" />}
            </span>
            <button onClick={() => { toggleEditMode(label) }}>
                <CreateOutlined className="icon" /></button>
        </div >
    );
}
