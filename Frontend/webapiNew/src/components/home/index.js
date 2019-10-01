import React from 'react';
import Header from "../header/header";
import BackPicture from "../images/BackPicture.jpg";
import Footer from "../footer/footer";
import Browser from "./browser";

class Index extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render() {
        return (
            <>
                <title>TeamUp! | Página Principal</title>
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
    "backgroundSize": "100% 100%",
}

export default Index;