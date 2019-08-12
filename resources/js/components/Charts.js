import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Charts extends Component {
    render() {
        return (
          <div>
            <div class="row justify-content-center">

              <div class="col">
                <div class="card">
                  <div class="card-header">Dashboard</div>
                  <div class="card-body">
                    Chart One
                  </div>
                </div>
              </div>


              <div class="col">
                <div class="card">
                  <div class="card-header">Dashboard</div>
                  <div class="card-body">
                    Chart Two
                  </div>
                </div>
              </div>

            </div>

            <div class="row justify-content-center mt-4">

              <div class="col">
                <div class="card">
                  <div class="card-header">Dashboard</div>
                  <div class="card-body">
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
