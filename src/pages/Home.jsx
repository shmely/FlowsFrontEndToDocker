import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';



class _Home extends Component {
    render() {
        return (
            <main className="home-container flex">
                <div className="text-area flex column align-start">
                    <h1>Don't Waste Papers</h1>
                    <h3><span className="logo">Flowz</span>
                     the project managment software that keep teams going and Collaborate</h3>

                    <Link to="/board/5ecbc8edcb39d7f5494f8d40"> <span className="btn-home">Get Started</span></Link>
                </div>


            </main >
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export const Home = connect(mapStateToProps, mapDispatchToProps)(_Home);
