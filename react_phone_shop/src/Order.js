/**
 * Created by dmonich on 15.02.2018.
 */

import React, {Component} from 'react';
import DropdownInput from 'react-dropdown';
import request from 'superagent';
import './css/Order.css';

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullrates: {},
            rates1: [],
            curRate: "",
            summ: this.props.phone.price,
            userEmail:"",
            cardNumber:"",
            cardHolder:"",
            cvv:"",
            emailErrorVisability:false,
            emailErrorMessage:"",
            cardNumberErrorVisability:false,
            cardNumberErrorMessage:"",
            cardHolderErrorVisability:false,
            cardHolderErrorMessage:"",
            cvvErrorVisability:false,
            cvvErrorMessage:"",
            phoneId:this.props.phone.id
        };
        this.change = this.change.bind(this);
        this.userEmail = this.userEmail.bind(this);
        this.cardNumber = this.cardNumber.bind(this);
        this.cardHolder = this.cardHolder.bind(this);
        this.cvv = this.cvv.bind(this);
        this.doOrder = this.doOrder.bind(this);
        this.congrats = this.props.congrats;
    }

    componentDidMount() {

        request
            .get('http://localhost:3000/nodeapi/v1/currency')
            .then(res =>{
                const rates1 = Object.keys(JSON.parse(res.text).rates);
                rates1.push("USD");
                this.setState({fullrates:JSON.parse(res.text).rates,rates1:rates1});
            });

    }

    change(e) {
        if(e.value==="USD"){
            this.setState({
                summ: this.props.phone.price,
                curRate: e.value
            });
        }else{
            const summ = parseFloat(this.state.fullrates[e.value])*parseFloat(this.props.phone.price);
            this.setState({
                summ: summ,
                curRate: e.value
            });
        }
    }

    render() {
        const rates = this.state.rates1;
        let emailErrorMessage=this.state.emailErrorMessage;
        let cardNumberErrormessage=this.state.cardNumberErrorMessage;
        let cardHolderErrorMessage=this.state.cardHolderErrorMessage;
        let cvvErrorMessage=this.state.cvvErrorMessage;
        return (
            <div>
                <div className="orderForm">
                    <div className="orderFormDiv"><label>Email:</label>
                        <input onChange={this.userEmail} className="orderInput"/>
                        {
                            this.state.emailErrorVisability ?
                                <p className="errors">{emailErrorMessage}</p> :
                                null
                        }
                    </div>
                    <div className="orderFormDiv"><label>Card number:</label>
                        <input onChange={this.cardNumber} className="orderInput"/>
                        {
                            this.state.cardNumberErrorVisability ?
                                <p className="errors">{cardNumberErrormessage}</p> :
                                null
                        }</div>
                    <div className="orderFormDiv"><label>Holder:</label>
                        <input onChange={this.cardHolder} className="orderInput"/>
                        {
                            this.state.cardHolderErrorVisability ?
                                <p className="errors">{cardHolderErrorMessage}</p> :
                                null
                        }
                    </div>
                    <div className="orderFormDiv"><label>CVV code:</label>
                        <input onChange={this.cvv} className="cvv"/>
                        {
                            this.state.cvvErrorVisability ?
                                <p className="errors">{cvvErrorMessage}</p> :
                                null
                        }
                    </div>
                    <div className="orderFormDiv"><label>Your currency:</label>
                        <DropdownInput onChange={this.change}
                                       options={rates}
                                       defaultValue='USD'
                                       className='dropdown-input'
                                       value={this.state.curRate}
                                       placeholder='USD &#9207;'
                        /></div>
                    <div className="orderFormDiv"><label>Total summ:</label>
                        <p className="summ">{this.state.summ}</p></div>
                    <div className="orderbut">
                        <button onClick={this.doOrder}>Order</button>
                    </div>

                </div>
            </div>

        )
    }

    userEmail(e){
        this.setState({userEmail:e.target.value})
    }
    cardNumber(e){
        this.setState({cardNumber:e.target.value})
    }
    cardHolder(e){
        this.setState({cardHolder:e.target.value})
    }
    cvv(e){
        this.setState({cvv:e.target.value})
    }

    doOrder() {
        let order={};
        let rightOrder=true;
        let EMAIL_REGEX=/^(.+)@(.+)$/;
        let CARD_NUMBER_REGEX=/^\d{13,16}$/;
        let CARD_HOLDER_REGEX=/^[a-zA-Z'][a-zA-Z-' ]+[a-zA-Z']?$/;
        let CVV_REGEX=/^\d{2,3}$/;
        if(EMAIL_REGEX.test(this.state.userEmail)){
            order.email=this.state.userEmail;
        }else{
            this.setState({emailErrorVisability:true,emailErrorMessage:"Wrong email! Should be like: denis1989@bk.ru"})
            rightOrder=false;
        }
        if(CARD_NUMBER_REGEX.test(this.state.cardNumber)){
            order.cardNumber=this.state.cardNumber;
            order.adminCardNumber="";
            for (let i=0;i<4;i++){
                order.adminCardNumber= order.adminCardNumber+ order.cardNumber[i];
            }
        }else{
            this.setState({cardNumberErrorVisability:true,cardNumberErrorMessage:"Wrong card number! Should be 13-16 numbers"})
            rightOrder=false;
        }
        if(CARD_HOLDER_REGEX.test(this.state.cardHolder)){
            order.cardHolder=this.state.cardHolder;
        }else{
            this.setState({cardHolderErrorVisability:true,cardHolderErrorMessage:"Wrong card holder! Should be like: Denis Monich"})
            rightOrder=false;
        }

        if(CVV_REGEX.test(this.state.cvv)){
            order.cvv=this.state.cvv;
        }else{
            this.setState({cvvErrorVisability:true,cvvErrorMessage:"Wrong card cvv! Should be 3-4 numbers"})
            rightOrder=false;
        }
        if(this.state.curRate===""){
            order.currency="USD"
        }else{
            order.currency=this.state.curRate;
        }
        order.phone={};
        order.phone.id=this.state.phoneId;
        console.log(order)
        if(rightOrder){
            request.post('/orders')
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(order))
                .then(res => {
                    console.log(res);
                    this.congrats();
                })
        }
    }
}
export default Order;