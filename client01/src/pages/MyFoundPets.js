import axios from 'axios';
import React, { Component } from 'react'
import {
    Jumbotron,
    Button,
    Container,
    Row,
    Col,
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle
} from 'reactstrap';
import { connect } from 'react-redux';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import FoundPet from '../components/FoundPet'

const mainStyle = {
    position: "relative",
    marginTop: '40px',
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
    width: 1050, /* Can be in percentage also. */
    height: "auto",
    margin: "0 auto",
    padding: 50,
    position: "relative",
    background: "white"
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

class DisplayFoundPet extends Component {
    
    onClick = (e) => {
        // console.log(this.props.lostpet._id)
        axios.delete(`../api/lostpet/${this.props.lostpet._id}`)
        .then(window.location.reload())
    }
    render() {
        return (
            <div style={divStyle}>
                <div style={{ display: 'flex' }}>
                    {this.props.lostpet.user_type == 'ngo' ? <a href={'http://localhost:5000/api/users/image/ngo/' + this.props.lostpet.user_id}>
                        <img src={'../api/users/image/ngo/' + this.props.lostpet.user_id} style={dpStyle}></img>
                    </a> : <a href={'http://localhost:5000/api/users/image/' + this.props.lostpet.user_id}>
                        <img src={'../api/users/image/' + this.props.lostpet.user_id} style={dpStyle}></img>
                    </a>}
                    <div style={{ marginLeft: '5px', marginTop: '15px' }}>
                        <a style={{}} href=""><h6>{this.props.lostpet.user_name}</h6></a>
                    </div>
                </div>
                <div style={{ marginTop: '5px', marginBottom: '5px' }}>

                    <a href={'http://localhost:5000/api/post/image/' + this.props.files[0].filename}>
                        <CardImg top width="50" src={'../api/post/image/' + this.props.files[0].filename} />
                    </a>
                </div>
                <CardTitle tag="h5">{this.props.lostpet.breed}</CardTitle>
                <CardSubtitle >
                    Location: {`${this.props.lostpet.location.city}, ${this.props.lostpet.location.region}`}<br></br>
                    Found On: {this.props.lostpet.lastseen}</CardSubtitle>
                <CardBody className="myColumn1" style={{ height: '100px', overflowY: 'auto', overflowX: 'hidden' }}>
                    <CardText style={{ color: '#1A5C6D' , lineHeight:'18px' }}>{this.props.lostpet.description}</CardText>
                </CardBody>
                <Button onClick={this.onClick}className="deleteBtn">Delete</Button></div>
            // </div>
        )
    }
}


export class MyFoundPetPage extends Component {

    state = {
        LostPets: [],
        files: [],
    }

    componentDidMount() {
        axios.get(`../api/lostpet/found/${this.props.user_id}`)
            .then((res) => {
                this.setState({ LostPets: res.data.items, files: res.data.files })
            });

    }

    render() {

        return (
            <div className='container' style={mainStyle}>
                <div style={containerStyle}>
                    <i class="fa fa-file-text-o fa-lg" aria-hidden="true" style={{ float: "left", marginTop: 4 }}></i><h5 style={{ fontFamily: "muli" }}> &nbsp; &nbsp;Pets You Found</h5>
                    
                    <span style={spanStyle}>
                        {/* <Link to="/allitems" className='link'>All Toys </Link>| 
                    <Link to="/stuffedanimals" className='link'> Stuffed Animals </Link>| 
                    <Link to="/woodentoys" className='link'> Wooden Toys </Link> */}
                    </span><hr />

                    <Row>
                        {
                            this.state.LostPets.map((lostpet, i) => {
                                var files = this.state.files.filter((f) => lostpet.files.includes(f._id))
                                return (<div>
                                    {
                                        <DisplayFoundPet lostpet={lostpet} files={files} key={i} />
                                    }
                                </div>)
                            })
                        }</Row></div>
            </div>
        )
    }
}

export default connect()(MyFoundPetPage)