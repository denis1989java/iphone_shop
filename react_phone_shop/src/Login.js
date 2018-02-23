/**
 * Created by dmonich on 15.02.2018.
 */
import React, {Component} from 'react';
import request from 'superagent';
import './css/Login.css';

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
                        <div>
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
        request.post('/login')
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
export default Login;