import React, { Component } from 'react'
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import PropTypes from 'prop-types'
import FlashMessage from 'react-flash-message'
import { connect } from 'react-redux'
import { login, loginngo } from '../actions/authAction'
import { Link } from 'react-router-dom'


import logo from '../images/logo_fetch.jpeg'

const InputStyle = {
    borderStyle: "solid", borderWidth: 1, borderColor: "rgba(0,0,0,0.1)", backgroundColor: "white", opacity: '80%', color: 'black'
}

const divStyle = {
    padding: 15, marginTop: '1%', borderRadius: '20px', borderStyle: "solid", borderWidth: 1, borderColor: "rgba(0,0,0,0.1)", backgroundColor: "rgba(255, 255, 255,0.8)"
}

const btnStyle = {
    opacity: '90%', borderRadius: '25px', height: '40px', width: '100px', padding: '0px'
}

const centerStyle = {
    display: 'flex', alignContent: 'center', justifyContent: 'center'
}

export class Login extends Component {
    state = {
        userform: false, ngoform: false, showform: false,
        password: null, email: null, flag: 0
    }


    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    userLogin = (e) => {
        e.preventDefault()
        const { email, password } = this.state
        // console.log(username, email, password)
        if(!email || !password) {
            this.setState({flag:1})
            return
        }
        this.props.login({ email, password })
        setTimeout(
            () => this.setState({ flag: 2 }), 
            2000
          )
      
    }

    ngoLogin = (e) => {
        e.preventDefault()
        const { email, password } = this.state
        // console.log(username, email, password)
        if(!email || !password) {
            this.setState({flag:1})
            return
        }
        this.props.loginngo({ email, password })
        setTimeout(
            () => this.setState({ flag: 2 }), 
            1000
          )
    }

    render() {
        return (
            <Container style={{
                alignSelf: 'center',
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Row>
                    <Col>
                    </Col>
                    <Col>
                        <div style={centerStyle}>
                            <img src={logo} style={{ height: 110, marginTop: '2%' }}></img><br></br>

                        </div>
                        {!this.state.showForm ?
                            <div>
                                <div style={centerStyle}>
                                    <Button onClick={() => this.setState({ showForm: true, userForm: true })} className='register' >
                                        Login As General User</Button>
                                </div>
                                <div style={centerStyle}>
                                    <Button onClick={() => this.setState({ showForm: true, ngoForm: true })} className='register' >Login As Animal Shelter</Button>
                                </div>
                                <br></br>
                                <div style={centerStyle} >
                                    <Link to='/register' style={{ color:'#f4ca31f7'}}>Don't have an account? Sign up!</Link>
                                </div>
                            </div>
                            : null}
                        {this.state.userForm ? <div style={divStyle}>
                            <Form onSubmit={this.onSubmit}>
                                {this.state.flag==1? <FlashMessage duration={5000}><strong style={{color: 'red'}}>Please fill all fields</strong></FlashMessage> : null}
                                {this.state.flag==2? <FlashMessage duration={5000}><strong style={{color: 'red'}}>Login failed</strong></FlashMessage> : null}
                                <FormGroup>
                                    <Label for="email">Email</Label>
                                    <Input onChange={this.onChange} style={InputStyle} type="email" name="email" id="email" placeholder="jdoe@gmail.com" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="password">Password</Label>
                                    <Input onChange={this.onChange} style={InputStyle} type="password" name="password" id="password" placeholder="********" />
                                </FormGroup>
                                <Row style={{ alignContent: 'center', justifyContent: 'center' }}>
                                    <Button className='register' style={btnStyle} onClick={this.userLogin}>Login</Button>
                                </Row>
                            </Form>
                        </div> : this.state.ngoForm ? <div style={divStyle}>
                            <Form  style={{padding:'10px'}}onSubmit={this.onSubmit} >
                                {this.state.flag==1? <FlashMessage duration={5000}><strong style={{color: 'red'}}>Please fill all fields</strong></FlashMessage> : null}
                                {this.state.flag==2? <FlashMessage duration={5000}><strong style={{color: 'red'}}>Login failed</strong></FlashMessage> : null}
                                <Row>
                                        <FormGroup>
                                            <Label for="email">Email</Label>
                                            <Input onChange={this.onChange} style={InputStyle} type="email" name="email" id="email" placeholder="jdoe@gmail.com" />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="password">Password</Label>
                                            <Input onChange={this.onChange} style={InputStyle} type="password" name="password" id="password" placeholder="********" />
                                        </FormGroup>
                                </Row>
                                <Row style={{ alignContent: 'center', justifyContent: 'center' }}>

                                    <Button className='register' style={btnStyle} onClick={this.ngoLogin}>Login</Button>

                                </Row>
                            </Form>
                        </div> : null}
                    </Col>
                    <Col>
                    </Col>
                </Row>

            </Container>

        )
    }
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    loginngo: PropTypes.func.isRequired,
}

export default connect(null, { login, loginngo })(Login)