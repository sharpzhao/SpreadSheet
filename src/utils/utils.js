import _ from 'lodash';

export const getColIdx = idx => {
    let ret = "";
    while (idx !== 0) {
        ret += String.fromCharCode((idx - 1) % 26 + "A".charCodeAt(0));
        idx = Math.floor((idx - 1) / 26);
    }

    return [...ret].reverse().join("");
}

const getRange = (start, end) => {
    const s = getPosition(start.trim());
    const e = getPosition(end.trim());

    const arr = [];
    _.range(s.y, e.y + 1).forEach( x => _.range(s.x, e.x + 1).forEach( y => arr.push(getColIdx(x) + y)));

    return arr.join(",");
}

const get26BaseNumber = str => {
    let ret = 0;
    [...str].forEach( c => ret = ret * 26 + (c.charCodeAt(0) - 'A'.charCodeAt(0) + 1));
    return ret;
}

const getPosition = str => {
    const d = str.search(/\d/);

    const x = _.toNumber(str.substring(d));
    const y = get26BaseNumber(str.substring(0, d)); 
    return { x: x, y: y };
}

export const replaceRange = expr => {
    let idx = -1;
    let p = 0;
    let res = [];

    while ((idx = expr.indexOf(":", p)) !== -1) {
        // get prev key;
        let start = "";
        let end = "";
        let s = 0;
        let e = 0;
        for (let i = idx - 1; i >= p; i --) {
            const c = expr.charAt(i);
            if (('0' <= c && '9' >= c) || ('A' <= c && 'Z' >= c) || ' ' === c) continue;

            start = expr.substring(i + 1, idx);
            s = i + 1;
            break;
        }

        for (let i = idx + 1; i <= expr.length; i ++) {
            const c = expr.charAt(i);
            if (('0' <= c && '9' >= c) || ('A' <= c && 'Z' >= c) || ' ' === c) continue;

            end = expr.substring(idx + 1, i);
            e = i;
            break;
        }

        res = [...res, ...expr.slice(p, s), ...getRange(start, end)];
        p = e;
    }

    return [...res, ...expr.slice(p, expr.length)].join("");
}