import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Home.css';

function Home() {
    return (
        <div>
            <button className="loginButton">
                <Link to="./Login">LOGIN</Link>
            </button>
        </div>
    );
}

export default Home;
