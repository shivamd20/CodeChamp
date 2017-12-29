import React, {Component} from 'react';
import './Time.css';
import AccessTime from 'material-ui-icons/AccessTime';

class Time extends Component{
    render(){

        return <div className="Time"><AccessTime color="red"/> : 00:29 mins </div>;
    }
}

export default Time;