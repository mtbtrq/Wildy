import { React } from "react";
import { Link } from "react-router-dom";

const Tutorial = () => {
    return(
        <>
            <video controls autoPlay width={1820} height={1080}>
                <source src="https://private.up.railway.app/i/gn2h2" type="video/ogg"/>
            </video>

            <Link to="/"><p>Back To Home</p></Link>
        </>
    );
};

export default Tutorial;