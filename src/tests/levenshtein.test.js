/* eslint-disable no-undef,no-unused-vars */
import {splitSentence} from "../Levenshtein";
import {describe, expect, test} from "@jest/globals";

const STRINGS = {
    oneWord: "hallo",
    short: "Testen ist toll",
    normal1: "Hallo das ist eine ganz fantastische Angelegenheit",
    long1: "Zweifellos verdient das Anliegen der ADL, die auch Bürgerwehren, Verschwörungsideologen, Impfgegner und Leugner des Klimawandels und des Holocausts nicht mehr auf Facebook sehen will, volle Unterstützung - nicht nur in den USA. Denn da es um den Schutz von Menschenrechten geht, hat der Protest auch eine internationale Dimension. Ob Weltkonzerne wie Coca-Cola, Unilever, Ford, Hewlett Packard und Honda, aber auch deutsche Unternehmen wie SAP, Volkswagen, Bayer, Henkel oder Siemens den Facebook-Boykott aus Überzeugung unterstützen, ist allerdings fraglich."
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
                const words = getAllStrings();
                for (const word of words) {
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
