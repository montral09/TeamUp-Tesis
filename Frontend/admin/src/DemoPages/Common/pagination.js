import React, { Fragment } from 'react';
import './pagination.css';
import {MAX_ELEMENTS_PER_TABLE} from '../../config/constants';
import {Button} from 'reactstrap';

/* Common components that builds the paginations, receives the originaArray and a function pointer updateElementsToDisplay */
class Pagination extends React.Component {
    constructor(props) {
        super(props);
        var newTotalPages = Math.round(parseFloat(props.originalArray.length/MAX_ELEMENTS_PER_TABLE));
        var newPagination = [];
        for(var i=1;i<=newTotalPages;i++){
            newPagination.push(i);
        }
        this.state = {
            pagination: newPagination,
            currentPage: 1,
            originalArray : props.originalArray,
        }
    }

    calcPagination = () =>{
        var newTotalPages = Math.round(parseFloat(this.state.originalArray.length/MAX_ELEMENTS_PER_TABLE));
        var newPagination = [];
        for(var i=1;i<=newTotalPages;i++){
            newPagination.push(i);
        }
        this.setState({pagination: newPagination })
    }

    changePage = (pageClicked) => {
        var toDisplayArray = this.filterPaginationArray(this.state.originalArray, (pageClicked - 1) * MAX_ELEMENTS_PER_TABLE)
        this.props.updateElementsToDisplay(toDisplayArray);
        this.setState({currentPage: pageClicked })
    }

    filterPaginationArray = (arrayToFilter, startIndex) => {
        return arrayToFilter.slice(startIndex, startIndex + MAX_ELEMENTS_PER_TABLE)
    }
    render() {

        return (
            <Fragment>
                <br />
                <div className="row pagination-results">
                    <div className="col-md-6 text-left">
                        <ul className="pagination">
                            {this.state.pagination.map(page => {
                                return (
                                    <Button className="mb-2 mr-2" key={page} {... (this.state.currentPage === page ? {active: true} : {})} onClick={() => this.changePage(page)} color="primary">{page}</Button>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="col-md-6 text-right">Mostrando {MAX_ELEMENTS_PER_TABLE * this.state.currentPage < this.state.originalArray.length ? MAX_ELEMENTS_PER_TABLE * this.state.currentPage : this.state.originalArray.length} de {this.state.originalArray.length}</div>
                </div>
            </Fragment>
        );
    }
}


export default Pagination;