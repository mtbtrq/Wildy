import { React } from "react";
import { Link } from "react-router-dom";

const Tutorial = () => {
    return(
        <>
            <video controls autoPlay>
                <source src="https://private.up.railway.app/i/tutorial" type="video/ogg"/>
            </video>

            <Link to="/"><p>Back To Home</p></Link>
        </>
    );
};

export default Tutorial;