import React, { Component } from 'react';
import '../../../css/Style.css';
import Footer from '../../LittleComponents/Footer';
import NavBar from '../../LittleComponents/NavBar';
import { Textbox, Radiobox, Checkbox, Select, Textarea } from 'react-inputs-validation';
import localHost from '../../LittleComponents/LocalHost';
import Swal from 'sweetalert2';
import { TiArrowBack } from 'react-icons/ti';
import FreeSoloTags from '../../LittleComponents/FreeSoloTags';
import FreeSolo from '../../LittleComponents/FreeSolo';
import $ from 'jquery';
import { IoIosReturnLeft } from 'react-icons/io';
import CCOneSearchChallenge from './CCOneSearchChallenge';

class CCSearchChallenge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            challengesArr: [],
            tagsArr: [],
            filteredChallenges: [],
            filteredChallengesByName: []
        }
        let local = false;
        this.apiUrl = 'http://localhost:' + { localHost }.localHost + '/api/Challenge';
        this.apiUrlTags = 'http://localhost:' + { localHost }.localHost + '/api/Tag';
        this.apiUrlChallengeTags = 'http://localhost:' + { localHost }.localHost + '/api/ChallengeTag';
        if (!local) {
            this.apiUrl = 'https://proj.ruppin.ac.il/igroup2/prod' + '/api/Challenge';
            this.apiUrlTags = 'https://proj.ruppin.ac.il/igroup2/prod' + '/api/Tag';
            this.apiUrlChallengeTags = 'https://proj.ruppin.ac.il/igroup2/prod' + '/api/ChallengeTag';
        }
    }

    componentDidMount() {
        this.getChallenges();
        this.getTags();

    }

    getChallenges = () => {
        fetch(this.apiUrl + "?studentID=" + this.props.location.state.studentID
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
                    console.log("challengesArr= ", result);
                    this.setState({ challengesArr: result });
                },
                (error) => {
                    console.log("err get=", error);
                    //תוקן
                    Swal.fire({
                        title: 'משהו השתבש',
                        text: 'לא מוצא אתגרים אנא נסה לטעון את הדף מחדש',
                        icon: 'warning',
                        confirmButtonColor: '#e0819a',
                    })
                });
    }

    getTags = () => {
        fetch(this.apiUrlTags
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
                    console.log("tagsArr= ", result);
                    this.setState({ tagsArr: result });
                },
                (error) => {
                    console.log("err get=", error);
                    //תוקן
                    Swal.fire({
                        title: 'משהו השתבש',
                        text: 'לא מוצא תגיות, אנא נסה לטעון מחדש את הדף',
                        icon: 'warning',
                        confirmButtonColor: '#e0819a',
                    })
                });
    }

    onInputChange = (event, value) => {
        if (value == "") {         //אם אין אינפוט אז ירוקן את הסטייט
            this.setState({ filteredChallengesByName: [] });
            return;
        }
        console.log(value);
        var temp = this.state.challengesArr.filter((item) => item.challengeName.includes(value));
        console.log(temp);
        this.setState({ filteredChallengesByName: temp });
    }

    onTagsChange = (event, values) => {
        if (values.length == 0) {         //אם אין תגיות או שמחקו את כולן אז ירוקן את הסטייט
            this.setState({ filteredChallenges: [] });
            return;
        }
        //יצירת מערך רק של המספרים המזהים של התגיות
        var tagsID = values.map(value => value.tagID);
        // פקודת גט שמקבלת את מערך המספרים המזהים של התגיות ומחזירה את כל האתגרים שקשורים אליהן
        fetch(this.apiUrlChallengeTags + "?SrtTagsID=" + tagsID
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
                    console.log("tagsArr= ", result);
                    this.setState({ filteredChallenges: result });
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

    GoToExtraDetailPage = (challenge) => {
        this.props.history.push({
            pathname: '/ExtraChallengeDetails',
            state: {
                challenge: challenge,
                studentID: this.props.location.state.studentID
            }
        })
    }

    render() {
        return (
            <div className="container-fluid">
                <NavBar />
                <div className="col-12"> {/* חזור למסך הקודם */}
                    <TiArrowBack className="iconArrowBack" onClick={() => window.history.back()} size={40} />
                </div>
                <div className="col-12 turkiz">חיפוש אתגר מהמאגר</div>
                <br />
                <form onSubmit={this.Submit}>
                    <div className="form-group col-12 bc" dir="rtl">
                        <FreeSolo
                            options={this.state.challengesArr.map((option) => option.challengeName)}
                            onInputChange={this.onInputChange}
                            label='שם האתגר'
                            id='NewChallengeName' />
                    </div>
                    <div>
                        <div className="form-group input-group col-12 bc" dir="rtl">
                            <FreeSoloTags tags={this.state.tagsArr} onTagsChange={this.onTagsChange} />
                        </div>

                    </div>
                </form>
                {this.state.filteredChallengesByName.length != 0 &&
                    <div className="col-12 turkiz">תוצאת חיפוש לפי שם</div>
                }
                <div className="col-12 DivAllNameSearch">
                    {
                        this.state.filteredChallengesByName.map((item) =>
                            <CCOneSearchChallenge challenge={item} key={item.challengeID} studentID={this.props.location.state.studentID} GoToExtraDetailPage={this.GoToExtraDetailPage} />
                        )}

                </div>
                {this.state.filteredChallenges.length != 0 &&

                    <div className="col-12 turkiz">תוצאות חיפוש לפי תגיות</div>
                }
                <div className="col-12 DivAllTagsSearch">
                    {/* get from server ChallengeID and put it instead of key when going to CConeSmartElementOffer */}
                    {
                        this.state.filteredChallenges.map((item) =>
                            <CCOneSearchChallenge challenge={item} key={item.challengeID} studentID={this.props.location.state.studentID} GoToExtraDetailPage={this.GoToExtraDetailPage} />
                        )}

                </div>
            </div>
        );
    }
}

export default CCSearchChallenge;