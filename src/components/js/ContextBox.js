import React from 'react';

const ContextBox = props => {
    const { style, contextCell, addColunm, addRow, deleteRow, deleteColumn, handleCopy, handlePaste } = props;
    return (
        <div className="context-box" style={style}>
            <div className = "context-box-list" onClick = {() => addColunm(contextCell.j)}>Insert Column Left</div>
            <div className = "context-box-list" onClick = {() => addColunm(contextCell.j + 1)}>Insert Column Right</div>
            <div className = "context-box-list" onClick = {() => addRow(contextCell.i)}>Insert Row Above</div>
            <div className = "context-box-list" onClick = {() => addRow(contextCell.i + 1)}>Insert Row Blow</div>
            <div className = "context-box-divider"></div>
            <div className = "context-box-list" onClick = {() => deleteColumn(contextCell.j)}>Delete Column</div>
            <div className = "context-box-list" onClick = {() => deleteRow(contextCell.i)}>Delete Row</div>
            <div className = "context-box-divider"></div>
            <div className = "context-box-list" onClick = {handleCopy}>Copy</div>
            <div className = "context-box-list" onClick = {handlePaste}>Paste</div>
        </div>
    )
}

export default ContextBox;