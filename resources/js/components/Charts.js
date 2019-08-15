import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import SalesChart from './SalesChart';
import CategoryChart from './CategoryChart';
import RentalsChart from './RentalsChart';

export default class Charts extends Component {

    constructor(props) {
  		super(props);
  	}

    render() {
        return (
          <div>
            <div className="row justify-content-center">

              <div className="col-6">
                <div className="card">
                  <div className="card-header">
                    <i className="fas fa-chart-pie"></i>
                    <span className="ml-2">Annual Sales</span>
                  </div>
                  <div className="card-body">
                    <SalesChart />
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="card">
                  <div className="card-header">
                    <i className="fas fa-chart-pie"></i>
                    <span className="ml-2">Film Inventory by Category</span>
                  </div>
                  <div className="card-body">
                    <CategoryChart />
                  </div>
                </div>
              </div>

            </div>

            <div className="row justify-content-center mt-4">

              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <i className="fas fa-chart-pie"></i>
                    <span className="ml-2">Rental Volume Over Time</span>
                  </div>
                  <div className="card-body">
                    <RentalsChart />
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
