var PWGen = function(maxLength, includeCapitalLetter, includeNumber, includeSpecial) {
    this.maxLength = maxLength || 16;
    this.includeCapitalLetter = !!includeCapitalLetter;
    this.includeNumber = !!includeNumber;
    this.includeSpecial = !!includeSpecial;
}

PWGen.prototype = {

    generate0: function() {
        var result = "";
        var prev = 0;
        var isFirst = true;

        var requested = 0;
        if (this.includeCapitalLetter) {
            requested |= this.INCLUDE_CAPITAL_LETTER;
        }

        if (this.includeNumber) {
            requested |= this.INCLUDE_NUMBER;
        }

        if (this.includeSpecial) {
            requested |= this.INCLUDE_SPECIAL;
        }

        var shouldBe = (Math.random() < 0.5) ? this.VOWEL : this.CONSONANT;

        while (result.length < this.maxLength) {
            i = Math.floor((this.ELEMENTS.length - 1) * Math.random());
            str = this.ELEMENTS[i][0];
            flags = this.ELEMENTS[i][1];

            /* Filter on the basic type of the next element */
            if ((flags & shouldBe) == 0)
                continue;
            /* Handle the NOT_FIRST flag */
            if (isFirst && (flags & this.NOT_FIRST))
                continue;
            /* Don't allow VOWEL followed a Vowel/Dipthong pair */
            if ((prev & this.VOWEL) && (flags & this.VOWEL) && (flags & this.DIPTHONG))
                continue;
            /* Don't allow us to overflow the buffer */
            if ( (result.length + str.length) > this.maxLength)
                continue;


            if (requested & this.INCLUDE_CAPITAL_LETTER) {
                if ((isFirst || (flags & this.CONSONANT)) &&
                    (Math.random() > 0.3)) {
                    str = str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
                    (Math.random() < 0.3) && (requested &= ~this.INCLUDE_CAPITAL_LETTER);
                }
            }

            /*
             * OK, we found an element which matches our criteria,
             * let's do it!
             */
            result += str;


            if (requested & this.INCLUDE_NUMBER) {
                if (!isFirst && (Math.random() < 0.3)) {
                    if ( (result.length + str.length) > this.maxLength)
                        result = result.slice(0,-1);
                    result += Math.floor(10 * Math.random()).toString();
                    (Math.random() < 0.5) && (requested &= ~this.INCLUDE_NUMBER);

                    isFirst = true;
                    prev = 0;
                    shouldBe = (Math.random() < 0.5) ? this.VOWEL : this.CONSONANT;
                    continue;
                }
            }


            if (requested & this.INCLUDE_SPECIAL) {
                if (!isFirst && (Math.random() < 0.3)) {
                    if ( (result.length + str.length) > this.maxLength)
                        result = result.slice(0,-1);
                var possible = "!@#$^*()-_+?=./:',";
                result += possible.charAt(Math.floor(Math.random() * possible.length));
                (Math.random() < 0.5) && (requested &= ~this.INCLUDE_SPECIAL);

                    isFirst = true;
                    prev = 0;
                    shouldBe = (Math.random() < 0.5) ? this.VOWEL : this.CONSONANT;
                    continue;
                }
            }

            /*
             * OK, figure out what the next element should be
             */
            if (shouldBe == this.CONSONANT) {
                shouldBe = this.VOWEL;
            } else { /* should_be == VOWEL */
                if ((prev & this.VOWEL) ||
                    (flags & this.DIPTHONG) || (Math.random() > 0.3)) {
                    shouldBe = this.CONSONANT;
                } else {
                    shouldBe = this.VOWEL;
                }
            }
            prev = flags;
            isFirst = false;
        }

        if (requested & (this.INCLUDE_NUMBER | this.INCLUDE_SPECIAL | this.INCLUDE_CAPITAL_LETTER))
            return null;

        return result;
    },

    generate: function() {
        var result = null;

        while (! result)
            result = this.generate0();

        return result;
    },

    INCLUDE_NUMBER: 1,
    INCLUDE_SPECIAL: 1 << 1 << 1,
    INCLUDE_CAPITAL_LETTER: 1 << 1,

    CONSONANT: 1,
    VOWEL:     1 << 1,
    DIPTHONG:  1 << 2,
    NOT_FIRST: 1 << 3
};

PWGen.prototype.ELEMENTS = [
    [ "a",  PWGen.prototype.VOWEL ],
    [ "ae", PWGen.prototype.VOWEL | PWGen.prototype.DIPTHONG ],
    [ "ah", PWGen.prototype.VOWEL | PWGen.prototype.DIPTHONG ],
    [ "ai", PWGen.prototype.VOWEL | PWGen.prototype.DIPTHONG ],
    [ "b",  PWGen.prototype.CONSONANT ],
    [ "c",  PWGen.prototype.CONSONANT ],
    [ "ch", PWGen.prototype.CONSONANT | PWGen.prototype.DIPTHONG ],
    [ "d",  PWGen.prototype.CONSONANT ],
    [ "e",  PWGen.prototype.VOWEL ],
    [ "ee", PWGen.prototype.VOWEL | PWGen.prototype.DIPTHONG ],
    [ "ei", PWGen.prototype.VOWEL | PWGen.prototype.DIPTHONG ],
    [ "f",  PWGen.prototype.CONSONANT ],
    [ "g",  PWGen.prototype.CONSONANT ],
    [ "gh", PWGen.prototype.CONSONANT | PWGen.prototype.DIPTHONG | PWGen.prototype.NOT_FIRST ],
    [ "h",  PWGen.prototype.CONSONANT ],
    [ "i",  PWGen.prototype.VOWEL ],
    [ "ie", PWGen.prototype.VOWEL | PWGen.prototype.DIPTHONG ],
    [ "j",  PWGen.prototype.CONSONANT ],
    [ "k",  PWGen.prototype.CONSONANT ],
    [ "l",  PWGen.prototype.CONSONANT ],
    [ "m",  PWGen.prototype.CONSONANT ],
    [ "n",  PWGen.prototype.CONSONANT ],
    [ "ng", PWGen.prototype.CONSONANT | PWGen.prototype.DIPTHONG | PWGen.prototype.NOT_FIRST ],
    [ "o",  PWGen.prototype.VOWEL ],
    [ "oh", PWGen.prototype.VOWEL | PWGen.prototype.DIPTHONG ],
    [ "oo", PWGen.prototype.VOWEL | PWGen.prototype.DIPTHONG],
    [ "p",  PWGen.prototype.CONSONANT ],
    [ "ph", PWGen.prototype.CONSONANT | PWGen.prototype.DIPTHONG ],
    [ "qu", PWGen.prototype.CONSONANT | PWGen.prototype.DIPTHONG],
    [ "r",  PWGen.prototype.CONSONANT ],
    [ "s",  PWGen.prototype.CONSONANT ],
    [ "sh", PWGen.prototype.CONSONANT | PWGen.prototype.DIPTHONG],
    [ "t",  PWGen.prototype.CONSONANT ],
    [ "th", PWGen.prototype.CONSONANT | PWGen.prototype.DIPTHONG],
    [ "u",  PWGen.prototype.VOWEL ],
    [ "v",  PWGen.prototype.CONSONANT ],
    [ "w",  PWGen.prototype.CONSONANT ],
    [ "x",  PWGen.prototype.CONSONANT ],
    [ "y",  PWGen.prototype.CONSONANT ],
    [ "z",  PWGen.prototype.CONSONANT ],
];

function _pwgen_gen_prompt(a, b, c, d){
    while(prompt('',(new PWGen(a, b, c, d)).generate()) === null){};
}

_pwgen_gen_prompt(16, 1, 1, 1);
