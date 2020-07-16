/* eslint-disable no-unused-vars */
const levensthein = require('fast-levenshtein')
const invalid = {distance: Number.MAX_SAFE_INTEGER, goal: "unknown"};
/**
 * Highest tolerated Distance for Levenshtein
 * @type {number}
 */
const tolerance = 3;


/**
 * Searchs through Array, to find the word that is closest to the word given as parameter
 * @param word The Word, that was given as an Input
 * @param goals The Words, which <code>word</code> will be compared to
 * @return Returns an Object containing the closest word and its distance to the entered word in form of <code>{distance: Number, goal: String}</code>. If no word is found, the method returns {@link invalid}
 */
export function minimalDistance(word, goals) {
    if (word.length <= 0) {
        return invalid;
    }
    let result = {
        distance: Number.MAX_SAFE_INTEGER
    };
    for (const goal of goals) {
        let d = levensthein.get(word, goal);
        if (d < result.distance) {
            result = {
                distance: d,
                goal
            }
        }

    }
    if (result.distance > tolerance) {
        return invalid;
    }
    return result;
}


/**
 * Indicates that an Invalid Argument was given
 */
class IllegalArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = "IllegalArgumentError"
    }
}

function arraySum(array) {
    let ret = 0;
    for (const arrayElement of array) {
        ret += arrayElement;
    }
    return ret;
}

/**
 * Splits a String in Groups of words
 * @param offset The offset at which the splitting should start; for example if offset equals one, the first word is put in the Array as an entry, for 2 it's the first two words, and so on. Must be smaller than <code>subSize</code>
 * @param string The String to be split
 * @param subSize The Number of words to leave together. Defaults to two if undefined, if smaller then one, <code>string</code> will be returned
 * @return Array of split wordgroups
 */
export function splitSentence(offset, string, subSize) {
    if (subSize === undefined) {
        subSize = 2;
    }
    if (subSize < 1) {
        return [string];
    }
    const split = string.split(" ");
    if (offset >= subSize) {
        throw new IllegalArgumentError("offset must be smaller then subSize");
    }
    const subStrings = [];
    let preString = [];
    for (let i = 0; i < offset; i++) {
        preString.push(split[i]);
    }
    if (preString.length > 0) {
        subStrings.push(preString.join(" "));
    }
    for (let i = offset; i < split.length; i += subSize) {
        let subString = [];
        subString.push(split[i]);
        for (let b = 1; b < subSize; b++) {
            if ((i + b) < split.length) {
                subString.push(split[i + b]);
            }
        }
        subStrings.push(subString.join(" "));
    }
    return subStrings;
}

/**
 * helper for recursion of {@link interpretSentence}. Not for external usage
 */
function recHelperInterpretSentence(goals, subSize, string) {
    let results = [];
    for (let i = 0; i < goals.length; i++) {
        let lResults = [];
        const goal = goals[i];
        for (let o = 0; o < subSize; o++) {
            let subStrings = splitSentence(o, string, subSize);
            for (const subString of subStrings) {
                let ld = minimalDistance(subString, goal);
                if (ld !== invalid) {
                    lResults.push(ld);
                }
            }
        }
        results.push(lResults);
    }
    if (subSize > 0) {
        const results2 = recHelperInterpretSentence(goals, subSize - 1, string);
        for (let i = 0; i < results2.length; i++) {
            for (let result of results2[i]) {
                results[i].push(result);
            }
        }
    }
    return results;
}

/**
 * Divides a Sentence in Parts, each having not more than <code>subSize</code> words, sends these to minimal distance and calculates than, which is most likely to be correct
 * Uses the formula described <a href="">here</a>
 * @param string The Sentence to be interpreted
 * @param goals An Array containing the words or containing arrays with alternatives in it
 * @return Returns Index of the Entry that is most likely
 */
export function interpretSentence(string, goals) {
    if (goals.length < 1) {
        throw new IllegalArgumentError("goals must not be empty!")
    }
    for (let i = 0; i < goals.length; i++) {
        if (typeof (goals[i]) === "string") {
            goals[i] = [goals[i]];
        }
    }
    let subSize = 1;
    for (const goal of goals) {
        for (const goalElement of goal) {
            if (goalElement.split(" ").length > subSize) {
                subSize = goalElement.split(" ").length;
            }
        }
    }
    console.log(subSize)
    let results = recHelperInterpretSentence(goals, subSize, string);

    let points = [goals.length];
    for (let i = 0; i < results.length; i++) {
        points[i] = 0;
        for (let result of results[i]) {
            points[i] += (1 / (result.distance + (subSize-result.goal.split(" ").length)*0.1));
        }
    }

    let retI = 0;
    for (let i = 0; i < points.length; i++) {
        if (points[i] > points[retI]) {
            retI = i;
        }
    }
    if (results.length === 0 || arraySum(points)===0) {
        return NaN;
    }
    console.log(results)

    return retI;

}

/**
 * Decides, if word is most likely Yes, No or Maybe (including Variations) and uses language
 * @param word Input of the User
 * @param lang The Language the User is using as two-letter-code
 * @return returns Object in same form as {@link minimalDistance} for <code>goals = ["yes", "no", "maybe"]</code>
 */
export function yesNoMaybe(word, lang) {
    const alternatives = require("./lang/translations/" + lang + ".js")["allAlternatives"];
    const keys = Object.keys(alternatives);
    const values = Object.values(alternatives);
    const index = interpretSentence(word, values, 2);
    if (isNaN(index)) {
        return invalid;
    }
    const key = keys[index];
    return {distance: NaN, goal: key};


}
