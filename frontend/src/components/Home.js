import React from 'react';
import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <h1>Chat Application</h1>

            <p className="normalText">Not the perfect means of communication, but it works :)</p>

            <p className="normalText">Report bugs and suggestions on discord (I know, ironic) Mutyyab.#4275</p>

            <p className="normalText">To continue, perform any of the actions below.</p>

            <Link to="/signup"><button id="button">Sign Up</button></Link>
            <Link to="/signin"><button id="button">Sign In</button></Link>
        </div>
    );
};

export default Home;