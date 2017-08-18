import React, {PropTypes} from 'react';
import classNames from 'classnames';
import '../../less/components/flowLayout.less';

// Simple horizontal layout with vertical centering
// Takes up remaining space of a flexbox container (i.e. "flex: 1")
const FlowLayout = React.createClass({
  propTypes: {
    /** Applies "overflow: hidden" to container so that children can be truncated */
    truncate: PropTypes.bool
  },

  getDefaultProps() {
    return {
      truncate: true
    };
  },

  render() {
    let {className, children, truncate, ...otherProps} = this.props;
    let cx = classNames('flow-layout', className, {
      'is-truncated': truncate
    });

    return (
      <div className={cx} {...otherProps}>
        {children}
      </div>
    );
  }
});

export default FlowLayout;
