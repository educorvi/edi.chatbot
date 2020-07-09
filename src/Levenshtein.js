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
class IllegalArgumentError extends Error{
    constructor(message) {
        super(message);
        this.name="IllegalArgumentError"
    }
}

/**
 * Splits a String in Groups of words
 * @param offset The offset at which the splitting should start; for example if offset equals one, the first word is put in the Array as an entry, for 2 it's the first two words, and so on. Must be smaller than <code>subSize</code>
 * @param string The String to be split
 * @param subSize The Number of words to leave together
 * @return Array of split wordgroups
 */
export function splitSentence(offset, string, subSize) {
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
 * Divides a Sentence in Parts, each having not more than <code>subSize</code> words, sends these to minimal distance and calculates than, which is most likely to be correct
 * @param string The Sentence to be interpreted
 * @param goals Passed to {@link minimalDistance}
 * @param subSize Number of words per subString, defaults to two if undefined. If smaller then 1, this function passes the whole string to {@link minimalDistance} at once
 */
 export function interpretSentence(string, goals, subSize) {
    if (subSize === undefined) {
        subSize = 2;
    }
    if (subSize < 1) {
        return minimalDistance(string, goals);
    }
    for (let o = 0; o < subSize; o++) {
        let subStrings = splitSentence(o, string, subSize);
    }
}

 /**
 * Decides, if word is most likely Yes, No or Maybe (including Variations) and uses language
 * @param word Input of the User
 * @param lang The Language the User is using as two-letter-code
 * @return returns Object in same form as {@link minimalDistance} for <code>goals = ["yes", "no", "maybe"]</code>
 */
export function yesNoMaybe(word, lang) {
    const alternatives = require("./lang/translations/" + lang + ".js")["allAlternatives"];
     //Todo Remove
     interpretSentence(word, alternatives.yes)
    let results = [];
    results.push({distance: minimalDistance(word, alternatives.yes).distance, goal: "yes"});
    results.push({distance: minimalDistance(word, alternatives.no).distance, goal: "no"});
    results.push({distance: minimalDistance(word, alternatives.maybe).distance, goal: "maybe"});
    results.sort((a, b) => a.distance - b.distance)

    let result = results[0];
    if (result.distance === Number.MAX_SAFE_INTEGER) {
        result.goal = invalid.goal;
    }
    return result;
}
