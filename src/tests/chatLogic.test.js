/* eslint-disable no-undef,no-unused-vars */
// noinspection ES6PreferShortImport
import {removeGarbage, splitSentence, yesNoMaybe} from "../chatLogic";
import {describe, expect, test} from "@jest/globals";
import testlists from "./testlists";

const STRINGS = {
    garbageString: {
        original: "Sicher bin ich mir da nicht",
        solution: "Sicher nicht"
    },
    oneWord: "hallo",
    short: "Testen ist toll",
    normal1: "Hallo das ist eine ganz fantastische Angelegenheit",
    long1: "Bacon ipsum dolor amet sausage jerky fatback sirloin porchetta picanha cupim landjaeger pork chop salami. Jowl leberkas turducken pig chuck pork chop ground round biltong jerky frankfurter kevin cupim shoulder. Shankle bresaola biltong leberkas pork chop tongue shoulder. Ham hock kielbasa beef ribs, drumstick ribeye rump chuck leberkas flank t-bone swine corned beef burgdoggen."
}

function getAllStrings() {
    let result = [];
    const keys = Object.keys(STRINGS);
    for (const key of keys) {
        result.push(STRINGS[key]);
    }
    return result;
}

describe("split", () => {
    test("Einfach", () => expect(splitSentence(0, STRINGS.short, 2)).toStrictEqual(["Testen ist", "toll"]));
    test("SubSize defaults to two", () => expect(splitSentence(0, STRINGS.normal1, 2)).toStrictEqual(splitSentence(0,STRINGS.normal1)));
    test("SubSize<1 returns input", () => expect(splitSentence(0, STRINGS.normal1, 0)).toStrictEqual([STRINGS.normal1]));
    test("oneWord", () => expect(splitSentence(0, STRINGS.oneWord)).toStrictEqual([STRINGS.oneWord]));
    test("subStrings have right size", () => {
        for (let i = 1; i < 6; i++) {
            for (let o = 0; o < i; o++) {
                for (const word of getAllStrings()) {
                    let res = splitSentence(o, STRINGS.oneWord, i);
                    expect(res.length).toBeGreaterThan(0);
                    for (const re of res) {
                        expect(re.split(" ").length).toBeLessThanOrEqual(i);
                    }
                }
            }
        }
    })
})

describe("yesNoMaybe", () => {
    const list = testlists.yesNoMaybe.de;
    const keys = Object.keys(list);
    for (const key of keys) {
        test(key, () => expect(yesNoMaybe(key, "de")["goal"]).toEqual(list[key]));
    }
});

describe("removeGarbage", () => {
    test("Returns correct String", () => expect(removeGarbage(STRINGS.garbageString.original, "de")).toEqual(STRINGS.garbageString.solution.toLowerCase()))
})
