/* eslint-disable no-unused-vars */
const levensthein = require('fast-levenshtein')


/**
 * @param word The Word, that was given as an Input
 * @param goals The Words, which {@code word} will be compared to
 */
export function minimalDistance(word, goals) {
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
        return null;
    }
    console.log(result);
    return result;
}



