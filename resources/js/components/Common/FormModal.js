import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

// Modal settings
Modal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0,0.4)';
const modalContentStyle = {
  overlay: {
    zIndex: 1000
  },
  content : {
    top                   : '25%',
    left                  : '27%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    width									: '60%',
    marginTop							: '-50px',
    marginLeft						: '-50px',
    backgroundColor				: '#fefefe',
  }
};
// END Modal settings

export default class FormModal extends React.Component {

  constructor(props) {
    super(props);

    // Assign the modal to an element for screen readers, etc.
    Modal.setAppElement(props.modalAppElement);

    // Make a deep copy of the modalContentStyle object
    let modalStyle = JSON.parse(JSON.stringify(modalContentStyle));

    // If there were any supplied modal style overrides apply them
    if (props.styleOverride) {
      for (var key in props.styleOverride) {
        modalStyle.content[key] = props.styleOverride[key];
      }
    }

    // Assign the final modal styles to the state, so they can be applied to newly created modal(s)
    this.state = {
      modalContentStyle: modalStyle,
    }
  }

  render() {
    // Modal is being shown; render contents
    return(
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        style={this.state.modalContentStyle}
        contentLabel={this.props.title}
        title={this.props.title}
      >
        <div className="block block-themed block-transparent mb-0">
          <div className="block-header bg-primary-dark">
            <h3 className="block-title">{ this.props.title }</h3>
          </div>
          <div className="block-content font-size-sm">
            {this.props.children}
          </div>
          <div className="block-content block-content-full text-right border-top">
          </div>
        </div>
      </Modal>
    );
  }
}
