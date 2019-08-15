import React, { Component } from 'react';
import { render } from 'react-dom';
import Highcharts from 'highcharts';

import BaseChart from './BaseChart';

export default class RentalsChart extends BaseChart {

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
                    zoomType: 'x',
                    scrollablePlotArea: {
                        minWidth: 700
                    }
                },

                title: {
                    text: 'Rental volume over time',
                },

                subtitle: {
                    text: document.ontouchstart === undefined ? 'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                },

                xAxis: { type: 'datetime' },

                yAxis: {
                    title: {
                        text: 'Rental Volume'
                    }
                },

                legend: {
                    enabled: false
                },

                tooltip: {
                    shared: true,
                    crosshairs: true
                },

                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },

                series: [{
                    type: 'area',
                    name: 'Sales Volume',
                    data: []
                }],

                exporting: {
                    enabled: true,
                    buttons: {
                        contextButton: {
                            menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'separator', 'downloadCSV', 'downloadXLS', 'viewData',]
                        },
                    },
                },
            },

            // Set filter modal title and content label
            modalTitle: "Rentals over time graph filter options",
            modalContentLabel: "Rentals over time graph filter options",
        };
        // END this.state
    }
    // END constructor(props)

    /**
    * Make an ajax call to the backend to fetch data for the graph
    */
    refreshData() {

        // Show the overlay while the ajax request is processing
        this.setState({
            showOverlay: true,
        });

        // Utilize axios to make the ajax call to the backend
        axios.get('/charts/get_rental_volume', {
            // Include any query filters
            params: {
                district: this.state.districtFilter,
            }
        })
        .then(response => {
            if (response.data.data) {
                // Update the chart's series which will refresh it
                this.setState({
                    chartOptions: {
                        series: response.data.data.series
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
    // END refreshData()
 }
