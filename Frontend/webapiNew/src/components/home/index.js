import React from 'react';
import Header from "../header/header";
import BackPicture from "../images/BackPicture.jpg";
import Footer from "../footer/footer";

class Index extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render() {
        return (
            <>
                <title>TeamUp | Página Principal</title>
                <meta name="description" content="TeamUP - Alquileres de espacios" />
                <Header />
                <div style={PictureStyle}>
                    <br />
                    <br />
                    <input
                        type="text"
                        name="search"
                        placeholder='Buscar'
                        id="input-search"
                        className="form-control"
                    />
                    <br />
                    <br />
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
    fontSize: "90px"
}
export default Index;