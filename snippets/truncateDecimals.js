  
// https://stackoverflow.com/questions/4912788/truncate-not-round-off-decimal-numbers-in-javascript/4912870
function truncateDecimals (number, digits) {
    let multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};


