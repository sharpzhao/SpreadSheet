import React from 'react';

import { getColIdx } from '../../utils/utils';

import _ from 'lodash';

const SpreadSheet = props => {
    const { width } = props;

    return (
        <table className="ucsc-spread-sheet">
            <tbody>
                {
                    <tr>
                    {
                        _.range(width + 1).map( (idx) => {
                            return (
                                <td key = {`head-col-idx-${idx}`} className="sheet-head">
                                    {getColIdx(idx)}
                                </td>
                            )
                        })
                    }
                    </tr>
                }
                {props.children}
            </tbody>
        </table>
    )
}

export default SpreadSheet;