import React from 'react';
import { Helmet } from 'react-helmet';
import Header from "../header/header";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ValidateEmail extends React.Component {
    constructor(props) {
        super(props);
        const emailtoken = props.match.params.emailtoken;
        this.state = {
            emailtoken: emailtoken,
            isLoading: true,
            message: ""
        }

    }

    componentDidMount() {
        if(this.state.emailtoken){
            fetch('https://localhost:44372/api/validateEmail', {
                method: 'POST',
                header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    ActivationCode: this.state.emailtoken
                })
            }).then(response => response.json()).then(data => {
                console.log("data:" + JSON.stringify(data));
                if (data.responseCode == "SUCC_EMAILVALIDATED") {
                    toast.success('Correo validado correctamente ', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    this.setState({
                        isLoading: false
                    });
                    this.props.history.push('/account/login');
                } else {
                    toast.error('Hubo un error', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            }
            ).catch(error => {
                toast.error('Internal error', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                console.log(error);
            }
            )
        }
    }

    render() {
        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | Validar Email</title>
                    <meta name="description" content="---" />
                </Helmet>
                {/*SEO Support End */}
                <Header />
                <div className="main-content  full-width  home">
                    <div className="col-md-6">
                        { this.state.isLoading ? <div><div className="spinner-border"></div>Validando...</div> : <div>VALIDADO!</div>}
                        Token received: {this.state.emailtoken}
                    </div>
                </div>
            </>
        );
    }
}

export default ValidateEmail;