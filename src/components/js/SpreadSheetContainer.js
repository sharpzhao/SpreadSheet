import React, { Component } from 'react';
import _ from 'lodash';
import mathjs from 'mathjs'
import XLSX from 'xlsx';

import Sheet from './SpreadSheet';
import Row from './Row';
import Cell from './CellContainer';
import ContextBox from './ContextBox';
import Console from './Console';
import { getColIdx, replaceRange } from '../../utils/utils';
import functions from '../../utils/functions';
import '../css/SpreadSheet.css';
import fx from '../../icons/fx.png';

class SpreadSheet extends Component {
    constructor(props) {
        super(props);
        const { width, length } = props;
        const data = _.range(length).map(() => _.fill(Array(width), ""));

        this.state = {
            data: data,
            width: width,
            length: length,
            selected: {
                i: -1,
                j: -1
            },
            editing: {
                i: -1,
                j: -1
            },
            multiSelecting: {
                i: -1,
                j: -1
            },
            contextMenu: false,
            contextBoxStyle: {},
            selecting: false
        }

        // this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.handleCloseContextMenu = this.handleCloseContextMenu.bind(this);
        this.addColunm = this.addColunm.bind(this);
        this.addRow = this.addRow.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.deleteColumn = this.deleteColumn.bind(this);
        this.exportAsFile = this.exportAsFile.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
        this.handlePaste= this.handlePaste.bind(this);


        this.scope = {
            ...functions
        }

    }

    // onClick(i, j) {
    //     this.setState({
    //         editing: { i: -1, j: -1 }
    //     });
    // }

    onDoubleClick(i, j) {
        this.setState({
            editing: { i: i, j: j },
        })
    }

    onChange(row, col, value) {
        const data = _.cloneDeep(this.state.data);
        data[row][col] = value;
        this.setState({ data: data })
    }

    onKeyDown(e) {
        const keyCode = e.which || e.keyCode
        const { editing, selected, data} = this.state;
        const width = data[0].length;
        const length = data.length;

        //paste
        if (e.metaKey || e.ctrlKey) {
            if (keyCode === 67) {
                this.handleCopy();
            } else if (keyCode === 86) {
                this.handlePaste();
            }

            return;
        };

        if (editing.i !== -1) {
            if (keyCode === 13 || keyCode === 27) {
                this.setState({ selected: _.cloneDeep(editing), editing: { i: -1, j: -1 } })
                this.sheetContainer.focus();
            }
            return;
        }

        if (selected.i === -1) return;

        if (keyCode >= 48 && keyCode <= 255) { // valid key
            let data = _.cloneDeep(this.state.data);
            data[selected.i][selected.j] = "";
            this.setState({ editing: _.cloneDeep(selected), data: data });
            return;
        }

        if ((keyCode === 46 || keyCode === 8)) {
            let data = _.cloneDeep(this.state.data);
            data[selected.i][selected.j] = "";
            this.setState({ data: data });
            return;
        }


        if (keyCode === 37 && selected.j > 0) { // left
            this.setState({ selected: Object.assign({}, selected, { j: selected.j - 1 }) });
        } else if (keyCode === 38 && selected.i > 0) { //up
            this.setState({ selected: Object.assign({}, selected, { i: selected.i - 1 }) });
        } else if ((keyCode === 9 || keyCode === 39) && selected.j < width - 1) { //right
            e.preventDefault();
            this.setState({ selected: Object.assign({}, selected, { j: selected.j + 1 }) });
        } else if ((keyCode === 13 || keyCode === 40) && selected.i < length - 1) { //down
            this.setState({ selected: Object.assign({}, selected, { i: selected.i + 1 }) });
        }
        this.sheetContainer.focus();
    }

    handleCloseContextMenu(e) {
        this.setState({ contextMenu: false });
        document.removeEventListener('click', this.handleCloseContextMenu);
    }

    onContextMenu(e, i, j) {
        e.preventDefault();
        if (!this.isMultiSelected(i, j)) this.setState({
            selected: { i: i, j: j },
            multiSelecting: {i: i, j: j},
            editing: {i: -1, j: -1}
        });
        this.setState(
            { contextMenu: {i: i, j: j}, contextBoxStyle: { left: e.pageX, top: e.pageY } },
            () => document.addEventListener('click', this.handleCloseContextMenu)
        );
    }

    onMouseDown(e, i, j) {
        if (e.nativeEvent.which !== 1) return;
        this.setState({
            selecting: true,
            selected: { i: i, j: j },
            multiSelecting: {i: i, j: j},
            editing: {i: -1, j: -1}
        });
    }

    onMouseOver(i, j) {
        if (this.state.selecting) {
            this.setState({multiSelecting: {i: i, j: j}});
        }
    }

    onMouseUp() {
        this.setState({selecting: false});

    }

    handlePaste() {
        const data = _.cloneDeep(this.state.data);
        const paste = this.pasteData;
        const selected = this.state.selected;

        if (!paste || paste.length === 0) return;

        for (let i = selected.i; i < data.length && i - selected.i < paste.length; i ++) {
            const row = data[i];
            const pRow = paste[i - selected.i];
            for (let j = selected.j; j < row.length && j - selected.j < pRow.length; j ++) {
                data[i][j] = pRow[j - selected.j];
            }
        }

        this.setState({data: data, multiSelecting: {i: selected.i + paste.length - 1, j: selected.j + paste[0].length - 1}});
    }

    handleCopy() {
        if (this.state.editing.i !== -1) return;

        const start = this.state.selected;
        const end = this.state.multiSelecting;

        const x0 = Math.min(start.i, end.i);
        const x1 = Math.max(start.i, end.i);

        const y0 = Math.min(start.j, end.j);
        const y1 = Math.max(start.j, end.j);

        if (y0 === -1) return;

        this.pasteData = this.state.data.slice(x0, x1 + 1).map( row => row.slice(y0, y1 + 1));
    }

    isMultiSelected(i, j) {
        const start = this.state.selected;
        const end = this.state.multiSelecting;

        return Math.min(start.i, end.i) <= i 
        && i <= Math.max(start.i, end.i) 
        && Math.min(start.j, end.j) <= j
        && j <= Math.max(start.j, end.j);
    }

    addColunm(col) {
        const dupData = _.cloneDeep(this.state.data);
        const data = dupData.map(row => [...row.slice(0, col), "", ...row.slice(col, row.length)]);
        this.setState({ data: data });
    }

    addRow(row) {
        const data = [...this.state.data.slice(0, row), _.fill(Array(this.state.data[0].length), ""), ...this.state.data.slice(row, this.state.data.length)]
        this.setState({ data: data });
    }

    deleteRow(row) {
        const data = [...this.state.data.slice(0, row), ...this.state.data.slice(row + 1, this.state.data.length)];
        this.setState({data: data})
    }

    deleteColumn(col) {
        const data = this.state.data.map(row => [...row.slice(0, col), ...row.slice(col + 1, row.length)])
        this.setState({data: data})
    }

    exportAsFile() {
        const sheet = XLSX.utils.aoa_to_sheet(this.state.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet, "new file");
        XLSX.writeFile(workbook, 'file.xlsx');
    }

    isSelected(i, j) {
        const selected = this.state.selected;
        return selected.i === i && selected.j === j;
    }

    isEditing(i, j) {
        const editing = this.state.editing;
        return editing.i === i && editing.j === j;
    }

    getKey(i, j) {
        const col = getColIdx(j);
        const row = i;

        return col + row;
    }

    getValuePresent(value, i, j) {
        const expr = replaceRange(value.trim());
        const key = this.getKey(i + 1, j + 1);

        if (expr.length === 0 || expr.charAt(0) !== "=") {
            this.scope[key] = parseInt(expr, 10) || 0;
            return value;
        }

        let presentValue = "";
        try {
            presentValue = mathjs.eval(expr.substring(1), this.scope);
        } catch (e) {
            // do nothing;
        }

        this.scope[key] = parseInt(presentValue, 10);
        return presentValue;
    }

    render() {
        const { selected, editing, data } = this.state;
        let value = "";
        let position = {};
        if (selected.i !== -1) {
            value = data[selected.i][selected.j];
            position = selected;
        } else if (editing.i !== -1) {
            value = data[editing.i][editing.j];
            position = editing;
        }
        return (
            <span
                ref={d => this.sheetContainer = d}
                tabIndex='0'
                className='sheet-container'
                onKeyDown={this.handleKey}
                onKeyDownCapture={this.onKeyDown}
                onMouseUp={this.onMouseUp}
            >
                <Console 
                    export = {this.exportAsFile}
                    addColumn = {this.addColunm}
                    addRow = {this.addRow}
                    selected = {this.state.selected.i === -1 ? this.state.editing : this.state.selected}
                ></Console>
                <div className="sheet-mirror-input-console">
                    <img src={fx} className="sheet-mirror-input-icon" alt="mirror input"></img>
                    <input className="sheet-mirror-input" value={value} onChange={(e) => this.onChange(position.i, position.j, e.target.value)}></input>
                </div>
                <Sheet width={this.state.data[0].length}>
                    {
                        this.state.data.map((row, i) => {
                            return (
                                <Row length={this.state.data.length} row={i} key={"row_" + i}>
                                    {
                                        row.map((cell, j) => {
                                            return (
                                                <Cell
                                                    selected={this.isSelected(i, j)}
                                                    multiSelecting = {this.isMultiSelected(i, j)}
                                                    editing={this.isEditing(i, j)}
                                                    value={cell}
                                                    valuePresent={this.getValuePresent(cell, i, j)}
                                                    // onClick={this.onClick}
                                                    row={i}
                                                    col={j}
                                                    key={`${i}_${j}`}
                                                    onDoubleClick={this.onDoubleClick}
                                                    onChange={this.onChange}
                                                    onContextMenu={this.onContextMenu}
                                                    onMouseDown={this.onMouseDown}
                                                    onMouseOver={this.onMouseOver}
                                                ></Cell>
                                            );
                                        })
                                    }
                                </Row>
                            );
                        })
                    }
                </Sheet>
                {this.state.contextMenu
                    && <ContextBox
                        style={this.state.contextBoxStyle}
                        addColunm={this.addColunm}
                        addRow={this.addRow}
                        deleteRow = {this.deleteRow}
                        deleteColumn = {this.deleteColumn}
                        contextCell={this.state.contextMenu}
                        handleCopy = {this.handleCopy}
                        handlePaste = {this.handlePaste}
                    ></ContextBox>}
            </span>
        );
    }
}


export default SpreadSheet;