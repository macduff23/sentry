import {canIncludePreviousPeriod} from 'app/views/events/utils/canIncludePreviousPeriod';
import {getPeriod} from 'app/utils/getPeriod';

const BASE_URL = org => `/organizations/${org.slug}/events-stats/`;

/**
 * Make requests to `health` endpoint
 *
 * @param {Object} api API client instance
 * @param {Object} options Request parameters
 * @param {Object} options.organization Organization object
 * @param {Number[]} options.projects List of project ids
 * @param {String[]} options.environments List of environments to query for
 * @param {String} options.period Time period to query for, in the format: <integer><units> where units are "d" or "h"
 * @param {String} options.interval Time interval to group results in, in the format: <integer><units> where units are "d", "h", "m", "s"
 * @param {Boolean} options.includePrevious Should request also return reqsults for previous period?
 * @param {Number} options.limit The number of rows to return
 * @param {String} options.query Search query
 */
export const doEventsRequest = (
  api,
  {
    organization,
    project,
    environment,
    period,
    start,
    end,
    interval,
    includePrevious,
    query,
    yAxis,
    groupId,
  }
) => {
  const shouldDoublePeriod = canIncludePreviousPeriod(includePrevious, period);
  const urlQuery = {
    interval,
    project,
    environment,
    query,
    yAxis,
    group: groupId,
  };

  // Doubling period for absolute dates is not accurate unless starting and
  // ending times are the same (at least for daily intervals). This is
  // the tradeoff for now.
  const periodObj = getPeriod({period, start, end}, {shouldDoublePeriod});

  return api.requestPromise(`${BASE_URL(organization)}`, {
    query: {
      ...urlQuery,
      ...periodObj,
    },
  });
};
