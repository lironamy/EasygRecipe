function getVibrationPattern(i, patternsStartOne, patternsStartTwo, patternsStartThree, patternsStartFour, hrauselValues, diversityValue) {
    const patterns = [];

    if (i < 10) {
        patterns.push(patternsStartOne * hrauselValues[0]);
    } else if (i >= 10 && i < 20) {
        patterns.push((diversityValue >= 4) ? patternsStartTwo * hrauselValues[0] : patternsStartOne * hrauselValues[0]);
    } else if (i >= 20 && i < 30) {
        patterns.push((diversityValue === 1) ? patternsStartOne * hrauselValues[0] : patternsStartThree * hrauselValues[0]);
    } else if (i >= 30 && i < 40) {
        if (diversityValue === 1) {
            patterns.push(patternsStartOne * hrauselValues[0]);
        } else if (diversityValue === 2) {
            patterns.push(patternsStartThree * hrauselValues[0]);
        } else {
            patterns.push(patternsStartFour * hrauselValues[0]);
        }
    } else if (i >= 40 && i < 49) {
        patterns.push(patternsStartOne * hrauselValues[0]);
    } else if (i >= 49 && i < 59) {
        patterns.push((diversityValue >= 4) ? patternsStartTwo * hrauselValues[0] : patternsStartOne * hrauselValues[0]);
    } else if (i >= 59 && i < 69) {
        patterns.push((diversityValue === 1) ? patternsStartOne * hrauselValues[0] : patternsStartThree * hrauselValues[0]);
    } else if (i >= 69 && i < 79) {
        if (diversityValue === 1) {
            patterns.push(patternsStartOne * hrauselValues[0]);
        } else if (diversityValue === 2) {
            patterns.push(patternsStartThree * hrauselValues[0]);
        } else {
            patterns.push(patternsStartFour * hrauselValues[0]);
        }
    } else if (i >= 79 && i < 89) {
        patterns.push(patternsStartOne * hrauselValues[0]);
    } else if (i >= 89 && i < 99) {
        patterns.push((diversityValue >= 4) ? patternsStartTwo * hrauselValues[0] : patternsStartOne * hrauselValues[0]);
    } else if (i >= 99 && i < 110) {
        patterns.push((diversityValue === 1) ? patternsStartOne * hrauselValues[0] : patternsStartThree * hrauselValues[0]);
    } else if (i >= 110 && i < 120) {
        if (diversityValue === 1) {
            patterns.push(patternsStartOne * hrauselValues[0]);
        } else if (diversityValue === 2) {
            patterns.push(patternsStartThree * hrauselValues[0]);
        } else {
            patterns.push(patternsStartFour * hrauselValues[0]);
        }
    } else {
        patterns.push(''); // Empty for other rows
    }

    return patterns;
}

module.exports = { getVibrationPattern };