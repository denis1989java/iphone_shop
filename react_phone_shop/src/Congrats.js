/**
 * Created by dmonich on 15.02.2018.
 */

import React, {Component} from 'react';
import './css/Congrats.css';

class Congrats extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="congrat">
                <h1>Thank you for your purchase</h1>
                <p>The order is being prepared</p>
            </div>


        );
    }

}
export default Congrats;