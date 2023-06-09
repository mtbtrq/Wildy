import { React } from "react";
import { Link } from "react-router-dom";

const Tutorial = () => {
    return(
        <>
            <video controls autoPlay>
                <source src="https://cdn.discordapp.com/attachments/948294688291565599/1111192800357265448/Tutorial.mp4" type="video/mp4"/>
            </video>

            <Link to="/"><p>Back To Home</p></Link>
        </>
    );
};

export default Tutorial;