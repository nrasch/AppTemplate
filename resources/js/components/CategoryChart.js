import BaseChart from './BaseChart';

export default class CategoryChart extends BaseChart {

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
                    type: 'column',
                    scrollablePlotArea: {
                        minWidth: 700
                    }
                },

                title: {
                    text: 'Film inventory by category'
                },

                subtitle: {
                    text: 'Source: https://dev.mysql.com/doc/sakila/en/'
                },

                xAxis: {
                    title: {
                        text: 'Film Category'
                    },
                },

                yAxis: [{ // left y axis
                    title: {
                        text: 'Number of Films'
                    },
                    labels: {},
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

            // Set filter modal title and content label
            modalTitle: "Film inventory by category",
            modalContentLabel: "Film inventory by category",
        }
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
        axios.get('/charts/get_categories', {
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
    // END refreshData()
}
