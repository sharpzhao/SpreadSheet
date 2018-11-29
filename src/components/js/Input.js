import React, {Component} from 'react';

class Input extends Component {
    componentDidMount() {
        this._input.focus();
    }

    render() {
        const {value, onKeyDown, onChange} = this.props;
        return (
            <input
                ref = { input => this._input = input }
                className = "input-editor"
                value = {value}
                onKeyDown = {onKeyDown}
                onChange = {e => onChange(e.target.value)} 
            >
            </input>
        )
    }
}

export default Input;