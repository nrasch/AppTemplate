import React, {Component} from 'react';
import { Search, CSVExport } from 'react-bootstrap-table2-toolkit';

export default class TableExportAndSearch extends Component {
	render() {

		const { SearchBar } = Search;
		const { ExportCSVButton } = CSVExport;

		return (
			<div className="row text-right mb-1">
				<div className="col-md-6 offset-md-9">
					<div className="row mt-2">
						<div className="mr-5">
							<ExportCSVButton
								{	 ...this.props.csvProps}
								className="btn btn-primary form-control btn-sm"
							>
								CSV
							</ExportCSVButton>
						</div>
						<div className="col-xs-3">
							<SearchBar
								{ ...this.props.searchProps }
								placeholder="Search...."
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
