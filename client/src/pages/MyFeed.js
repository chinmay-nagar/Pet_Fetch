import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import FeedPost from '../components/FeedPost'
import NewPost from '../components/NewPost'
import {
    Container, Row, Col, Jumbotron,
    Button,
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Modal, ModalBody
} from 'reactstrap'
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import ChatPanel from '../components/ChatPanel';


const mainStyle = {
    position: "relative",
    padding: "3rem"
}

const JumbotronStyle = {
    background: "F5F5F5",
    marginTop: "3.5rem",
    marginLeft: "5rem",
    width: "12rem",
    borderRadius: "20px",
    padding: "10px",
    textAlign: "center"
};

const divStyle = {
    width: 230,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    // marginTop: "2rem",
    // marginLeft: "3.5rem",
    padding: "10px",
    textAlign: "center",
    backgroundColor: 'white'
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
    height: "8rem",
    width: "8rem"
}
const dpStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: 'flex-start',
}
const buttonStyle = {
    border: "None",
    borderRadius: "20px",
    background: "white",
    color: "black",
    float: 'right'
}


const spanStyle = {
    float: "right",
    marginTop: "-1.5rem"
}


export class MyFeed extends Component {
    state = {
        posts: [],
        files: [],
        Donations: [],
        filesDonations: [],
        LostPets: [],
        fileslostpets: [],
        id:''
    }

    componentDidMount = () => {
        console.log(this.props.user_id)
       
        console.log(this.props.user_id)
        axios.get(`../api/post/${this.props.user_id}`)
            .then(res => {
                console.log(res)
                this.setState({ posts: res.data.items, files: res.data.files })
            })
    }
    render() {
        return (
            <Container style={{ justifyContent: 'center', alignItems: 'center', marginLeft: '90px', marginTop:'100px' }}>
                <div /*style={{marginLeft: -90}}*/>
                    {this.state.posts.map((post, i) => {
                        var files = this.state.files.filter((f) => post.files.includes(f._id))
                        // console.log(files)
                        return (<div>
                            <FeedPost post={post} files={files} key={i} viewer='me' width='550px' words='480' />
                        </div>)
                    })}
                </div>
            </Container>

        )
    }
}
export default connect()(MyFeed)