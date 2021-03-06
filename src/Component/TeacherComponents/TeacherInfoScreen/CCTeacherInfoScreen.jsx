import React, { Component } from 'react';
import '../../../css/Style.css';
import './styleTeacherInfoScreen.css'
import Footer from '../../LittleComponents/Footer';
import Logo from '../../LittleComponents/Logo';
import $ from 'jquery';
import NavBar from '../../LittleComponents/NavBar';
import localHost from '../../LittleComponents/LocalHost';
import ProjectContext from '../../../Context/ProjectContext';
import { Textbox, Radiobox, Checkbox, Select, Textarea } from 'react-inputs-validation';
import Swal from 'sweetalert2';
import FreeSoloGroupedInst from '../../LittleComponents/FreeSoloGroupedInst';

export default class CCTeacherInfoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teacher: {},
            firstName: "",
            lastName: "",
            mail: "",
            username: "",
            phone: "",
            password: "",
            password2: "",
            institutionID: "",
            institution: {},
            HasfirstNameValError: false,
            HaslastNameValError: false,
            HasuserNameValError: false,
            HasmailValError: false,
            HasphoneValError: false,
            HaspasswordValError: false,
            Haspassword2ValError: false,
            HasschoolValError: false,
            showPassword2: false,
            institutionsArr: []
        }

        let local = false;
        this.apiUrl = 'http://localhost:' + { localHost }.localHost + '/api/Teacher';
        this.apiUrlInstitution = 'http://localhost:' + { localHost }.localHost + '/api/Institution';
        if (!local) {
            this.apiUrl = 'https://proj.ruppin.ac.il/igroup2/prod' + '/api/Teacher';
            this.apiUrlInstitution = 'https://proj.ruppin.ac.il/igroup2/prod' + '/api/Institution';
        }
    }

    static contextType = ProjectContext;

    componentDidMount () {

        this.getInstitutions();
        //  this.getInPlace(user,institutionArr);

    }

    getInstitutions = () => {
        const user = this.context;

        fetch(this.apiUrlInstitution
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
                if (!res.ok)
                    throw new Error('Network response was not ok.');
                return res.json();
            })
            .then(
                (result) => {
                    console.log(result);
                    this.setState({ institutionsArr: result  }, this.getInPlace)
                    
                    
                },
                (error) => {
                    console.log("err get=", error);
                    //תוקן
                    Swal.fire({
                        title: 'משהו השתבש',
                        text: 'טעינת רשימת מוסדות הלימוד, אנא נסה להכנס לעמוד מחדש',
                        icon: 'warning',
                        confirmButtonColor: '#e0819a',
                    })
                })
    }

    getInPlace = () => {
        const user = this.context;
        fetch(this.apiUrl + '?teacherID=' + user.teacherID
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
                if (!res.ok)
                    throw new Error('Network response was not ok.');
                return res.json();
            })
            .then(
                (result) => {
                    console.log("teacher= ", result);
                    this.setState({ teacher: result[0] });
                },
                (error) => {
                    console.log("err get=", error);
                    //תוקן
                    Swal.fire({
                        title: 'משהו השתבש',
                        text: 'פרטייך לא נטענו כראוי, אנא נסה להכנס לדף זה שוב',
                        icon: 'warning',
                        confirmButtonColor: '#e0819a',
                    })
                })
            .then(() => {
                this.setState({
                    firstName: this.state.teacher.firstName,
                    lastName: this.state.teacher.lastName,
                    userName: this.state.teacher.userName,
                    mail: this.state.teacher.mail,
                    phone: this.state.teacher.phone,
                    password: this.state.teacher.password,
                    password2: this.state.teacher.password,
                    institutionID: this.state.teacher.institutionID,
                    institution: this.state.institutionsArr.filter(item => item.institutionID == this.state.teacher.institutionID)[0]
                })

            });
    }

    UpdateDetails = (event) => {
        console.log(this.state);
        const user = this.context;
        event.preventDefault();

        const { HasphoneValError, HasfirstNameValError, HaslastNameValError, HasmailValError, HaspasswordValError,
            Haspassword2ValError, HasschoolValError, HasuserNameValError } = this.state

        if (!HasphoneValError && !HasfirstNameValError && !HaslastNameValError && !HasmailValError && !HaspasswordValError
            && !Haspassword2ValError && !HasschoolValError && !HasuserNameValError) {

            var updatedDetails = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                userName: this.state.userName,
                mail: this.state.mail,
                phone: this.state.phone,
                password: this.state.password,
                institutionID: this.state.institutionID,
                teacherID: user.teacherID
            }
            fetch(this.apiUrl, {
                method: 'PUT',
                body: JSON.stringify(updatedDetails),
                headers: new Headers({
                    'Content-type': 'application/json; charset=UTF-8'
                })
            })
                .then(res => {
                    console.log('res=', res);
                    if (!res.ok)
                        throw new Error('Network response was not ok.');
                    return res.json();
                })
                .then(
                    (result) => {
                        console.log("fetch PUT= ", result);
                        //תוקן
                        Swal.fire({
                            title: 'מעולה!',
                            text: 'הפרטים שונו בהצלחה!',
                            icon: 'success',
                            confirmButtonColor: '#e0819a',
                        });
                        this.props.history.push('/HomePageTeacher');
                    },
                    (error) => {
                        console.log("err PUT=", error);
                        //תוקן
                        Swal.fire({
                            title: 'משהו השתבש',
                            text: 'הפרטים לא שונו, אנא נסה שנית',
                            icon: 'warning',
                            confirmButtonColor: '#e0819a',
                        })
                    });
        }
    }

    btnClick = () => {
        const user = this.context;
        //תוקן
        Swal.fire({
            title: 'אתה בטוח!',
            text: 'אתה בטוח שאתה רוצה לבטל את השינויים?',
            icon: 'warning',
            confirmButtonColor: '#e0819a',
        }).then(() => {
            this.getInPlace(user);
            $(".react-inputs-validation__msg_identifier").empty();
        })
    }

    checkIfUserNameExist = (e) => {
        var usernameNewTeacher = e.target.value;
        console.log("usernameNewTeacher "+usernameNewTeacher)
        $('#userNameValuesError').empty();

        // לעשות פונקציה בשרת שבודקת ומחזירה 0 או 1
        fetch(this.apiUrl + '?usernameNewTeacher=' + usernameNewTeacher
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
                if (!res.ok)
                    throw new Error('Network response was not ok.');
                return res.json();
            })
            .then(
                (result) => {
                    console.log('result=', result);
                    console.log("this.state.teacher.userName", this.state.teacher.userName)
                    if (result == 1) { // כבר קיים השם משתמש הזה
                        if (usernameNewTeacher == this.state.teacher.userName || this.state.teacher.userName ==undefined)
                            return;
                        else {
                            this.setState({ HasuserNameValError: true });
                            $('#userNameValuesError').empty();
                            $('#userNameValuesError').append("שם המשתמש קיים במערכת");
                        }
                    }
                },
                (error) => {
                    console.log("err get=", error);
                    //תוקן
                    // Swal.fire({
                    //     title: 'משהו השתבש',
                    //     text: 'הפעולה נכשלה, נסה שנית',
                    //     icon: 'warning',
                    //     confirmButtonColor: '#e0819a',
                    // })
                });
    }

    checkIfPhoneExist = (e) => {
        const user = this.context;
        var phone = parseInt(e.target.value);
        $('#PhoneValuesError').empty();

        // פונקציה בשרת שבודקת אם יש מורה ששמור לו הטלפון הזה, אם כן מחזירה את המספר המזהה שלו, אם לא מחזירה 0
        fetch(this.apiUrl + '?phone=0' + phone
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
                if (!res.ok)
                    throw new Error('Network response was not ok.');
                return res.json();
            })
            .then(
                (result) => {
                    if (result != 0 && result != user.teacherID) { // כבר קיים מספר הטלפון הזה
                        this.setState({ HasphoneValError: true });
                        $('#PhoneValuesError').empty();
                        $('#PhoneValuesError').append("מספר הטלפון כבר קיים במערכת");
                    }
                },
                (error) => {
                    console.log("err get=", error);
                    //תוקן
                    // Swal.fire({
                    //     title: 'משהו השתבש',
                    //     text: 'הפעולה נכשלה, נסה שנית',
                    //     icon: 'warning',
                    //     confirmButtonColor: '#e0819a',
                    // })
                });
    }

    onChangeInst = (event, value) => {
        this.setState({
            institutionID: value != null ? value.institutionID : null,
            HasschoolValError: value != null ? false : true,
            institution: value
        });
        if (value == null) {
            $('#schoolValuesError').empty();
            $('#schoolValuesError').append("יש לבחור מוסד לימוד מהרשימה");
        }
    }

    render() {
        const {
            firstName,
            lastName,
            userName,
            mail,
            phone,
            password,
            password2,
            institutionID,
        } = this.state;
        return (
            <div className="container-fluid">
                <div className="loginDiv1">
                    <NavBar />
                    <form onSubmit={this.UpdateDetails} dir="rtl">
                        <div className="myInformation">הפרטים שלי</div>

                        <div className="form-group col-12">
                            <Textbox  // כדי שיפעלו הולידציות שמים את האינפוט בטקסט בוקס
                                attributesInput={{
                                    id: 'UpdateTFirstName',
                                    type: 'text',
                                    placeholder: 'שם פרטי',
                                    className: "form-control inputUpdateTeacher"
                                }}
                                value={firstName}
                                validationCallback={(res) => { this.setState({ HasfirstNameValError: res }) }
                                }
                                onChange={(firstName, e) => { //כל שינוי הוא שומר בסטייט
                                    this.setState({ firstName });
                                    console.log(e);
                                }}
                                onBlur={(e) => { console.log(e) }} // Optional.[Func].Default: none. In order to validate the value on blur, you MUST provide a function, even if it is an empty function. Missing this, the validation on blur will not work.
                                validationOption={{
                                    check: true, // Optional.[Bool].Default: true. To determin if you need to validate.
                                    required: true, // Optional.[Bool].Default: true. To determin if it is a required field.
                                    msgOnError: "חובה להזין שם פרטי",
                                    customFunc: async v => {
                                        if (v.length < 2) {
                                            this.setState({ HasfirstNameValError: true });
                                            return "השם צריך להיות בעל 2 אותיות ומעלה";
                                        }
                                        this.setState({ HasfirstNameValError: false });
                                        return true;
                                    }
                                }}
                            />
                        </div>

                        <div className="form-group col-12">
                            <Textbox  // כדי שיפעלו הולידציות שמים את האינפוט בטקסט בוקס
                                attributesInput={{
                                    id: 'UpdateTLastName',
                                    type: 'text',
                                    placeholder: 'שם משפחה',
                                    className: "form-control inputUpdateTeacher",
                                }}
                                value={lastName}
                                validationCallback={res =>
                                    this.setState({ HaslastNameValError: res, validate: false })
                                }
                                onChange={(lastName, e) => { //כל שינוי הוא שומר בסטייט
                                    this.setState({ lastName });
                                    console.log(e);
                                }}
                                onBlur={(e) => { console.log(e) }} // Optional.[Func].Default: none. In order to validate the value on blur, you MUST provide a function, even if it is an empty function. Missing this, the validation on blur will not work.
                                validationOption={{
                                    check: true, // Optional.[Bool].Default: true. To determin if you need to validate.
                                    required: true, // Optional.[Bool].Default: true. To determin if it is a required field.
                                    msgOnError: "חובה להזין שם משפחה",
                                    customFunc: async v => {
                                        if (v.length < 2) {
                                            this.setState({ HaslastNameValError: true });
                                            return "שם המשפחה צריך להיות בעל 2 אותיות ומעלה";
                                        }
                                        this.setState({ HaslastNameValError: false });
                                        return true;
                                    }
                                }}
                            />
                        </div>

                        <div className="form-group col-12">
                            <Textbox  // כדי שיפעלו הולידציות שמים את האינפוט בטקסט בוקס
                                attributesInput={{
                                    id: 'UpdateTUserName',
                                    type: 'text',
                                    placeholder: 'שם משתמש',
                                    className: "form-control inputUpdateTeacher"
                                }}
                                value={userName}
                                validationCallback={res =>
                                    this.setState({ HasuserNameValError: res, validate: false })
                                }
                                onChange={(userName, e) => { //כל שינוי הוא שומר בסטייט
                                    this.setState({ userName });
                                    console.log(e);
                                }}
                                onBlur={(e) => {
                                    console.log(e)
                                    this.checkIfUserNameExist(e)
                                }} // Optional.[Func].Default: none. In order to validate the value on blur, you MUST provide a function, even if it is an empty function. Missing this, the validation on blur will not work.
                                validationOption={{
                                    check: true, // Optional.[Bool].Default: true. To determin if you need to validate.
                                    required: true, // Optional.[Bool].Default: true. To determin if it is a required field.
                                    msgOnError: "חובה להזין שם משתמש",
                                }}
                            />
                        </div>
                        <div className='errorInputuserName' id="userNameValuesError"></div>

                        <div className="form-group col-12">
                            <Textbox  // כדי שיפעלו הולידציות שמים את האינפוט בטקסט בוקס
                                attributesInput={{
                                    id: 'UpdateTMail',
                                    type: 'mail',
                                    placeholder: 'כתובת מייל',
                                    className: "form-control inputUpdateTeacher"
                                }}
                                value={mail}
                                validationCallback={res =>
                                    this.setState({ HasmailValError: res, validate: false })
                                }
                                onChange={(mail, e) => { //כל שינוי הוא שומר בסטייט
                                    this.setState({ mail });
                                    console.log(e);
                                }}
                                onBlur={(e) => { console.log(e) }} // Optional.[Func].Default: none. In order to validate the value on blur, you MUST provide a function, even if it is an empty function. Missing this, the validation on blur will not work.
                                validationOption={{
                                    check: true, // Optional.[Bool].Default: true. To determin if you need to validate.
                                    required: true, // Optional.[Bool].Default: true. To determin if it is a required field.
                                    msgOnError: "חובה להזין כתובת מייל",
                                    customFunc: mail => {
                                        const reg1 = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                        if (reg1.test(String(mail).toLowerCase())) {
                                            this.setState({ HasmailValError: false });
                                            return true;
                                        } else {
                                            this.setState({ HasmailValError: true });
                                            return "אנא הכנס כתובת מייל תקינה";
                                        }
                                    }
                                }}
                            />

                        </div>

                        <div className="form-group col-12">
                            <Textbox  // כדי שיפעלו הולידציות שמים את האינפוט בטקסט בוקס
                                attributesInput={{
                                    id: 'UpdateTPhone',
                                    type: 'text',
                                    placeholder: 'פלאפון',
                                    className: "form-control inputUpdateTeacher"
                                }}
                                value={phone}
                                validationCallback={res =>
                                    this.setState({ HasphoneValError: res })
                                }
                                onChange={(phone, e) => { //כל שינוי הוא שומר בסטייט
                                    this.setState({ phone });
                                    console.log(e);
                                }}
                                onBlur={(e) => {
                                    console.log(e);
                                    this.checkIfPhoneExist(e);
                                }} // Optional.[Func].Default: none. In order to validate the value on blur, you MUST provide a function, even if it is an empty function. Missing this, the validation on blur will not work.
                                validationOption={{
                                    check: true, // Optional.[Bool].Default: true. To determin if you need to validate.
                                    required: true, // Optional.[Bool].Default: true. To determin if it is a required field.
                                    msgOnError: "חובה להזין מספר פלאפון",
                                    customFunc: phoneNum => {
                                        const reg = /^0\d([\d]{0,1})([-]{0,1})\d{8}$/;
                                        if (reg.test(phoneNum)) {
                                            this.setState({ HasphoneValError: false });
                                            return true;
                                        } else {
                                            this.setState({ HasphoneValError: true });
                                            return "אנא הכנס מספר פלאפון תקין";
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className='errorInputuserName' id="PhoneValuesError"></div>

                        <div className="form-group col-12">
                            <Textbox  // כדי שיפעלו הולידציות שמים את האינפוט בטקסט בוקס
                                attributesInput={{
                                    id: 'UpdateTPassword',
                                    type: 'password',
                                    placeholder: 'הזן סיסמה',
                                    className: "form-control inputUpdateTeacher"
                                }}
                                value={password}
                                validationCallback={res =>
                                    this.setState({ HaspasswordValError: res, validate: false })
                                }
                                onChange={(password, e) => { //כל שינוי הוא שומר בסטייט
                                    this.setState({ password });
                                    console.log(e);
                                }}
                                onBlur={(e) => { console.log(e) }} // Optional.[Func].Default: none. In order to validate the value on blur, you MUST provide a function, even if it is an empty function. Missing this, the validation on blur will not work.
                                validationOption={{
                                    check: true, // Optional.[Bool].Default: true. To determin if you need to validate.
                                    required: true, // Optional.[Bool].Default: true. To determin if it is a required field.
                                    msgOnError: "חובה להזין סיסמה",
                                    customFunc: pas => { //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number:
                                        const reg = /^(?=.*[A-Za-z])(?=.*\d)([@$!%*#?&]*)[A-Za-z\d@$!%*#?&]{8,}$/;
                                        if (reg.test(pas)) {
                                            this.setState({ HaspasswordValError: false });
                                            return true;
                                        }
                                        else {
                                            this.setState({ HaspasswordValError: true });
                                            return "אנא הזן לפחות 8 תווים שמכילים אותיות באנגלית ומספרים";
                                        }
                                    }
                                }}
                            />
                        </div>


                        <div className="form-group col-12">
                            <Textbox  // כדי שיפעלו הולידציות שמים את האינפוט בטקסט בוקס
                                attributesInput={{
                                    id: 'UpdateTPassword2',
                                    type: 'password',
                                    placeholder: 'הזן ססמה בשנית',
                                    className: "form-control inputUpdateTeacher"
                                }}
                                value={password2}
                                validationCallback={res =>
                                    this.setState({ Haspassword2ValError: res, validate: false })
                                }
                                onChange={(password2, e) => { //כל שינוי הוא שומר בסטייט
                                    this.setState({ password2 });
                                    console.log(e);
                                }}
                                onBlur={(e) => { console.log(e) }} // Optional.[Func].Default: none. In order to validate the value on blur, you MUST provide a function, even if it is an empty function. Missing this, the validation on blur will not work.
                                validationOption={{
                                    check: true, // Optional.[Bool].Default: true. To determin if you need to validate.
                                    required: true, // Optional.[Bool].Default: true. To determin if it is a required field.
                                    msgOnError: "חובה להזין סיסמה בשנית",
                                    customFunc: pas => { //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number:
                                        const reg = /^(?=.*[A-Za-z])(?=.*\d)([@$!%*#?&]*)[A-Za-z\d@$!%*#?&]{8,}$/;
                                        if (reg.test(pas)) {
                                            if (password2 == password) {
                                                this.setState({ Haspassword2ValError: false });
                                                return true;
                                            }
                                            else {
                                                this.setState({ Haspassword2ValError: true });
                                                return "הסיסמה לא זהה לסיסמה הראשונה";
                                            }
                                        }
                                        else {
                                            this.setState({ Haspassword2ValError: true });
                                            return "אנא הזן לפחות 8 תווים שמכילים אותיות באנגלית ומספרים";
                                        }
                                    }
                                }}
                            />
                        </div>
                        {/* 
                        <div className="form-group col-12">
                            <Textbox  // כדי שיפעלו הולידציות שמים את האינפוט בטקסט בוקס
                                attributesInput={{
                                    id: 'UpdateTSchool',
                                    type: 'text',
                                    placeholder: 'מוסד לימודים שהינך מלמד בו',
                                    className: "form-control inputUpdateTeacher"
                                }}

                                value={school}
                                validationCallback={res =>
                                    this.setState({ HasschoolValError: res, validate: false })
                                }
                                onChange={(school, e) => { //כל שינוי הוא שומר בסטייט
                                    this.setState({ school });
                                    console.log(e);
                                }}
                                onBlur={(e) => { console.log(e) }} // Optional.[Func].Default: none. In order to validate the value on blur, you MUST provide a function, even if it is an empty function. Missing this, the validation on blur will not work.
                                validationOption={{
                                    check: true, // Optional.[Bool].Default: true. To determin if you need to validate.
                                    required: true, // Optional.[Bool].Default: true. To determin if it is a required field.
                                    customFunc: async v => {
                                        if (v === "") {
                                            this.setState({ HasschoolValError: true });
                                            return "School Name is required.";
                                        }
                                        if (v.length < 2) {
                                            this.setState({ HasschoolValError: true });
                                            return "School Name needs at least 2 length.";
                                        }
                                        this.setState({ HasschoolValError: false });
                                        return true;
                                    }
                                }}
                            />
                        </div> */}
                        <div className="form-group col-12" dir="rtl">
                            <FreeSoloGroupedInst
                                value={this.state.institution}
                                options={this.state.institutionsArr.sort(function (a, b) {
                                    if (a.institutionName < b.institutionName) return -1;
                                    if (b.institutionName > a.institutionName) return 1;
                                    return 0;
                                })}
                                onChange={this.onChangeInst}
                                label='מוסד לימודים'
                                id='institutions' />
                        </div>

                        <div className="col-12 mp0 justify-content-around" >
                            <button type="submit" id="save" className="btn btn-info col-8 btnPink"  >עדכן פרטים</button>
                            <button type="button" id="cancel" className="btn btn-info col-3 btnPink cencelBtn" onClick={this.btnClick} >בטל</button>
                        </div>
                        <div className='errorInputuserName' id="schoolValuesError"></div>

                    </form>
                </div>
            </div>
        );
    };
}