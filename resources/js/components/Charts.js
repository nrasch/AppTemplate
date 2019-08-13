import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import LineChart from './LineChart';
import AreaChart from './AreaChart';

export default class Charts extends Component {

    constructor(props) {
  		super(props);
  	}

    render() {
        return (
          <div>
            <div className="row justify-content-center">

              <div className="col">
                <div className="card">
                  <div className="card-header">
                    <i className="fas fa-bars"></i>
                    <span className="ml-2">Sales by Store</span>
                  </div>
                  <div className="card-body">
                    <LineChart />
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="card">
                  <div className="card-header">
                    <i className="fas fa-bars"></i>
                    <span className="ml-2">Dashboard 2</span>
                  </div>
                  <div className="card-body">
                    <AreaChart />
                  </div>
                </div>
              </div>

            </div>

            <div className="row justify-content-center mt-4">

              <div className="col">
                <div className="card">
                  <div className="card-header">
                    <i className="fas fa-bars"></i>
                    <span className="ml-2">Dashboard 3</span>
                  </div>
                  <div className="card-body">
                    Chart Three
                  </div>
                </div>
              </div>

            </div>

        </div>

        );
        // END return
    }
    // END render()
}

if (document.getElementById('react-charts')) {
    ReactDOM.render(<Charts />, document.getElementById('react-charts'));
}
