import React, { Component } from 'react';
import localHost from '../../LittleComponents/LocalHost';
import '../../../css/Style.css';
import './styleMessagesStudent.css'
import Footer from '../../LittleComponents/Footer';
import NavBar from '../../LittleComponents/NavBar';
import $ from 'jquery';
import ProjectContext from '../../../Context/ProjectContext';
import { TiArrowBack } from 'react-icons/ti';
import CCStudentOneMessage from './CCStudentOneMessage';
import { Textbox, Radiobox, Checkbox, Select, Textarea } from 'react-inputs-validation';
import { MdSend } from 'react-icons/md';

export default class CCStudentChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messagesArr: [],
            messageText: "",
            newMessage: "",
            sendDisabled: '',
        }
        let local = true;
        this.apiUrl = 'http://localhost:' + { localHost }.localHost + '/api/Message';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/igroup2/prod' + '/api/Message';
        }
    }

    static contextType = ProjectContext;

    componentDidMount() {
        this.getMessages();
        this.changeAllMessageToRead();
        setInterval(this.getMessages, 5000);//כל 5 שניות בודק אם יש הודעות חדשות
    }

    getMessages = () => {
        const user = this.context;
        fetch(this.apiUrl + '?teacherID= ' + user.teacherID + '&studentID=' + user.studentID
            , {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                })
            })
            .then(res => {
                console.log('res=', res);
                console.log('res.status', res.status);
                console.log('res.ok', res.ok);
                return res.json();
            })
            .then(
                (result) => {
                    console.log("messagesArr= ", result);
                    this.setState({ messagesArr: result });
                },
                (error) => {
                    console.log("err get=", error);
                });
    }

    changeAllMessageToRead = () => {
        const user = this.context;
        fetch(this.apiUrl + '?studentID=' + user.studentID, {
            method: 'PUT',
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                console.log('res=', res);
                return res.json()
            })
            .then(
                (result) => {
                    console.log("fetch PUT= ", result);
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    sendMessage = () => {
        const user = this.context;
        const date = new Date();

        const message = {
            teacherID: user.teacherID,
            studentID: user.studentID,
            messageTitle: "",
            messageText: this.state.messageText,
            messageDate: date.toISOString().split('T')[0],
            messageTime: date.getHours() + ":" + date.getMinutes(),
            messageByTeacher: false,
        }

        fetch(this.apiUrl, {
            method: 'POST',
            body: JSON.stringify(message),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                console.log('res=', res);
                return res.json()
            })
            .then(
                (result) => {
                    console.log("fetch POST= ", result);
                    this.getMessages();
                },
                (error) => {
                    console.log("err post=", error);
                });
    }
    clickSend = () => {

        const reg = /^[\s]+$/
        if (!(reg.test(this.state.messageText) || this.state.messageText == "")) {
            this.sendMessage();
            this.setState({ messageText: "" });
        }
    }
    render() {
        const messageText = this.state.messageText;
        return (
            <div className="container-fluid studentPage">

                <div className="row upChat"> {/* חזור למסך הקודם */}
                    <TiArrowBack className="iconArrowBack" onClick={() => window.history.back()} size={40} />
                    <p className="returnHomePageP"> חזור למסך הבית </p>
                </div>
                <div className='messagesDiv'>
                    {this.state.messagesArr.slice(0).reverse().map((item) =>
                        <CCStudentOneMessage message={item} key={item.messageID} />
                    )}
                </div>

                <div className="input-group mb-3 mp0 sendMesInputDiv">
                    <div className="input-group-prepend mp0">
                        <button className="input-group-text sendBackGround" id='send' onClick={this.clickSend}><MdSend className="MdSend" color='rgb(163,233,255)' /></button>
                    </div>
                    <input type="text" className="form-control inputNewTeacher" id='messageText' placeholder='כתוב הודעה'
                        value={messageText} onChange={(e) => {
                            this.setState({ messageText: e.target.value });
                        }}
                    />

                </div>



            </div>
        );
    };
}


