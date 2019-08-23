import React from 'react';

export default class FashMessage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    // Render nothing if the flash message shouldn't be shown
    if (!this.props.show) {
      return null;
    }

    // Render the flash message
    return (
      <div className={ "alert alert-" + this.props.result.type } role="alert" >
        { this.props.result.message }
      </div>
    );
  }
}
