const codemirror = require('codemirror'),
      cm_sql = require('../node_modules/codemirror/mode/sql/sql'),
      angular = require('angular'),
      ui_codemirror = require('./vendor/ui-codemirror'),
      App = require('./app'),
      ConnectionService = require('./services/connection-service'),
      SessionService = require('./services/session-service'),
      AppController = require('./controllers/app-controller'),
      QueryController = require('./controllers/query-controller'),
      SidebarController = require('./controllers/sidebar-controller'),
      ConnectionController = require('./controllers/connection-controller'),
      Menu = require('./directives/menu');

window.CodeMirror = codemirror;