import React from 'react';
import SearchIcon from '@material-ui/icons/Search';

export function BoardUserFilter(props) {

    return (
        <form className="search-input-container flex" >
            <input className="board-filter-input" placeholder="Filter by user..."
                type="text" list="users" name="user"
                onChange={(event) => props.onInputChanged(event.target.value)} />
            <SearchIcon className="search-icon" />
        </form >
    )
}
