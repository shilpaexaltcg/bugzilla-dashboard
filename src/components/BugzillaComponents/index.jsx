import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DrilldownIcon from '../DrilldownIcon';
import { BZ_QUERIES } from '../../config';

const styles = ({
  header: {
    margin: '0.5rem 0 0 0',
  },
  metric: {
    textAlign: 'center',
  },
});

const sortByComponentName = (a, b) => a.label.localeCompare(b.label);

const BugzillaComponents = ({
  classes, title, bugzillaComponents, onComponentDetails,
}) => (
  bugzillaComponents.length > 0 && (
    <div>
      <h3 className={classes.header}>{title}</h3>
      <table>
        <thead>
          <tr>
            <th />
            {onComponentDetails && <th />}
            {Object.values(BZ_QUERIES).map(({ label }) => (
              <th key={label} className={classes.metricLabel}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bugzillaComponents
            .sort(sortByComponentName)
            .map(({
              label, component, product, metrics = {}, teamKey = null,
            }) => (
              <tr key={label}>
                {onComponentDetails && (
                  <td>
                    <DrilldownIcon
                      name={label}
                      onChange={onComponentDetails}
                      properties={{
                        componentKey: `${product}::${component}`,
                        teamKey,
                      }}
                    />
                  </td>
                )}
                <td>{label}</td>
                {Object.keys(BZ_QUERIES).map(metric => (
                  metrics[metric] && (
                  <td key={metric} className={classes.metric}>
                    <a href={metrics[metric].link} target="_blank" rel="noopener noreferrer">{metrics[metric].count}</a>
                  </td>
                  )
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
);

BugzillaComponents.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  bugzillaComponents: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      product: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]).isRequired,
      component: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]).isRequired,
      metrics: PropTypes.shape({}),
    }),
  ).isRequired,
  onComponentDetails: PropTypes.func,
};

BugzillaComponents.defaultProps = {
  onComponentDetails: undefined,
};

export default withStyles(styles)(BugzillaComponents);
