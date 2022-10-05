/* Helper functions */
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function binarySearch(a, key) {
    let low = 0;
    let high = a.length - 1;
    while (low <= high) {
        const mid = (low + high) >>> 1;
        const midVal = a[mid];
        if (midVal < key) {
            low = mid + 1;
        }
        else if (midVal > key) {
            high = mid - 1;
        }
        else if (midVal == key) {
            return mid;
        }
        else {
            throw new Error("Invalid number encountered in binary search.");
        }
    }
    return -(low + 1);
}

function evaluatePoly(c, x) {
    const n = c.length;
    if (n == 0) {
        return 0;
    }
    let v = c[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        v = x * v + c[i];
    }
    return v;
}

function evaluatePolySegment(arrX, segmentCoeffs, x) {
    let i = binarySearch(arrX, x);
    if (i < 0) {
        i = -i - 2;
    }
    i = Math.max(0, Math.min(i, segmentCoeffs.length - 1));
    return evaluatePoly(segmentCoeffs[i], x - arrX[i]);
}

function trimPoly(c) {
    let n = c.length;
    while (n > 1 && c[n - 1] == 0) {
        n--;
    }
    return (n == c.length) ? c : c.subarray(0, n);
}

/**
 * This function calculates coeffecients for the natural cubic spline function.
 */
 function coefficients(arrX, arrY) {
    const n = arrX.length - 1;
    const h = new Float64Array(n);
    for (let i = 0; i < n; i++) {
        h[i] = arrX[i + 1] - arrX[i];
    }
    const mu = new Float64Array(n);
    const z = new Float64Array(n + 1);
    mu[0] = 0;
    z[0] = 0;
    for (let i = 1; i < n; i++) {
        const g = 2 * (arrX[i + 1] - arrX[i - 1]) - h[i - 1] * mu[i - 1];
        mu[i] = h[i] / g;
        z[i] = (3 * (arrY[i + 1] * h[i - 1] - arrY[i] * (arrX[i + 1] - arrX[i - 1]) + arrY[i - 1] * h[i]) /
            (h[i - 1] * h[i]) - h[i - 1] * z[i - 1]) / g;
    }
    const b = new Float64Array(n);
    const c = new Float64Array(n + 1);
    const d = new Float64Array(n);
    z[n] = 0;
    c[n] = 0;
    for (let i = n - 1; i >= 0; i--) {
        const dx = h[i];
        const dy = arrY[i + 1] - arrY[i];
        c[i] = z[i] - mu[i] * c[i + 1];
        b[i] = dy / dx - dx * (c[i + 1] + 2 * c[i]) / 3;
        d[i] = (c[i + 1] - c[i]) / (3 * dx);
    }
    const segmentCoeffs = new Array(n);
    for (let i = 0; i < n; i++) {
        const coeffs = new Float64Array(4);
        coeffs[0] = arrY[i];
        coeffs[1] = b[i];
        coeffs[2] = c[i];
        coeffs[3] = d[i];
        segmentCoeffs[i] = trimPoly(coeffs);
    }
    return segmentCoeffs;
}


class NaturalCubicSpline {
    /**
     * This class encapsulates the basic functionalities to interpolate a natural cubic spline, given a 
     * list of (x,y) coordinates.
     * 
     * Pre-condition:
     *      - The inputted parameters arrX and arrY must have the same length.
     *      - Each arrX and arrY array must contain at least 3 elements.
     *      - Both arrX and arrY must contain only numerical values.
     * 
     * @param {float[]} arrX - An array of float numbers representing the x-coordinates.
     * @param {float[]} arrY - An array of float numbers representing the y-coordinates.
     * 
     * 
     * Code adopted from https://www.source-code.biz/snippets/typescript/akima/.
     */
    constructor(arrX, arrY) {
        assert(arrX.length === arrY.length, "The inputted parameters 'arrX' and 'arrY' must have the same length.");
        assert(arrX.length > 2, "At least three (x,y) coordinates are required to interpolate a natural cubic spline.");
        assert(arrX.every(x => typeof x === 'number') && arrY.every(y => typeof y === 'number'), "Both 'arrX' and 'arrY' arrays must contain only numerical values.");

        this.arrX = arrX;
        this.arrY = arrY;
    }
    
    interpolate() {
        const segmentCoeffs = coefficients(this.arrX, this.arrY);
        const arrXCopy = Float64Array.from(this.arrX);
        return (x) => evaluatePolySegment(arrXCopy, segmentCoeffs, x);
    }
}

export default NaturalCubicSpline;
