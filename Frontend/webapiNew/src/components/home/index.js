import React from 'react';
import Header from "../header/header";
import BackPicture from "../../images/BackPicture2.jpg";
import Footer from "../footer/footer";
import Browser from "./browser";
import RecommendedPublications from "./recommendedPublications";

class Index extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render() {
        return (
            <>
                <title>TeamUp! | Home</title>
                <meta name="description" content="TeamUP - Alquileres de espacios" />
                <Header />
                <div style={PictureStyle}>
                    <br />
                    <div className="custom-footer full-width">
                        <div className="container">
                            <Browser /> 
                        </div>
                    </div>
                </div>
                <div className="col-md-12 center-column" id="content">
                    <RecommendedPublications />
                </div>
                <Footer />
            </>
        );
    }
}

const PictureStyle = {
    backgroundImage: "url(" + BackPicture + ")",
    width: "100%",
    height: "100%",
    "backgroundRepeat": "no-repeat",
    "backgroundPositionY": "center",
    "backgroundPositionX": "center",
    "backgroundSize" : 'cover'
}

export default Index;