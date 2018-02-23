import React, {Component} from 'react';
import Login from './Login';
import Phones from './Phones';
import Orders from './Orders';


class IphoneShop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewOrders: false
        };
        this.handleForUpdate = this.handleForUpdate.bind(this);

    }



    handleForUpdate(){
        this.setState(prevState => ({viewOrders: !prevState.viewOrders}))
    }

    render() {
        var handleForUpdate =   this.handleForUpdate;
        return (

            <div>
            {
                    this.state.viewOrders ?
                    <div> <Orders  handleForUpdate = {handleForUpdate.bind(this)}/></div> :
                    <div>   <Login  handleForUpdate = {handleForUpdate.bind(this)}/>
                        <Phones/></div>
                }
            </div>


        );
    }


}
export default IphoneShop;
