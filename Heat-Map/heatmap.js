const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(url).then(data => {
    const dataset = data.monthlyVariance;
    const baseTemp = data.baseTemperature;
    const width = 5 * Math.ceil(dataset.length / 12);
    const height = 33 * 12;
    const padding = 60;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + (2 * padding))
        .attr("height", height + (2 * padding));

    const xScale = d3.scaleLinear()
        .domain([d3.min(dataset, d => d.year), d3.max(dataset, d => d.year)])
        .range([padding, width + padding]);

    const yScale = d3.scaleTime()
        .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
        .range([padding, height + padding]);

    const colorScale = d3.scaleSequential(d3.interpolateInferno)
        .domain([d3.min(dataset, d => d.variance), d3.max(dataset, d => d.variance)]);

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("data-month", d => d.month - 1)
        .attr("data-year", d => d.year)
        .attr("data-temp", d => baseTemp + d.variance)
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0)))
        .attr("width", 5)
        .attr("height", 33)
        .attr("fill", d => colorScale(d.variance));

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + (height + padding) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);
})