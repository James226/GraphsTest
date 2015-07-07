var Graphs;
(function (Graphs) {
    Graphs.app = window["angular"].module("graphs", []);
    var HomeController = (function () {
        function HomeController($scope, $location, d3Service) {
            var circles, path;
            var svg, xAxis, yAxis, area, zoom, w, x, y, line;
            $scope.splice = function () {
                $scope.data.shift();
                path.transition().attr("d", line);
                var circle = svg.selectAll("circle").data($scope.data, function (d) { return d.date; });
                circle.exit().transition().duration(500).attr("r", 0).remove();
            };
            var initialiseGraphFunction = function (d3) {
                var margin = { top: 20, right: 20, bottom: 30, left: 50 }, width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;
                var parseDate = d3.time.format("%d-%b-%y").parse;
                x = d3.time.scale().range([0, width]);
                y = d3.scale.linear().range([height, 0]);
                var xAxis = d3.svg.axis().scale(x).orient("bottom");
                var yAxis = d3.svg.axis().scale(y).orient("left");
                var tip = d3.tip().attr('class', 'd3-tip').html(function (d) { return ("<span>Close Price: $" + d.close + "</span>"); }).offset([-12, 0]);
                line = d3.svg.line().x(function (d) { return x(d.date); }).y(function (d) { return y(d.close); });
                svg = d3.select("#graph").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                svg.call(tip);
                $scope.data = d3.csv.parse("date,close\n21-Sep-07,144.15\n20-Sep-07,140.31\n19-Sep-07,140.77", function (d) {
                    return {
                        date: parseDate(d.date),
                        close: +d.close
                    };
                });
                x.domain(d3.extent($scope.data, function (d) { return d.date; }));
                y.domain(d3.extent($scope.data, function (d) { return d.close; }));
                svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
                svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Price ($)");
                path = svg.append("path").datum($scope.data, function (d) { return parseDate(d.date); }).attr("class", "line").attr("d", line);
                circles = svg.selectAll(".circle").data($scope.data);
                circles.enter().append("svg:circle").attr("class", "circle").attr("cx", function (d, i) { return x(d.date); }).attr("cy", function (d, i) { return y(d.close); }).attr("r", 3).on('mouseover', tip.show).on('mouseout', tip.hide);
            };
            d3Service.d3().then(function (d3) {
                initialiseGraphFunction(d3);
            });
        }
        return HomeController;
    })();
    Graphs.app.controller("HomeController", ["$scope", "$location", "d3Service", HomeController]);
    Graphs.app.factory('d3Service', ['$document', '$q', '$rootScope', function ($document, $q, $rootScope) {
        var d = $q.defer();
        d.resolve(window["d3"]);
        return {
            d3: function () {
                return d.promise;
            }
        };
    }]);
})(Graphs || (Graphs = {}));
