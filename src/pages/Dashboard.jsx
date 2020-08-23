import React, { Component } from 'react'
import { Doughnut, Bar, Pie } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { history } from '../history'
import { loadBoard, } from '../store/actions/boardActions';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';

const bgColors =
    [
        '#273d5d',
        '#C492B1',
        '#00ca78',
        '#a8eb12',

        '#ee6352',
        '#DA4167',
        '#ffb5d7',
        '#72709e',

        '#F6AE2D',
        '#C9E3AC',
        '#9580b0',
        '#b991bf',
        '#dda2cc',


    ];
const hovColors =
    [

        '#273d5dc2',
        '#C492B1c2',
        '#00ca78c2',
        '#a8eb12c2',

        '#ee6352c2',
        '#DA4167c2',
        '#ffb5d7c2',
        '#72709ec2',

        '#F6AE2Dc2',
        '#C9E3ACc2',
        '#9580b0c2',
        '#b991bfc2',
        '#dda2ccc2',

    ];


class _Dashboard extends Component {


    componentDidMount() {
        this.getBoardById();
    }

    getBoardById = async () => {
        const id = this.props.match.params.id;
        await this.props.loadBoard(id);
    }

    getSprintProgress = () => {

        const { board } = this.props;
        var getSprintProgressMap = {};
        board.phaseLists.forEach(phase => {
            phase.cards.forEach(card => {
                card.checkList.forEach(checkListItem => {
                    if (checkListItem.isDone) {
                        (!getSprintProgressMap["Completed"]) ? getSprintProgressMap["Completed"] = 1 : getSprintProgressMap["Completed"] += 1;
                    } else {
                        (!getSprintProgressMap["In Progress"]) ? getSprintProgressMap["In Progress"] = 1 : getSprintProgressMap["In Progress"] += 1;
                    }
                })
            })
        });

        return {

            labels: [
                //the labels are the keys of the object map,E.g 'Educational, Funny..'
                ...Object.keys(getSprintProgressMap)
            ],
            datasets: [{
                label: "Sprint Progress",
                data: [...Object.values(getSprintProgressMap)],
                backgroundColor: bgColors,
                hoverBackgroundColor: hovColors

            }]
        };
    }

    getTaskPerPhaseDistribution = () => {
        const { board } = this.props;
        var phaseTaskMap = {};
        board.phaseLists.forEach(phase => {
            phase.cards.forEach(card => {

                (!phaseTaskMap[phase.name]) ? phaseTaskMap[phase.name] = 1 : phaseTaskMap[phase.name] += 1;

            })
        });

        return {

            labels: [

                ...Object.keys(phaseTaskMap)
            ],
            datasets: [{
                label: "Tasks Per Phase Distribution",
                data: [...Object.values(phaseTaskMap)],
                backgroundColor: bgColors,
                hoverBackgroundColor: hovColors

            }]
        };
    }
    getTaskByLables = () => {
        const { board } = this.props;
        var devTaskMap = {};
        board.phaseLists.forEach(phase => {
            phase.cards.forEach(card => {
                card.labels.forEach(label => {
                    (!devTaskMap[label.txt]) ? devTaskMap[label.txt] = 1 : devTaskMap[label.txt] += 1;
                })
            })
        });

        return {

            labels: [
                //the labels are the keys of the object map,E.g 'Educational, Funny..'
                ...Object.keys(devTaskMap)
            ],
            datasets: [{
                label: "Tasks by Label",
                data: [...Object.values(devTaskMap)],
                backgroundColor: bgColors,
                hoverBackgroundColor: hovColors

            }]
        };
    }

    getTasksPerDevloperData() {

        const { board } = this.props;
        var devTaskMap = {};
        board.phaseLists.forEach(phase => {
            phase.cards.forEach(card => {
                card.assignedTo.forEach(member => {
                    (!devTaskMap[member.fullName]) ? devTaskMap[member.fullName] = 1 : devTaskMap[member.fullName] += 1;
                })
            })
        });

        return {

            labels: [
                //the labels are the keys of the object map,E.g 'Educational, Funny..'
                ...Object.keys(devTaskMap)
            ],
            datasets: [{
                label: "Tasks Per Developer",
                data: [...Object.values(devTaskMap)],
                backgroundColor: bgColors,
                hoverBackgroundColor: hovColors

            }]
        };

    }

    goBack = () => {
        history.push(`/board/${this.props.match.params.id}`);
    }

    render() {
        if (!this.props.board) return 'loading';
        const tPerDevloper = this.getTasksPerDevloperData();
        const taskPerPhaseDistribution = this.getTaskPerPhaseDistribution();
        const tasksByLabels = this.getTaskByLables()
        const sprintProgress = this.getSprintProgress();
        return (

            <div className="dashboard grow">
                <div className="btn-back flex space-between align-center" onClick={this.goBack} >
                    <ArrowBackIosOutlinedIcon />
                    <span>Back</span>
                </div>
                <section className="chart-cont flex column justify-center align-center">
                    <article className="chart sprint-progress flex justify-center column align-center">
                        <h2>Sprint Progress</h2>
                        <Pie className="chart-stats" data={sprintProgress} options={{
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }} />
                    </article>

                    <article className="chart tasks-per-devloper flex column justify-center align-center">
                        <h2>Tasks Per Developer</h2>
                        <Bar className="chart-stats" data={tPerDevloper} options={{
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }} />
                    </article>
                    <article className="chart tasks-per-phase flex column justify-center align-center">
                        <h2>Tasks Per Phase</h2>
                        <Doughnut className="chart-stats" data={taskPerPhaseDistribution} options={{
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }} />
                    </article>

                    <article className="chart tasks-by-lables flex column justify-center align-center">
                        <h2>Tasks By Label</h2>
                        <Bar className="chart-stats" data={tasksByLabels} options={{
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }} />
                    </article>
                </section>
            </div>



        )
    }
}
const mapStateToProps = (state) => {
    return {
        board: state.trelloApp.board
    }
}

const mapDispatchToProps = {
    loadBoard
}

export const Dashboard = connect(mapStateToProps, mapDispatchToProps)(_Dashboard)
