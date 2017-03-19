/*global ko, d3*/

ko.bindingHandlers.lineChart = {
    init: function (element) {
        "use strict";

        var margin = { top: 20, right: 20, bottom: 30, left: 50 },
            elementWidth = parseInt(d3.select(element).style("width"), 10),
            elementHeight = parseInt(d3.select(element).style("height"), 10),
            width = elementWidth - margin.left - margin.right,
            height = elementHeight - margin.top - margin.bottom,

            svg = d3.select(element).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");

        svg.append("g")
            .attr("class", "y axis")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Temperature");

        svg.append("path")
            .attr("class", "line data");

    },
    update: function (element, valueAccessor) {
        "use strict";

        var margin = { top: 20, right: 20, bottom: 30, left: 50 },
            elementWidth = parseInt(d3.select(element).style("width"), 10),
            elementHeight = parseInt(d3.select(element).style("height"), 10),
            width = elementWidth - margin.left - margin.right,
            height = elementHeight - margin.top - margin.bottom,

            // set the time it takes for the animation to take.
            animationDuration = 750,

            x = d3.time.scale()
                .range([0, width]),

            y = d3.scale.linear()
                .range([height, 0]),

            xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom"),

            yAxis = d3.svg.axis()
                .scale(y)
                .orient("left"),

            // define the graph line
            line = d3.svg.line()
                .x(function (d) { return x(d.Date); })
                .y(function (d) { return y(d.LiquidTemp); }),

            svg = d3.select(element).select("svg g"),

            // parse data from the data-view-model
            data = ko.unwrap(valueAccessor());

        // define the domain of the graph. max and min of the dimensions
        x.domain(d3.extent(data, function (d) { return d.Date; }));
        y.domain([0, d3.max(data, function (d) { return d.LiquidTemp; })]);

        svg.select("g.x.axis")
            .transition()
            .duration(animationDuration)
            .call(xAxis);

        svg.select("g.y.axis")
            .transition()
            .duration(animationDuration)
            .call(yAxis);

        // add the line to the canvas
        svg.select("path.line.data")
            .datum(data)
            .transition()
            .duration(animationDuration)
            .attr("d", line);
    }
};
