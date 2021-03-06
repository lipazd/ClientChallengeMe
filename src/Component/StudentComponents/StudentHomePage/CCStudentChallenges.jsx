import React, { Component } from 'react';
import '../../../css/Style.css';
import ProjectContext from '../../../Context/ProjectContext';
import CCOneStudentChallenges from './CCOneStudentChallenges';
import localHost from '../../LittleComponents/LocalHost';
import Swal from 'sweetalert2';


export default class CCStudentChallenges extends Component {

    constructor(props) {
        super(props);
        this.state = {
            StudentChallenges: [],
        };
        let local = false;
        this.apiUrl = 'http://localhost:' + { localHost }.localHost + '/api/StudentChallenge';
        if (!local) {
            this.apiUrl = 'https://proj.ruppin.ac.il/igroup2/prod' + '/api/StudentChallenge';
        }
    }

    static contextType = ProjectContext;

    componentDidMount() {
        const user = this.context;
        fetch(this.apiUrl + '?studentID=' + user.studentID
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
                    console.log("Student Challenges= ", result);
                    this.setState({ StudentChallenges: result });
                },
                (error) => {
                    console.log("err get=", error);
                    //תוקן
                    Swal.fire({
                        title: 'משהו השתבש',
                        text: 'לא הצלחנו לטעון את האתגרים, אנא נסו להכנס שוב לאפליקציה',
                        icon: 'warning',
                        confirmButtonColor: '#e0819a',
                    })
                });
    }

    render() {
        const user = this.context;

        return (
            <div >

                <div className="col-12 btnMassagesReadText">:האתגרים שלי</div>
                <div className="challengeShowStudents">
                    {this.state.StudentChallenges.map((item, key) =>
                        <CCOneStudentChallenges countChallenges={this.state.StudentChallenges.length} challenge={item} index={key} key={key} goToChallengePage={this.props.goToChallengePage} />
                    )}
                </div>
            </div>
        )
    };
}

