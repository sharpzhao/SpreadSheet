import _ from 'lodash';


const average= (...param) => _.mean(param);

const max = (...param) => _.max(param);

const min = (...param) => _.min(param);



export default {
    AVERAGE: average,
    MAX: max,
    MIN: min
}