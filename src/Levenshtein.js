/* eslint-disable no-unused-vars */
const levensthein = require('fast-levenshtein')
const invalid = {distance: Number.MAX_SAFE_INTEGER, goal: "unknown"};


/**
 * Searchs through Array, to find the word that is closest to the word given as parameter
 * @param word The Word, that was given as an Input
 * @param goals The Words, which {@code word} will be compared to
 * @return Returns an Object containing the closest word and its distance to the entered word in form of {@code {distance: Number, goal: String}}. If no word is found, the method returns {@link invalid}
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
    if (result.distance > 5) {
        return invalid;
    }
    return result;
}

/**
 * Decides, if word is most likely Yes, No or Maybe (including Variations) and uses language
 * @param word Input of the User
 * @param lang The Language the User is using as two-letter-code
 * @return returns Object in same form as {@link minimalDistance} where goal is {@code "yes"},{@code "no"} or {@code "maybe"}
 */
export function yesNoMaybe(word, lang) {
    const alternatives = require("./lang/translations/" + lang + ".js")["allAlternatives"];
    let results = [];
    results.push({ distance: minimalDistance(word, alternatives.yes).distance, goal: "yes"});
    results.push({ distance: minimalDistance(word, alternatives.no).distance, goal: "no"});
    results.push({ distance: minimalDistance(word, alternatives.maybe).distance, goal: "maybe"});
    results.sort((a, b) => a.distance-b.distance)

    let result = results[0];
    if (result.distance === Number.MAX_SAFE_INTEGER) {
        result.goal = null;
    }
    return result;
}
