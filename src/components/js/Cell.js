import React from 'react';

const Cell = props => {
    const { className } = props;
    return (
        <td
            className={className}
        >
            {props.children}
        </td>
    );
}

export default Cell;