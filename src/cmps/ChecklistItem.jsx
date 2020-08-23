import React from 'react';
import { Clear } from '@material-ui/icons';

export function ChecklistItem(props) {
    const { idx, todo, onDelete, handleChange, handleSaveBoard, handleKeyPress } = props;
    return (
        <div className="checklist-item flex align-center" key={idx} >
            <input className="checkbox" type="checkbox" name="isDone"
                onChange={(e) => { handleChange(e, idx) }}
                onBlur={handleSaveBoard} checked={todo.isDone} />
                
            <input className="checklist-item-txt grow" type="text" name="txt"
                onChange={(e) => handleChange(e, idx)} spellCheck="false"
                placeholder="Add a todo..."
                onBlur={handleSaveBoard} value={todo.txt} onKeyDown={handleKeyPress} />
            <button onClick={() => { onDelete(idx) }}><Clear className="icon" /></button>
        </div>
    )
}
