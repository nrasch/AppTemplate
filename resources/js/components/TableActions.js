import React from 'react';

export default class TableActions extends React.Component {

  // Create and return React elements for each action (i.e. create, delete, etc.)
	render() {
		return (
			<div>
				{ this.props.actions.map( (action, index) => {
					return(
						<span
							data-toggle="tooltip"
							data-placement="top"
							title={ action.title }
							key={ index }
							onClick={ (e) => action.onClick(action.modalType, this.props.item) }
							className={ "mr-3 " + action.class }
						>
							<i className={ action.icon }></i>
						</span>
					)
				})}
			</div>
		);
	}
}
