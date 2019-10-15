import React from 'react';
import Header from "../../header/header";
import { Link, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';


class ViewPublication extends React.Component {

    constructor(props) {
        super(props);
        const pubID = props.match.params.pubID;
        var pubObj = this.loadDummyPublication(pubID);
        this.state = {
            pubID: pubID,
            pubObj: pubObj
        }

    }

    
    componentDidMount() {
        window.scrollTo(0, 0);

    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }


    loadDummyPublication(pubID) {
        try {

            // call API
            return {
                pubID: 123,
                pubName: "Oficina en pocitos",
                pubDesc: "Oficina en pocitos la mejor"
            }

        } catch (error) {
            toast.error('Internal error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
        return null;
    }

    render() {
        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | Ver publicacion</title>
                    <meta name="description" content="---" />
                </Helmet>
                {/*SEO Support End */}
                <Header />
                <div className="main-content  full-width  home">
                    <div className="pattern" >
                        <div>
                            <div className="row">
                                <div className="col-md-12 ">
                                    <div className="row">
                                        <div className="col-md-9 center-column" id="content">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="well">
                                                    </div>
                                                </div>
                                                <div className="col-md-9">

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status
    }
}

export default connect(mapStateToProps)(ViewPublication);