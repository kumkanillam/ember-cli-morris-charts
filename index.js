'use strict';

module.exports = {
    name: 'ember-cli-morris-charts',
    included: function(app) {
        this._super.included(app);

        app.import('vendor/raphael.min.js');
        app.import('vendor/morris.css');
        app.import('vendor/morris.js');
    }
};