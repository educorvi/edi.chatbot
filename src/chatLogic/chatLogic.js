/* eslint-disable no-unused-vars */
const levensthein = require('fast-levenshtein')

import defaultTranslations from "./lang"

/**
 * Loads and sets translations
 * @type {object}
 */
let translations = defaultTranslations;

/**
 * Indicates, that no decision could be made
 * @type {{goal: string, distance: number}}
 */

const invalid = {distance: Number.MAX_SAFE_INTEGER, goal: "unknown"};
/**
 * Highest tolerated Distance for Levenshtein
 * @type {number}
 */
const tolerance = 3;


/**
 * Searchs through Array, to find the word that is closest to the word given as parameter
 * @param {string} word The Word, that was given as an Input
 * @param {string[]} goals The Words, which <code>word</code> will be compared to
 * @param {number} maxdistance The maximal levensthein distance that the word may have. Defaults to {@link tolerance}
 * @return {{distance: number, goal: string}} Returns an Object containing the closest word and its distance. If no word is found, the method returns {@link invalid}
 */
export function minimalDistance(word, goals, maxdistance = tolerance) {
    if (word.length <= 0) {
        return invalid;
    }
    let result = invalid;
    for (const goal of goals) {
        let d = levensthein.get(word.toLowerCase(), goal.toLowerCase());
        if (d < result.distance) {
            result = {
                distance: d,
                goal
            }
        }

    }
    if (result.distance > maxdistance) {
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

/**
 * Calculates the Sum of an Array
 * @param {Number[]} array to be reduced
 * @return {number} sum
 */
function arraySum(array) {
    const reducer = (accumulator, current) => accumulator + current;
    return array.reduce(reducer);
}

/**
 * Splits a String in Groups of words
 * @param {number} offset The offset at which the splitting should start; for example if offset equals one, the first word is put in the Array as an entry, for 2 it's the first two words, and so on. Must be smaller than <code>subSize</code>
 * @param {string} string The String to be split
 * @param {number} subSize The Number of words to leave together. Defaults to two if undefined, if smaller then one, <code>string</code> will be returned
 * @return {string[]} Array of split wordgroups
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
 * Divides a Sentence in Parts, each having not more than <code>subSize</code> words, sends these to minimal distance and calculates than, which is most likely to be correct
 * Uses the formula described <a href="https://doku.educorvi.de/educorvi/chatbot/entscheidungsfindung">here</a><br>
 * <img style="max-width: 90%; width: 500px" src="https://doku.educorvi.de/educorvi/chatbot/gleichung.png">
 * @param {string} string The Sentence to be interpreted
 * @param {string[]|Array<Array<string>>} goals An Array containing the words or containing arrays with alternatives in it. One dimensional Array will automatically be put in two Dimensions
 * @param {number} maxdistance The maximal levensthein distance that the word may have. Defaults to {@link tolerance}
 * @return {number} Returns Index of the Entry that is most likely
 */
export function interpretSentence(string, goals, maxdistance = tolerance) {
    function recHelperInterpretSentence(subSize) {
        let results = [];
        for (let i = 0; i < goals.length; i++) {
            let lResults = [];
            const goal = goals[i];
            for (let o = 0; o < subSize; o++) {
                let subStrings = splitSentence(o, string, subSize);
                for (const subString of subStrings) {
                    let ld = minimalDistance(subString, goal, maxdistance);
                    if (ld !== invalid) {
                        lResults.push(ld);
                    }
                }
            }
            results.push(lResults);
        }
        if (subSize > 0) {
            const results2 = recHelperInterpretSentence(subSize - 1);
            for (let i = 0; i < results2.length; i++) {
                for (let result of results2[i]) {
                    results[i].push(result);
                }
            }
        }
        return results;
    }

    if (!goals || goals.length < 1) {
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
    let results = recHelperInterpretSentence(subSize);

    let points = [goals.length];
    for (let i = 0; i < results.length; i++) {
        points[i] = 0;
        for (let result of results[i]) {
            points[i] += (result.goal.split(" ").length / (result.distance + (subSize - result.goal.split(" ").length) * 1.2));
        }
    }

    console.log(results);
    console.log(points);

    let retI = 0;
    for (let i = 0; i < points.length; i++) {
        if (points[i] > points[retI]) {
            retI = i;
        }
    }
    for (let i = 0; i < points.length; i++) {
        if (points[i] === points[retI] && i !== retI) {
            return NaN;
        }
    }
    if (results.length === 0 || arraySum(points) === 0) {
        return NaN;
    }

    return retI;

}

/**
 * Adds or overrides translations
 * @param trans An object containing the translations to be added in the same format as in the default lang files
 */
export function addTranslations(trans) {
    for (const key of Object.keys(trans)) {
        if (!trans[key].garbage) {
            throw new IllegalArgumentError(`Translation "${key}" is missing garbage property`);
        }
    }
    translations = {...translations, ...trans};
}

/**
 * Removes unnecessary words from string. Unnecessary words are to be defined in the language files as Array named garbage
 * @param {string} string String to be shortened
 * @param {string} lang language the string is in
 * @return {string} String with removed Words
 */
export function removeGarbage(string, lang) {
    string = string.toLowerCase();
    const keywords = translations[lang]["garbage"];
    const regExp = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'g');
    return (string || "").replace(regExp, '').replace(/[ ]{2,}/, ' ');
}

/**
 * Decides, if word is most likely Yes, No or Maybe (including Variations) and uses language
 * @param {string} word Input of the User
 * @param {string} lang The Language the User is using as two-letter-code
 * @return {{distance: number, goal: string}} Decides if yes, no or maybe was most likely meant
 */
export function yesNoMaybe(word, lang) {
    if (!translations[lang]["allAlternatives"]) {
        throw new IllegalArgumentError(`Translation of "allAlternatives" for language "${lang}" doesn't exist`);
    }
    let alternatives = translations[lang]["allAlternatives"];


    const keys = Object.keys(alternatives);
    const values = Object.values(alternatives);
    const index = interpretSentence(removeGarbage(word, lang), values);
    if (isNaN(index)) {
        return invalid;
    }
    const key = keys[index];
    return {distance: NaN, goal: key};
}
