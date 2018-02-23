/**
 * Created by dmonich on 15.02.2018.
 */

import React, {Component} from 'react';
import request from 'superagent';
import './css/Orders.css';

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: []
        };
        this.handleForUpdate = this.props.handleForUpdate;
    }

    componentDidMount() {
        fetch('/admin/orders', {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache': 'no-cache'
            },
            credentials: 'include'
        }).then(res => res.json())
            .then(
                (result) => {
                    console.log(result.adminOrders);
                    this.setState({orders: result.adminOrders})
                },
                (error) => {

                }
            );

    }

    render() {
        let orders1 = this.state.orders.map((order) => {
            return (
                <tr key={order.id}>
                    <td >{order.adminCardNumber + "*"}</td>
                    <td>{order.phone.name}</td>
                    <td>{order.priceUSD}</td>
                    <td>{order.currency + ": " + order.priceUserCurrency}</td>
                </tr>
            )
        })
        return (
            <div>
                <a className="logoutRefer" onClick={() => this.logout()}>Log out</a>
                <table className="orderTable">
                    <tr>
                        <th>Card</th>
                        <th>Product</th>
                        <th>Price in USD</th>
                        <th>Price in *</th>
                    </tr>
                    {orders1}
                </table>
            </div>
        )
    }

    logout() {
        request.get('/logout')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .then(res => {

                let message = JSON.parse(res.text).message;
                console.log(message)
                if (message === "success logout") {
                    this.handleForUpdate();
                }
            })
    }

}

export default Orders;
