//Make an SVG Container

var width = 500;
var height = 500;

var N = 12;

var colors = d3.scale.category10();

var data = new Array(N);
for (i=0; i<N; i++){
    data[i] = {"x": 0, "y": 0, "w": 0};
}
var network = new Array(N)
for (i=0; i<N; i++){
    network[i] = new Array(N+1).join('0').split('').map(parseFloat)

}

var svgContainer = d3.select("body").append("svg")
                    .attr("style", "outline: thin solid red;")
                    .attr("width", width)
                    .attr("height", height);

var xscale = d3.scale.linear()
                .domain([-10, 10])
                .range([0, width]);
var yscale = d3.scale.linear()
                .domain([-10, 10])
                .range([height, 0]);

var robot_radius = 6;

for (i=0; i<12; i++) {

    // put a circle for each node
    svgContainer.append("circle")
                .attr("id", "robot_x_" + i)
                .attr("cx", 20)
                .attr("cy", 5)
                .attr("r", robot_radius)
                .attr("fill", colors(i));

    // put a line for direction of robot
    svgContainer.append("line")
                .attr("id", "orientation_" + i)
                .attr("stroke-width", 1)
                .attr("stroke", "black");


    // for every two nodes, make a link in between
    for (k=0; k<12; k++){

        svgContainer.append("line")
                    .attr("id", "edge" + i + "_" + k)
                    .attr("stroke-width", .2)
                    .attr("stroke", "white");
    }


}


// Weighted Network Visualization

var net_width = 500;
var net_height = 500;
var net_svgContainer = d3.select("body").append("svg")
                    .attr("style", "outline: thin solid red;")
                    .attr("width", net_width)
                    .attr("height", net_height);

var net_xscale = d3.scale.linear()
                .domain([-10, 10])
                .range([0, net_width]);

var net_yscale = d3.scale.linear()
                .domain([-10, 10])
                .range([net_height, 0]);

var dataset = {"nodes" : new Array(N),
               "edges": new Array(N*(N-1)/2)
               }


var tmp_c = 0
for (i=0; i<N; i++) {
    dataset.nodes[i] = {"name": i, "coordination": {"x": 0, "y": 0, "w": 0}, "degree": 0};

    for (j=i+1; j<N; j++) {
        dataset.edges[tmp_c] = {"source": i, "target": j, "weight": 0 };
        tmp_c += 1;
    }
}



var force = d3.layout.force()
            .nodes(dataset.nodes)
            .links(dataset.edges)
            .size([net_width, net_height])
            .linkStrength(function(d) {return d.weight})
            .charge([-400])
            .start()

var edges = net_svgContainer.selectAll("line")
                .data(dataset.edges)
                .enter()
                .append("line")
                .style("stroke", "black")
                .style("stroke-width", function(d) {return d.weight});

var nodes = net_svgContainer.selectAll("circle")
                .data(dataset.nodes)
                .enter()
                .append("circle")
                .attr("r", 9)
                .style("fill", function(d,i) { return colors(i); })
                .call(force.drag);

/**********     BARCHART    *********/

var x_bar_Scale = d3.scale.linear()
                .domain([0,40])
                .range([0, 2*width]);

var x_bar_Axis = d3.svg.axis()
                    .scale(x_bar_Scale)
                    .orient("bottom");


var degree_dist = []

for (i=0; i<dataset.nodes.length; i++) {
    degree_dist.push(dataset.nodes[i].degree);

}

var bins = 40;
var degree_dist_hist = d3.layout.histogram().bins(x_bar_Scale.ticks(bins))(degree_dist)

var degree_scale = d3.scale.linear().domain([0,20]).range([3,10])


var y_bar_Scale = d3.scale.linear()
                .domain([0, N])
                .range([0, height]);

//Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", 2*width)
            .attr("height", height);



//Create bars
svg.selectAll("rect")
   .data(degree_dist_hist)
   .enter()
   .append("rect")
   .attr("x", function(d) {
        return x_bar_Scale(d.x);
   })
   .attr("y", function(d) {
        return height - y_bar_Scale(d.y);
   })
   .attr("width", x_bar_Scale.range()[1]/bins)
   .attr("height", function(d) {
        return y_bar_Scale(d.y);
   })
   .attr("fill", function(d) {
        return "rgb(0, 0, " + (d.y/12.0) + ")";
   });
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0,"+ height+10 + ")")
    .call(x_bar_Axis);




/*    Tick update (Bar chart and the force layout     */
force.on("tick", function() {

    force.start()

    edges.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; })
        .style("stroke-width", function(d) {return d.weight});

    nodes.attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; })
         .attr("r", function(d) { return degree_scale(d.degree); });

    for (i=0; i<dataset.nodes.length; i++) {
        dataset.nodes[i].degree = 0;

    }
    degree_dist = []

    for (i=0; i<dataset.edges.length; i++) {

        source = dataset.edges[i].source.index;
        target = dataset.edges[i].target.index;
        dataset.edges[i].weight = network[source][target];
        dataset.nodes[source].degree +=  dataset.edges[i].weight;
        dataset.nodes[target].degree +=  dataset.edges[i].weight;


    }

    // updating degree distributions
    for (i=0; i<dataset.nodes.length; i++) {
        degree_dist.push(dataset.nodes[i].degree);
    }

      degree_scale.domain([d3.min(degree_dist),d3.max(degree_dist)])


    var degree_dist_hist = d3.layout.histogram().bins(x_bar_Scale.ticks(bins))(degree_dist)
    svg.selectAll("rect")
       .data(degree_dist_hist)
       .attr("y", function(d) {
            return height - y_bar_Scale(d.y);
       })
       .attr("height", function(d) {
            return y_bar_Scale(d.y);
       })
       .attr("fill", function(d) {
        return "rgb(0, 0, " +  Math.floor(100 + 155 * d.y / N) + ")";
          });

});