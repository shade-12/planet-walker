import React from "react";

// Interpolator module import
import * as d3 from "d3";

function CubicSplineCanvas() {

    var data = [];
    
    let x = [0,1,2,1.5,1.5,1,0,0,1,2,3,4,4,3,3,4,5,5,6,6,7,8,8,7,6.75,8,10,11,5,0,5,10]
    let y = [2,2,3,3,1.5,0.5,0,1,1,0.5,0,0,1,1,0,0,1,0,0,1,0.5,0.5,1,1,0.25,0,0.5,0,-2,-1,-1,-2]

    for (let i = 0; i < x.length; i++) {
        data.push({ x: x[i], y: y[i] });
    }

    // console.log(data)
    var xScale = d3.scaleLinear()
        .domain([0, 10]).range([25, 175]);
    var yScale = d3.scaleLinear()
        .domain([-2, 2]).range([175, 25]);

    var line = d3.line()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y))
        .curve(d3.curveNatural);

    d3.select("#gfg")
        .append("path")
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", "blue");

    return (
        <div className="CubicSplineCanvas">
            <center>
                <h3>Cubic Spline Canvas</h3>
                <svg id="gfg" width="500" height="500"></svg>
            </center>
        </div>
    );
}

export default CubicSplineCanvas;