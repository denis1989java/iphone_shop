import React, {Component} from 'react';
import DropdownInput from 'react-dropdown';
import request from 'superagent';
import './css/App.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            email:"",
            password:"",
            errorVisible:false,
            errorMessage:""
        }
        this.handleForUpdate = this.props.handleForUpdate;
        this.email = this.email.bind(this);
        this.password = this.password.bind(this);
        this.login = this.login.bind(this);
    }

    render() {
        return (
            <div>{
                this.state.visible ? null :
                    <a className="loginRefer" onClick={() => this.onClick()}>Log in</a>
            }
                {
                    this.state.visible
                        ? <div className="loginForm clearfix">
                        <div className="loginCloser">
                            <a onClick={() => this.onClick()} className="close"></a>
                        </div>
                        <div className="logindiv clearfix">
                            <div className="formform">
                                <div onChange={this.email} className="emailForm"><label htmlFor="email">Email:</label>
                                    <input id="email"/></div>
                                <div onChange={this.password} className="passwordForm"><label htmlFor="">Password:</label>
                                    <input id="password"/></div>

                                {
                                    this.state.errorVisible ?
                                        <div className="loginError">
                                            <p>{this.state.errorMessage}</p>
                                        </div> : null
                                }
                            </div>

                            <button onClick={this.login} className="loginButton">Login</button>



                        </div>
                    </div>
                        : null
                }
            </div>

        )
    }

    email(e){
        this.setState({email:e.target.value})
    }

    password(e){
        this.setState({password:e.target.value})
    }

    login(){
        request.post('http://localhost:80/login')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({username:this.state.email,password:this.state.password})
            .then(res => {
                let message=JSON.parse(res.text).message;
                if(message==="success"){
                     this.handleForUpdate();
                }else{
                    this.setState({errorMessage:message,
                    errorVisible:true})
                }

            })};

    onClick() {
        this.setState(prevState => ({visible: !prevState.visible}));
    }
}

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
            request.post('http://localhost:80/orders')
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(order))
                .then(res => {
                    console.log(res);
                    this.congrats();
                })
        }
    }
}

class Orders extends Component{
    constructor(props){
        super(props);
        this.state = {
            orders: []
        };
        this.handleForUpdate = this.props.handleForUpdate;
    }

    componentDidMount() {
        fetch('http://localhost:80/admin/orders', {
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
                    this.setState({orders:result.adminOrders})
                },
                (error) => {

                }
            );

    }
    render() {
        let  orders1 = this.state.orders.map((order)=> {
            return (
                <tr key={order.id} >
                    <td >{order.adminCardNumber+"*"}</td>
                    <td>{order.phone.name}</td>
                    <td>{order.priceUSD}</td>
                    <td>{order.currency+": "+order.priceUserCurrency}</td>
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
    logout(){
        request.get('http://localhost:80/logout')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .then(res => {

                let message=JSON.parse(res.text).message;
                console.log(message)
                if(message==="success logout"){
                    this.handleForUpdate();
                }
            })
    }

}

class Phones extends Component {
    constructor() {
        super();
        this.state = {
            phonesState: [],
            curentPhoneId: "",
            visibleCongrats:false
        };
        this.onClickHandler = this.onClickHandler.bind(this);
        this.congrats = this.congrats.bind(this);
    }

    congrats(){
        this.setState({visibleCongrats:true,
            curentPhoneId:""})
    }

    onClickHandler (e) {
        this.setState({curentPhoneId:e.target.id,
        visibleOrder:true})
    };

    componentDidMount() {
        request
            .get('http://localhost:80/phones')
            .then(res => {
                console.log( JSON.parse(res.text));
                this.setState({phonesState:JSON.parse(res.text).phones});
            });
    }
    render() {
        let  phones = this.state.phonesState.map((item)=> {
            return (
                <div key={item.id} className={this.state.curentPhoneId == item.id ? "phoneActive" : "phone"}>
                    <img onClick={this.onClickHandler} id={item.id} src={require('./images/' + item.picture + '.jpg')}/>
                    <p>{item.name}</p>
                    <p>{item.price}</p>
                </div>

            )
        })
        var congrats =   this.congrats;
        let secondPart="";
        if(this.state.curentPhoneId!==""){
            secondPart=this.state.phonesState.map((item) => {
                if(this.state.curentPhoneId==item.id){
                    return (
                        <div key={item.id}>
                            <Order  congrats = {congrats.bind(this)}  phone={item}/>
                        </div>
                    )
                }
            })
        }else{
            if(this.state.visibleCongrats){
                secondPart=<Congrats/>
            }
        }

        return (
            <div>
            <div  className='phones'>
                {phones}

            </div>
                {secondPart}
            </div>
        );
    }
}

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

class App extends Component {

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


export default App;
