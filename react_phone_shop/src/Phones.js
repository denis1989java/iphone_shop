/**
 * Created by dmonich on 15.02.2018.
 */
import React, {Component} from 'react';
import request from 'superagent';
import './css/Phones.css';
import Congrats from './Congrats';
import Order from './Order';


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
            .get('/phones')
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
export default Phones;