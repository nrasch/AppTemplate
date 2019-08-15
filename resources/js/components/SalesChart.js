import React, { Component } from 'react';
import { render } from 'react-dom';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import LoadingOverlay from 'react-loading-overlay';

import FormModal from './Common/FormModal';

require('highcharts/modules/exporting')(Highcharts)
require('highcharts/modules/export-data')(Highcharts)

export default class SalesChart extends Component {

    /**
    * Class constructor
    */
    constructor(props) {
        super(props);

        this.state = {
            // Keeping the Highchart options in the state to avoid unnecessary updates
            // as per the Highchart reccomendations
            //
            // Highchart API reference: https://api.highcharts.com/highcharts/
            chartOptions: {
                chart: {
                    height: 300,
                    scrollablePlotArea: {
                        minWidth: 700
                    }
                },

                title: {
                    text: 'Annual sales'
                },

                subtitle: {
                    text: 'Source: https://dev.mysql.com/doc/sakila/en/'
                },

                xAxis: {},

                yAxis: [{ // left y axis
                    title: {
                        text: 'Total Sales per Year'
                    },
                    labels: {
                        align: 'left',
                        x: 3,
                        y: 16,
                        format: '${value:.,0f}'
                    },
                    showFirstLabel: false,
                }],

                legend: {
                    align: 'left',
                    verticalAlign: 'top',
                    borderWidth: 0
                },

                tooltip: {
                    shared: true,
                    crosshairs: true
                },

                plotOptions: {
                    series: {
                        cursor: 'pointer',
                        point: {
                            events: {}
                        },
                        marker: {
                            lineWidth: 1
                        }
                    }
                },

                series: [],

                exporting: {
                    enabled: true,
                    buttons: {
                        contextButton: {
                            menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'separator', 'downloadCSV', 'downloadXLS']
                        },
                    },
                },

            },
            // Show/hide the chart overlay on ajax requests to notify the user activity is happening
            showOverlay: false,
            // Show/hide graph filter options modal
            isFilterModalOpen: false,
            // District chart filter value
            districtFilter: 0,
            // Tracks if a filter has been selectec by the user which requires the chart data to be updated
            needDataUpdate: true,
        };
        // END this.state = {

        // Bindings
        this.toggleFilterModal = this.toggleFilterModal.bind(this);
        this.saveFilter = this.saveFilter.bind(this);
    }
    // END constructor(props) {

    /**
    * Shows/hides the charter filter modal
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
    * Actions to take once the component has mounted
    */
    componentDidMount() {
        this.refreshData();
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

    /**
    * Make an ajax call to the backend to fetch data for the graph
    */
    refreshData() {

        // Show the overlay while the ajax request is processing
        this.setState({
            showOverlay: true,
        });

        // Utilize axios to make the ajax call to the backend
        axios.get('/charts/get_sales', {
            // Include any query filters
            params: {
                district: this.state.districtFilter,
            }
        })
        .then(response => {
            if (response.data.data) {
                this.setState({
                    // Update the chart's series which will refresh it
                    chartOptions: {
                        colors: ["#7cb5ec", "#434348"],
                        series: response.data.data.series,
                        xAxis: {
                            categories: response.data.data.categories,
                        },
                    }
                });
            } else {
                this.setState({
                    chartOptions: {
                        series: [],
                        xAxis: {}
                    }
                });
            }
        })
        .catch(function (error) {
            console.log(error);
        })
        .then( () => {
            // Hide the ajax processing overlay
            this.setState({
                showOverlay: false,
                needDataUpdate: false,
            });
        });
    }
    // END refreshData() {

    // Create the HTML to be drawn on the page
    render() {
        const { chartOptions } = this.state;

        return (
            <div>
                {/* Form overlay to visually indicate activity is occuring to the user */}
                <LoadingOverlay
                    active={this.state.showOverlay}
                    spinner
                    text='Working...'
                    >
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOptions}
                        />
                    <button className="mt-3 btn btn-primary" onClick={this.toggleFilterModal}>
                        <i className="fas fa-bars mr-3"></i>
                        Chart filter options
                    </button>
                </LoadingOverlay>
                {/* END Form overlay to visually indicate activity is occuring to the user */}

                {/* Line chart filter options modal */}
                <div>
                    <FormModal
                        isOpen={this.state.isFilterModalOpen}
                        onRequestClose={this.toggleFilterModal}
                        contentLabel="Annual sales graph filter options"
                        title="Annual sales graph filter options"
                        modalAppElement="#react-charts"
                        styleOverride={ new Object({width: '40%', left: '35%',}) }
                        >
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

                    </FormModal>
                </div>
                {/* END Line chart filter options */}

            </div>
        )
    }
}
