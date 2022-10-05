import React, { useEffect } from "react";

// Interpolator module import
import * as d3 from "d3";

function CubicSplineCanvas() {
    useEffect(() => {
        let data = [];
    
        let x = [0,1,2,1.5,1.5,1,0,0,1,2,3,4,4,3,3,4,5,5,6,6,7,8,8,7,6.75,8,10,11,5,0,5,10]
        let y = [2,2,3,3,1.5,0.5,0,1,1,0.5,0,0,1,1,0,0,1,0,0,1,0.5,0.5,1,1,0.25,0,0.5,0,-2,-1,-1,-2]

        for (let i = 0; i < x.length; i++)
            data.push({ x: x[i], y: y[i] });

        let xScale = d3.scaleLinear()
            .domain([0, 10]).range([100, 700]);
        let yScale = d3.scaleLinear()
            .domain([-4, 4]).range([700, 100]);

        let line = d3.line()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))
            .curve(d3.curveNatural);

        let svg = d3.select("#love");

        // =========================================================================================
        //
        // Code adapted from https://observablehq.com/@lemonnish/move-an-svg-icon-along-a-path.
        //
        // =========================================================================================

        /* Draw animation path */
        let path = svg
                    .append("path")
                    .attr("d", line(data))
                    .attr("fill", "none")
                    .attr("stroke", "yellow")
                    .attr("stroke-width", 10);
        
        const tStep = 0.01; // in attr-tween, calc rotation using position at current t and t+tStep

        /* Keep track of value at last position: */
        let pathLength, oldR, r;
        let offsetR = 180, iconSize = 10;  // start position, also used to correct for off-by-180deg error
        
        // draw icon group
        const icon = svg.append("g");
        icon.append("circle")
            .attr("cx",iconSize)
            .attr("cy",iconSize)
            .attr("r", 3)
            .attr("fill", "#fff");
        icon.append("circle")
            .attr("cx",-iconSize)
            .attr("cy",-iconSize)
            .attr("r", 3)
            .attr("fill", "#f00");
        
        svg.append("path")
            .attr("d", `M0,${-iconSize/2}
                        L${iconSize}, ${-iconSize}
                        L${iconSize/2},0
                        L${iconSize},${iconSize}
                        L0,${iconSize/2}
                        L${-iconSize},${iconSize}
                        L${-iconSize/2},0
                        L${-iconSize},${-iconSize}z`)
            .attr("stroke", "#fff")
            .attr("fill", "#f88")
        
        // get the icon's rotation given two points on the path
        // ensure that, from one position to the next, the rotation doesn't change by a large amount
        // (as a result of the atan calculation)
        function getRotation(oldPoint, newPoint) {
            let dx = newPoint.x - oldPoint.x;
            let dy = newPoint.y - oldPoint.y;
            let newR = Math.atan(dy/dx) * 180 / Math.PI + offsetR;

            // prevent icon from flip-flopping across the line
            let diffR = (newR - oldR + 360) % 360;
            if (diffR > 90 && diffR < 270) {
                console.log(offsetR, newR, oldR, diffR)
                newR -= 180;
                offsetR = (offsetR + 180) % 360;  // adjust offset
            }
            return oldR = isNaN(newR) ? oldR : newR;
        }
        
        /* Returns an attrTween for translating along the specified path element. */
        function translateAlong(path) {
            pathLength = path.getTotalLength();
            return function(d, i, a) {
                return function(t) {
                    let p = path.getPointAtLength(t * pathLength);
                    // update rotation (as long as the animation isn't almost over)
                    if (t + tStep <= 1) 
                        r = getRotation(path.getPointAtLength((t+tStep)*pathLength), p);
                    return `translate(${p.x},${p.y})rotate(${r})`;
                };
            };
        }

        /* Animate icon group */
        icon.transition()
            .duration(10000)
            .attrTween("transform", translateAlong(path.node()));
    });

    return (
        <div className="CubicSplineCanvas">
            <center>
                <svg id="love" width="800" height="600"></svg>
            </center>
        </div>
    );
}

export default CubicSplineCanvas;
