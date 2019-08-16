import React, { Component } from 'react';
import { render } from 'react-dom';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import LoadingOverlay from 'react-loading-overlay';

import FormModal from './Common/FormModal';

require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/export-data')(Highcharts)

export default class BaseChart extends Component {

    /**
    * Class constructor
    */
    constructor(props) {
        super(props);

        this.state = {
            // Show/hide the chart overlay on ajax requests to notify the user activity is happening
            showOverlay: false,
            // Show/hide graph filter options modal
            isFilterModalOpen: false,
            // District chart filter value
            districtFilter: 0,
            // Tracks if a filter has been selectec by the user which requires the chart data to be updated
            needDataUpdate: true,
            // Set filter modal title and content label
            modalTitle: "PLACEHOLDER",
            modalContentLabel: "PLACEHOLDER",
        };
        // END this.state = {

        // Bindings
        this.toggleFilterModal = this.toggleFilterModal.bind(this);
        this.saveFilter = this.saveFilter.bind(this);
    }
    // END constructor(props) {

    /**
    * Actions to take once the component has mounted
    */
    componentDidMount() {
        this.refreshData();
    }
    
    /**
    * Shows/hides the chart filter modal
    */
    toggleFilterModal() {

        // If a filter has been selected refresh the chart data
        if (this.state.isFilterModalOpen && this.state.needDataUpdate) {
            this.refreshData();
        }

        // Toggle the modal
        this.setState({
            isFilterModalOpen: !this.state.isFilterModalOpen,
        });
    }

    /**
    * Save any user selected filters in the state
    */
    saveFilter(event) {
        this.setState({
            // Utilize computed property names
            [event.target.id]: event.target.value,
            needDataUpdate: true
        });
    }

    // Create the HTML to be drawn on the page
    render() {
        const { chartOptions } = this.state;

        return (
            <div>
                {/* Form overlay to visually indicate activity is occurring to the user */}
                <LoadingOverlay
                    active={this.state.showOverlay}
                    spinner
                    text='Working...'
                    >
                    {/* Render Highchart graph */}
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOptions}
                        />
                    <button className="mt-3 btn btn-primary" onClick={this.toggleFilterModal}>
                        <i className="fas fa-bars mr-3"></i>
                        Chart filter options
                    </button>
                    {/* END Render Highchart graph */}
                </LoadingOverlay>
                {/* END Form overlay to visually indicate activity is occurring to the user */}

                {/* Graph filter options modal */}
                <div>
                    <FormModal
                        isOpen={this.state.isFilterModalOpen}
                        onRequestClose={this.toggleFilterModal}
                        contentLabel={this.state.modalContentLabel}
                        title={this.state.modalTitle}
                        modalAppElement="#react-charts"
                        styleOverride={ new Object({width: '40%', left: '35%',}) }
                        >
                        {/* Graph filter options form */}
                        <form>
                            <div className="form-group">
                                <label className="mr-sm-2" htmlFor="districtFilter">Store</label>
                                <select className="custom-select mr-sm-2 col-2" id="districtFilter" name="districtFilter" value={ this.state.districtFilter } onChange={ this.saveFilter }>
                                    <option value="0">All Stores</option>
                                    <option value="Alberta">Alberta</option>
                                    <option value="QLD">QLD</option>
                                </select>
                            </div>
                            <button className="btn btn-primary mb-3" onClick={this.toggleFilterModal}>Apply</button>
                        </form>
                        {/* END Graph filter options form */}

                    </FormModal>
                </div>
                {/* END Graph filter options modal */}
            </div>
        )
    }
    // END render()
}
