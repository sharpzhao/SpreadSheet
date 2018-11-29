import React from 'react';


const Console = props => {
    const { addRow, addColumn, selected } = props;
    return (
        <div className = "console"> 
            <span className = "plain-button" onClick = {props.export}>Save</span>
            <span className = "plain-button" onClick = {() => selected.i !== -1 && addColumn(selected.j)}>Insert Left</span>
            <span className = "plain-button" onClick = {() => selected.i !== -1 && addColumn(selected.j + 1)}>Insert Right</span>
            <span className = "plain-button" onClick = {() => selected.j !== -1 && addRow(selected.i)}>Insert Above</span>
            <span className = "plain-button" onClick = {() => selected.j !== -1 && addRow(selected.i + 1)}>Insert Below</span>
        </div>
    )
}

export default Console;