import Parse from 'parse';
import applicationId from '../../../../parse/config/applicationId.json';
import serverUrl from '../../../../parse/config/serverUrl.json';

function initialize() {
  Parse.initialize(applicationId, '5Zfjq6zZHrIDR8scvgdebjqTMdbKVDWjzK695Ycm');
  Parse.serverURL = serverUrl;
}

export default initialize;
