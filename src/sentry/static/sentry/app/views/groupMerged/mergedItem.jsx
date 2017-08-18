import React, {PropTypes} from 'react';
import Reflux from 'reflux';
import classNames from 'classnames';

import Checkbox from '../../components/checkbox';
import EventsTable from '../../components/eventsTable/eventsTable';
import FlowLayout from '../../components/flowLayout';
import GroupState from '../../mixins/groupState';
import GroupingActions from '../../actions/groupingActions';
import GroupingStore from '../../stores/groupingStore';
import SpreadLayout from '../../components/spreadLayout';

import '../../../less/components/mergedItem.less';

const MergedItem = React.createClass({
  propTypes: {
    orgId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    groupId: PropTypes.string.isRequired,
    fingerprint: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    event: PropTypes.shape({
      groupID: PropTypes.string,
      type: PropTypes.oneOf(['error', 'csp', 'default']),
      dateCreated: PropTypes.string,
      platform: PropTypes.string
    })
  },

  mixins: [GroupState, Reflux.listenTo(GroupingStore, 'onGroupingChange')],

  getInitialState() {
    return {
      collapsed: false,
      checked: false,
      busy: false
    };
  },

  onGroupingChange({unmergeState}) {
    if (!unmergeState) return;

    let {fingerprint} = this.props;
    let stateForId = unmergeState.has(fingerprint) && unmergeState.get(fingerprint);
    if (!stateForId) return;

    Object.keys(stateForId).forEach(key => {
      if (stateForId[key] === this.state[key]) return;

      this.setState({
        [key]: stateForId[key]
      });
    });
  },

  handleToggleEvents() {
    let {fingerprint} = this.props;
    GroupingActions.toggleCollapseFingerprint(fingerprint);
  },

  // Disable default behavior of toggling checkbox
  handleLabelClick(e) {
    e.preventDefault();
  },

  handleToggle(e) {
    let {disabled, fingerprint} = this.props;

    if (disabled || this.state.busy) return;

    // clicking anywhere in the row will toggle the checkbox
    GroupingActions.toggleUnmerge(fingerprint);
  },

  render() {
    let {disabled, event, orgId, fingerprint, projectId, groupId} = this.props;
    let checkboxDisabled = disabled || this.state.disabled;
    let cx = classNames('fingerprint-group', {
      expanded: !this.state.collapsed,
      busy: this.state.busy
    });
    let group = this.getGroup();

    let tagList = (group && group.tags.filter(tag => tag.key !== 'user')) || [];

    // `event` can be null if last event w/ fingerprint is not within retention period
    return (
      <div className={cx}>
        <SpreadLayout className="merged-controls" responsive>
          <FlowLayout onClick={this.handleToggle}>
            <div className="action-column">
              <Checkbox
                id={fingerprint}
                value={fingerprint}
                checked={this.state.checked}
                disabled={checkboxDisabled}
              />
            </div>

            <label
              onClick={this.handleLabelClick}
              htmlFor={fingerprint}
              className="truncate fingerprint">
              {fingerprint}
            </label>
          </FlowLayout>

          <div>
            <span />
            <span className="merged-collapse" onClick={this.handleToggleEvents}>
              {this.state.collapsed
                ? <i className="icon-arrow-down" />
                : <i className="icon-arrow-up" />}
            </span>
          </div>
        </SpreadLayout>

        {!this.state.collapsed &&
          <div className="merged-events-list event-list">
            {event &&
              <EventsTable
                fixedDimensions
                tagList={tagList}
                events={[event]}
                params={{
                  orgId,
                  projectId,
                  groupId
                }}
              />}
          </div>}
      </div>
    );
  }
});

export default MergedItem;
