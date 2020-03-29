import React, { Component } from 'react';
import localHost from '../../LittleComponents/LocalHost';
import { Textbox, Radiobox, Checkbox, Select, Textarea } from 'react-inputs-validation';
import '../../../css/Style.css';
import './styleStudentInfoScreen.css'
import Footer from '../../LittleComponents/Footer';
import Logo from '../../LittleComponents/Logo'
import ProjectContext from '../../../Context/ProjectContext';

class StudentInfoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: {},
            classesArr: []
        }
        let local = true;
        this.apiUrl = 'http://localhost:' + { localHost }.localHost + '/api/Student';
        if (!local) {
            this.apiUrl = 'http://proj.ruppin.ac.il/igroup2/??????'; //להשלים!!
        }
    }

    static contextType = ProjectContext;

    componentDidMount = () => {
        fetch(this.apiUrl + '?studentID=' + this.props.match.params.studentID
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
                    console.log("Student Data= ", result[0]);
                    this.setState({ student: result[0] });
                },
                (error) => {
                    console.log("err get=", error);
                });

        const user = this.context;
        console.log("teacherID from context = " + user.teacherID);

        fetch('http://localhost:' + { localHost }.localHost + '/api/Class?teacherID=' + user.teacherID,
            {
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
                    console.log("classesArr= ", result);
                    this.setState({ classesArr: result })
                },
                (error) => {
                    console.log("err get=", error);
                });
    }


    Submit = (event) => {
        console.log('state=' + this.state);

        var data = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            userName: this.state.userName,
            phone: this.state.phone,
            password: this.state.password,
            school: this.state.school
        }
        console.log('data=' + data);
        fetch(this.apiUrl, {
            method: 'POST',
            body: JSON.stringify(data),
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

                },
                (error) => {
                    console.log("err post=", error);
                });
        // .then(
        //     this.props.history.push({
        //         pathname: '/TeacherLogin',
        //     }) );

        event.preventDefault();
    }

    render() {

        console.log("studentID = " + this.props.match.params.studentID);

        return (
            <div className="container-fluid">


                <div className="loginDiv">

                    <Logo></Logo>

                    <form onSubmit={this.Submit}>
                        <div className="form-group col-12">

                            <input type="text" className="form-control inputNewTeacher" id="NewTFirstName" placeholder="שם פרטי" pattern="[א-ת]+" required
                                onChange={(e) => this.setState({ firstName: e.target.value })} />
                        </div>
                        <div className="form-group col-12">
                            <input type="text" className="form-control inputNewTeacher" id="NewTLastName" placeholder="שם משפחה" pattern="[א-ת]+" required
                                onChange={(e) => this.setState({ lastName: e.target.value })} />
                        </div>
                        <div className="form-group col-12">
                            <input type="text" className="form-control inputNewTeacher" id="NewTUserName" placeholder="שם משתמש" required
                                onChange={(e) => this.setState({ userName: e.target.value })} />
                        </div>

                        <div className="form-group col-12">
                            <input type="phone" className="form-control inputNewTeacher" id="NewTPhone" placeholder="פלאפון" pattern="[0][5][0-9]{8}$" required
                                onChange={(e) => this.setState({ phone: e.target.value })} />
                        </div>
                        <div className="form-group col-12">
                            <input type="password" className="form-control inputNewTeacher" id="NewTPassword" placeholder="הזן סיסמה" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required
                                onChange={(e) => this.setState({ password: e.target.value })} />
                        </div>
                        {/* Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters   */}
                        <div className="form-group col-12">
                            <input type="password" className="form-control inputNewTeacher" id="NewTPassword2" placeholder="הזן סיסמה בשנית" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required></input>
                        </div>
                        <div className="col-12">
                            <button type="submit" id="submit" className="btn btn-info btnYellow">שמירה</button>
                        </div>
                    </form>
                </div>
                <Footer></Footer>
            </div>
        );
    }
}

export default StudentInfoScreen;