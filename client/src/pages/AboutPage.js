import axios from 'axios';
import React, { Component } from 'react'
import {
    Jumbotron,
    Button,
    Container,
    Row,
    Col,
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Modal, ModalBody, ModalHeader
} from 'reactstrap';
import { connect } from 'react-redux';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import ChatPanel from '../components/ChatPanel';
import {Link} from 'react-router-dom'
import LostPet from'../components/LostPet'
import aboutfetch from '../images/aboutfetch.png'

var ipapi = require('ipapi.co');
const Geo = require('geo-nearby');

const mainStyle = {
    position: "relative",
    marginTop:'40px',
    padding: "3rem"
}

const divStyle = {
    width: 250,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    marginTop: "3.5rem",
    marginLeft: "3.5rem",
    padding: "10px",
    textAlign: "center"
}

const containerStyle = {
    // width: 1050, /* Can be in percentage also. */

}

const imageStyle = {
    height: "8rem"
}

const buttonStyle = {
    border: "None",
    borderRadius: "20px",
    background: "white",
    color: "black",
    float: 'right'
}


const dpStyle = {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    alignSelf: 'flex-start',
}

const spanStyle = {
    float: "right",
    marginTop: "-1.5rem"
}

class DisplayLostPet extends Component {
       
    onClick = (e) => {
        if (this.props.lostpet.user_type == 'ngo') {
            const body = {
                'user_id': JSON.parse(window.localStorage.getItem('user')).id,
                'user_name': JSON.parse(window.localStorage.getItem('user')).name
            }

            axios.post(`/api/lostpet/ngo/notify/${this.props.lostpet.user_id}`, body)
        }

        else {
            const body = {
                'user_id': JSON.parse(window.localStorage.getItem('user')).id,
                'user_name': JSON.parse(window.localStorage.getItem('user')).name
            }
            axios.post(`/api/lostpet/notify/${this.props.lostpet.user_id}`, body)
        }
    }
    render() {
        return (
            <div style={divStyle}>
                <div style={{ display: 'flex' }}>
                    {this.props.lostpet.user_type=='ngo'?<a href={'http://localhost:5000/api/users/image/ngo/' + this.props.lostpet.user_id}>
                        <img src={'api/users/image/ngo/' + this.props.lostpet.user_id} style={dpStyle}></img>
                    </a> : <a href={'http://localhost:5000/api/users/image/' + this.props.lostpet.user_id}>
                        <img src={'api/users/image/' + this.props.lostpet.user_id} style={dpStyle}></img>
                    </a>}
                    <div style={{ marginLeft: '5px', marginTop: '15px' }}>
                        <a className='linkhover' href={`/profile/${this.props.lostpet.user_type}/${this.props.lostpet.user_id}`}><h6>{this.props.lostpet.user_name}</h6></a>
                    </div>
                </div>
                <div style={{ marginTop: '5px', marginBottom: '5px' }}>

                    <a href={'http://localhost:5000/api/post/image/' + this.props.files[0].filename}>
                        <CardImg top style={{ height: "200px", width: '200px', objectFit: 'cover' }} src={'api/post/image/' + this.props.files[0].filename} />
                    </a>
                         </div>           
                    <CardTitle tag="h5">{this.props.lostpet.breed}</CardTitle>
                    <CardSubtitle >
                    Location: {`${this.props.lostpet.location.city}, ${this.props.lostpet.location.region}`}<br></br>
                    Last Seen: {this.props.lostpet.lastseen}</CardSubtitle>
                <CardBody className="myColumn1" style={{height:'100px', overflowY:'auto', overflowX:'hidden'}}>
                    <CardText style={{ color: '#77c3e7' }}>{this.props.lostpet.description}</CardText>
                </CardBody>
                <Link to={`/chat/${this.props.lostpet.user_id}`}>
                <Button className="foundBtn" onClick={this.onClick}>Found</Button>
                </Link>
                
            </div>
            // </div>
        )
    }
}


export class LostPetPage extends Component {

    state = {
        LostPets: [],
        files: [],
        location: {},
        radius: 100000,
        LostPetsInitial: []
    }



    componentDidMount() {

        ipapi.location(loc => {
            this.setState({location: loc})
            // console.log(this.state.location)
        })
        axios.get('api/lostpet')
            .then((res) => {
                this.setState({ LostPetsInitial: res.data.items, files: res.data.files })
                // console.log(this.state.LostPetsInitial)
                const data = []
                var i=0
                while(i<this.state.LostPetsInitial.length) {
                    data.push([this.state.LostPetsInitial[i].location.latitude, this.state.LostPetsInitial[i].location.longitude, this.state.LostPetsInitial[i]._id])
                    i++
                }
                
                const dataSet = Geo.createCompactSet(data);
                const geo = new Geo(dataSet, { sorted: true });
                // console.log(geo)
                // console.log(this.state.radius)
                var p = geo.nearBy(this.state.location.latitude, this.state.location.longitude, this.state.radius);
                console.log(p)

                var temp = []
                var ind = 0
                while(ind<p.length) {
                    // console.log(p[ind].i)
                    temp.push(this.state.LostPetsInitial.find(x => x._id == p[ind].i))
                    ind++
                }
                
                this.setState({LostPets: temp})
                console.log(this.state.LostPets)
            });

    }

    handleChange = (e) => {
        console.log(e.target.value)
        var y = parseInt(e.target.value)*1000
        if(y == 0) {
            // console.log("idhr")
            this.setState({LostPets: this.state.LostPetsInitial})
            return
        }
        if(this.state.LostPetsInitial.length == 0)
        return
        // console.log(this.state.LostPetsInitial)
        const data = []
        var i=0
        while(i<this.state.LostPetsInitial.length) {
            data.push([this.state.LostPetsInitial[i].location.latitude, this.state.LostPetsInitial[i].location.longitude, this.state.LostPetsInitial[i]._id])
            i++
        }
        // console.log(this.state.LostPetsInitial)
            // console.log(data)    
        const dataSet = Geo.createCompactSet(data);
        const geo = new Geo(dataSet, { sorted: true });
        // console.log(geo)
        // console.log(this.state.radius)
        var p = geo.nearBy(this.state.location.latitude, this.state.location.longitude, y);
        // console.log(p)

        var temp = []
        var ind = 0
        while(ind<p.length) {
                    //console.log(p[ind].i)
            temp.push(this.state.LostPetsInitial.find(x => x._id == p[ind].i))
            ind++
        }

        this.setState({LostPets: temp})
        // this.LostPets = temp
        // console.log(this.LostPets)

    }

    render() {

        return (
            <Container>
                <div className='container' style={mainStyle}>
                    <div style={{ height: "auto", margin: "0 auto", padding: 50, position: "relative", background: "white", }}>
                    {/* <Row>
                        
                    </Row> */}
                       

                        {/* <span style={spanStyle}>
                            {/* <Link to="/allitems" className='link'>All Toys </Link>| 
                    <Link to="/stuffedanimals" className='link'> Stuffed Animals </Link>| 
                    <Link to="/woodentoys" className='link'> Wooden Toys </Link> */}
                        {/* </span><hr /> */} 
                        <img src={aboutfetch} style={{width: 1000}} />
                        <Row>
                           </Row></div>
                </div>
            </Container>
        )
    }
}

export default connect()(LostPetPage)