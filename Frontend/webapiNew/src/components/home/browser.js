import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './browser.css';

class Browser extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    state = {
        startDate: null,
        endDate: null,
        dropDownValue: "Tipo de espacio"
    };

    handleChangeStartDate = startDate => {
        this.setState({
            startDate: startDate
        });
    };

    handleChangeEndDate = endDate => {
        this.setState({
            endDate: endDate
        });
    };

    changeValue(text) {
        this.setState({ dropDownValue: text })
    }

    render() {
        return (
            <div>
                <h1 style = {{ color: 'white', marginTop: '15%', marginBottom: '30px', marginLeft: '20px'}}>Encuentre el espacio que mas se adecue a su necesidad</h1>
                <div style = {{ marginLeft: '5%', marginBottom: '30%'}}> 
					<select className="browser">
                        <option value="1">Sala de reuniones</option>
                        <option value="2">Salon de fiestas</option>
                        <option value="3">Oficina</option>
                    </select>
                    <select className="browser">
                        <option value="1">Montevideo</option>
                        <option value="2">Canelones</option>
                        <option value="3">Maldonado</option>
                        <option value="4">Florida</option>
                        <option value="5">Treinta y Tres</option>
                    </select>
                    <label className="browser">
                        <DatePicker 
                            placeholderText="Desde"
                            selected={this.state.startDate}
                            onChange={this.handleChangeStartDate}
                            dateFormat="dd/MM/yyyy"
                        />
                    </label>
                    <label className="browser">
                        <DatePicker className="browser"
                            placeholderText="Hasta"
                            selected={this.state.endDate}
                            onChange={this.handleChangeEndDate}
                            dateFormat="dd/MM/yyyy"
                        />
                    </label>
                    <input readOnly defaultValue='Buscar' className="btn btn-primary browser"/>
                </div>
                

            </div>
        );
    }
}
export default Browser;