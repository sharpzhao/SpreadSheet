import React, { Component } from 'react';

import Cell from './Cell';
import Input from './Input';

class CellContainer extends Component {
    getCellInnerView() {
        const { editing, value, valuePresent, onChange, row, col, onDoubleClick, onContextMenu, onMouseDown, onMouseOver } = this.props;

        return editing
            ? (
                <Input
                    value={value}
                    onChange={(v) => onChange(row, col, v)}
                > </Input>
            ) : (
                <span
                    className="plain-text"
                    // onClick={() => onClick(row, col)}
                    onDoubleClick={() => onDoubleClick(row, col)}
                    onContextMenu={(e) => onContextMenu(e, row, col)}
                    onMouseDown={(e) => onMouseDown(e, row, col)}
                    onMouseOver={() => onMouseOver(row, col)}
                >{valuePresent}</span>
            );
    }

    render() {
        const { editing, selected, multiSelecting } = this.props;

        const className = [
            "cell",
            (selected || editing) && "cursor",
            multiSelecting && "multi-selecting"
        ].filter(exsit => exsit).join(" ");

        return (
            <Cell
                className={className}
            >
                {this.getCellInnerView()}
            </Cell>
        )
    }
}

export default CellContainer;