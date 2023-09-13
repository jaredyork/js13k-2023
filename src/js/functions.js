/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function randArb(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function array2d(numcols, numrows, initial) {
    var arr = [];
    for (let x = 0; x < numcols; x++) {
        let col = [];

        for (let y = 0; y < numrows; y++) {
            col.push(initial);
        }

        arr.push(col);
    }
    return arr;
}
