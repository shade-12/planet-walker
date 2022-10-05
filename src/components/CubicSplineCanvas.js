import React from "react";

// Interpolator module import
import NaturalCubicSpline from '../utils/NaturalCubicSpline';

function CubicSplineCanvas() {
    let x = [0,1,2,3,4,5,6];
    let y = [1,3,8,10,9,-1,-17];
    let cs = new NaturalCubicSpline(x,y);
    let coef = cs.interpolate();
    for (let i = 0; i < coef.length; i++) {
        console.log(coef[i]);
    }

    return (
        <div className="CubicSplineCanvas">
            Cubic spline canvas bruh
        </div>
    );
}

export default CubicSplineCanvas;