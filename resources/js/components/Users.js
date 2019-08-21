import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Users extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">Users Component</div>

                            <div className="card-body">I'm an example component!</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

if (document.getElementById('users')) {
    ReactDOM.render(<Users />, document.getElementById('users'));
}
