/*global ko, setInterval*/

var D3KD = this.D3KD || {};

(function (namespace) {
    "use strict";
    namespace.dataViewModel = function () {
        var self = this;

        self.lineChartData = ko.observableArray();
        self.addDataPoint = function (point) {
            if (self.lineChartData().length >= 10) {
                self.lineChartData.shift();
            }

            self.lineChartData.push(point);
        };
    };
}(D3KD));