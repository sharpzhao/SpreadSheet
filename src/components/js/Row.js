import React from 'react'

const Row = props => {
    const {row} = props;
    return (
        <tr>
            <td className = "sheet-head">{row + 1}</td>
            {props.children}
        </tr>
    )
}

export default Row;