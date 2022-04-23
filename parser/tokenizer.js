const testString = () => {
    // 遇到引号，开始解析字符串
    let s1 = String.raw`"name"`;
    let s2 = String.raw`"name",`;
    let s3 = String.raw`"name\',"`;
    let s4 = String.raw`'name\ns4'`;
    let s5 = String.raw`"s5\b"`;
    let s6 = String.raw`"s6\t\""`;
    let s7 = '"gua\nxiao", 123'; // x是变量
    let s8 = '"-20"';

    ensure(equals(toTokens(s1), ["name", ";"]), "test string element 1");
    ensure(equals(toTokens(s2), ["name", ",", ";"]), "test string element 2");
    ensure(equals(toTokens(s3), ["name',", ";"]), "test string element 3");
    ensure(equals(toTokens(s4), ["name\ns4", ";"]), "test string element 4");
    ensure(equals(toTokens(s5), ["s5\b", ";"]), "test string element 5");
    ensure(equals(toTokens(s6), ['s6\t"', ";"]), "test string element 6");
    ensure(
        equals(toTokens(s7), ["gua\nxiao", ",", 123, ";"]),
        "test string element 7"
    );
    ensure(equals(toTokens(s8), ["-20", ";"]), "test string element 8");
};

const testNumber = () => {
    let s1 = "10";
    let s2 = "10]";
    let s3 = "10}";
    let s4 = "-10}";
    let s5 = "-1.0}";
    let s6 = "0b0101}";
    let s7 = "0x189DF1}";

    ensure(equals(toTokens(s1), [10, ";"]), "test testNumber 1");
    ensure(equals(toTokens(s2), [10, "]", ";"]), "test testNumber 2");
    ensure(equals(toTokens(s3), [10, "}", ";"]), "test testNumber 3");
    ensure(equals(toTokens(s4), [-10, "}", ";"]), "test testNumber 4");
    ensure(equals(toTokens(s5), [-1.0, "}", ";"]), "test testNumber 5");
    ensure(equals(toTokens(s6), [0b0101, "}", ";"]), "test testNumber 6");
    ensure(equals(toTokens(s7), [0x189df1, "}", ";"]), "test testNumber 7");
};

const testKeyword = () => {
    let s1 = `true`;
    let s2 = `false`;
    // var a 中的「test」需要做一个单独的函数来处理，我的函数名是：variableEnd
    let s3 = `var test`;
    let s4 = `const test`;
    let s5 = `if`;
    let s6 = `else`;
    let s7 = `while`;
    let s8 = `for()`;
    let s9 = `function()`;
    let s10 = `null`;
    let s11 = `return`;
    let s12 = `class`;

    ensure(equals(toTokens(s1), [true, ";"]), "test keyword 1");
    ensure(equals(toTokens(s2), [false, ";"]), "test keyword 2");
    ensure(equals(toTokens(s3), ["var", "test", ";"]), "test keyword 3");
    ensure(equals(toTokens(s4), ["const", "test", ";"]), "test keyword 4");
    ensure(equals(toTokens(s5), ["if", ";"]), "test keyword 5");
    ensure(equals(toTokens(s6), ["else", ";"]), "test keyword 6");
    ensure(equals(toTokens(s7), ["while", ";"]), "test keyword 7");
    ensure(equals(toTokens(s8), ["for", "(", ")", ";"]), "test keyword 8");
    ensure(equals(toTokens(s9), ["function", "(", ")", ";"]), "test keyword 9");
    ensure(equals(toTokens(s10), [null, ";"]), "test keyword 10");
    ensure(equals(toTokens(s11), ["return", ";"]), "test keyword 11");
    ensure(equals(toTokens(s12), ["class", ";"]), "test keyword 12");
};

const testLogicSymbol = () => {
    // 逻辑运算符
    let s1 = `a == b`;
    let s2 = `1 != 2`;
    let s3 = `2 > 1`;
    let s4 = `1 < 2`;
    let s5 = `1 >= 1`;
    let s6 = `1 <= 1`;
    let s7 = `and`;
    let s8 = `or`;
    let s9 = "not";

    ensure(equals(toTokens(s1), ["a", "==", "b", ";"]), "test LogicSymbol 1");
    ensure(equals(toTokens(s2), [1, "!=", 2, ";"]), "test LogicSymbol 2");
    ensure(equals(toTokens(s3), [2, ">", 1, ";"]), "test LogicSymbol 3");
    ensure(equals(toTokens(s4), [1, "<", 2, ";"]), "test LogicSymbol 4");
    ensure(equals(toTokens(s5), [1, ">=", 1, ";"]), "test LogicSymbol 5");
    ensure(equals(toTokens(s6), [1, "<=", 1, ";"]), "test LogicSymbol 6");
    ensure(equals(toTokens(s7), ["and", ";"]), "test LogicSymbol 7");
    ensure(equals(toTokens(s8), ["or", ";"]), "test LogicSymbol 8");
    ensure(equals(toTokens(s9), ["not", ";"]), "test LogicSymbol 9");
};

const testCalculator = () => {
    // 逻辑运算符
    let s1 = `1 + 2`;
    let s2 = `3 - 2`;
    let s3 = `2 * 1`;
    let s4 = `% `;
    let s5 = `/ `;
    let s6 = `- 124124`;
    let s7 = "+= 1";
    let s8 = "-= 1";
    let s9 = "a -= 1";
    let s10 = "a *= 1";
    let s11 = "a /= 1";
    let s12 = "a %= 1";

    ensure(equals(toTokens(s1), [1, "+", 2, ";"]), "test Calculator 1");
    ensure(equals(toTokens(s2), [3, "-", 2, ";"]), "test Calculator 2");
    ensure(equals(toTokens(s3), [2, "*", 1, ";"]), "test Calculator 3");
    ensure(equals(toTokens(s4), ["%", ";"]), "test Calculator 4");
    ensure(equals(toTokens(s5), ["/", ";"]), "test Calculator 5");
    ensure(equals(toTokens(s6), ["-", 124124, ";"]), "test Calculator 6");
    ensure(equals(toTokens(s7), ["+=", 1, ";"]), "test Calculator 7");
    ensure(equals(toTokens(s8), ["-=", 1, ";"]), "test Calculator 8");

    ensure(equals(toTokens(s9), ["a", "-=", 1, ";"]), "test Calculator 9");
    ensure(equals(toTokens(s10), ["a", "*=", 1, ";"]), "test Calculator 10");
    ensure(equals(toTokens(s11), ["a", "/=", 1, ";"]), "test Calculator 11");
    ensure(equals(toTokens(s12), ["a", "%=", 1, ";"]), "test Calculator 12");
};

const testVariable = () => {
    let s1 = `var a = 123`;
    let s2 = `const b = 222`;
    let s3 = `const c = '123'`;

    ensure(
        equals(toTokens(s1), ["var", "a", "=", 123, ";"]),
        "test variable 1"
    );
    ensure(
        equals(toTokens(s2), ["const", "b", "=", 222, ";"]),
        "test variable 2"
    );
    ensure(
        equals(toTokens(s3), ["const", "c", "=", "123", ";"]),
        "test variable 3"
    );
};

const testGualangCode = () => {
    let s0 = `
        const a = 1
    `;
    let expect0 = ["const", "a", "=", 1, ";"];
    ensure(equals(toTokens(s0), expect0), "test variable 0");

    let s1 = `const demoIf = function()`;
    let expect1 = ["const", "demoIf", "=", "function", "(", ")", ";"];
    ensure(equals(toTokens(s1), expect1), "test variable 1");

    let s2 = `var grade = 3`;
    let expect2 = ["var", "grade", "=", 3, ";"];
    ensure(equals(toTokens(s2), expect2), "test variable 2");

    let s3 = `if (1 > 2) {
        log('条件成立')
    }`;
    // 加分号测试，parser不解析分号
    let expect3 = [
        "if",
        "(",
        1,
        ">",
        2,
        ")",
        "{",
        ";",
        "log",
        "(",
        "条件成立",
        ")",
        ";",
        "}",
        ";",
    ];
    ensure(equals(toTokens(s3), expect3), "test variable 3");

    let s4 = `
        if (1 > 2) {
            log('条件成立')
        } else {
            hello(1)
        }
    `;
    let expect4 = [
        "if",
        "(",
        1,
        ">",
        2,
        ")",
        "{",
        ";",
        "log",
        "(",
        "条件成立",
        ")",
        ";",
        "}",
        "else",
        "{",
        ";",
        "hello",
        "(",
        1,
        ")",
        ";",
        "}",
        ";",
    ];
    ensure(equals(toTokens(s4), expect4), "test variable 4");

    let s5 = `
    var n2 = 1
    var a = 123
    var fun = '14hh'
    if (n2 % 2 == 0) {
        log('偶数')
    } else {
        log('奇数')
    }`;
    let expect5 = [
        "var",
        "n2",
        "=",
        1,
        ";",
        "var",
        "a",
        "=",
        123,
        ";",
        "var",
        "fun",
        "=",
        "14hh",
        ";",
        "if",
        "(",
        "n2",
        "%",
        2,
        "==",
        0,
        ")",
        "{",
        ";",
        "log",
        "(",
        "偶数",
        ")",
        ";",
        "}",
        "else",
        "{",
        ";",
        "log",
        "(",
        "奇数",
        ")",
        ";",
        "}",
        ";",
    ];
    ensure(equals(toTokens(s5), expect5), "test variable 5");

    let s6 = `
        "abcabcabc".replace("abc", "gua")
    `;
    let expect6 = [
        "abcabcabc",
        ".",
        "replace",
        "(",
        "abc",
        ",",
        "gua",
        ")",
        ";",
    ];
    ensure(equals(toTokens(s6), expect6), "test variable 6");

    let s7 = ` 'a' + 'b'`;
    let expect7 = ["a", "+", "b", ";"];
    ensure(equals(toTokens(s7), expect7), "test variable 7");

    let s8 = `var arr = [1, 2, 3, 4, 5, 6,]`;
    let expect8 = [
        "var",
        "arr",
        "=",
        "[",
        1,
        ",",
        2,
        ",",
        3,
        ",",
        4,
        ",",
        5,
        ",",
        6,
        ",",
        "]",
        ";",
    ];
    ensure(equals(toTokens(s8), expect8), "test variable 8");

    let s9 = `var a = m["a"]
        m["gua"] = "No.1"
        m["hello"] `;
    let expect9 = [
        "var",
        "a",
        "=",
        "m",
        "[",
        "a",
        "]",
        ";",
        "m",
        "[",
        "gua",
        "]",
        "=",
        "No.1",
        ";",
        "m",
        "[",
        "hello",
        "]",
        ";",
    ];
    ensure(equals(toTokens(s9), expect9), "test variable 9");

    let s10 = `while(conditionExpression) {
            statement
            continue
            break
        }`;
    let expect10 = [
        "while",
        "(",
        "conditionExpression",
        ")",
        "{",
        ";",
        "statement",
        ";",
        "continue",
        ";",
        "break",
        ";",
        "}",
        ";",
    ];
    ensure(equals(toTokens(s10), expect10), "test variable 10");

    let s11 = `funcName(para1='xxx', para2='yyy')`;
    let expect11 = [
        "funcName",
        "(",
        "para1",
        "=",
        "xxx",
        ",",
        "para2",
        "=",
        "yyy",
        ")",
        ";",
    ];
    ensure(equals(toTokens(s11), expect11), "test variable 11");

    let s12 = `const Animal = class() {
        const new = function(sex, age) {
            const this.age = age

            this.sex = 'female'
            this.age = 20
        }
    }`;
    let expect12 = [
        "const",
        "Animal",
        "=",
        "class",
        "(",
        ")",
        "{",
        ";",
        "const",
        "new",
        "=",
        "function",
        "(",
        "sex",
        ",",
        "age",
        ")",
        "{",
        ";",
        "const",
        "this",
        ".",
        "age",
        "=",
        "age",
        ";",
        "this",
        ".",
        "sex",
        "=",
        "female",
        ";",
        "this",
        ".",
        "age",
        "=",
        20,
        ";",
        "}",
        ";",
        "}",
        ";",
    ];
    ensure(equals(toTokens(s12), expect12), "test variable 12");
};

const quoteStringEnd = function (s, index, quote) {
    let result = "";
    let length = 0;
    let escape = {
        b: "\b",
        f: "\f",
        n: "\n",
        r: "\r",
        v: "\v",
        t: "\t",
        "'": "'",
        '"': '"',
        "\\": "\\",
        "/": "/",
    };
    for (let i = index; i < s.length; i++) {
        let c = s[i];
        if (c === "\\") {
            let next = s[i + 1];
            if (escape.hasOwnProperty(next)) {
                result += escape[next];
                i += 1;
                length += 2;
            } else {
                result += c;
                length += 1;
            }
        } else if (c === quote) {
            return [result, length];
        } else {
            result += c;
            length += 1;
        }
    }
};

const numberEnd = (s, begin) => {
    let digit = "-.0123456789xbABCDEF";
    let result = "";
    let index = 0;
    for (let i = begin; i < s.length; i++) {
        let c = s[i];
        if (!digit.includes(c)) {
            return [result, index];
        }
        result += c;
        index += 1;
    }
    return [result, index];
};

const stringEnd = (s, begin) => {
    let letter =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    let index = 0;
    for (let i = begin; i < s.length; i++) {
        let c = s[i];
        if (!letter.includes(c)) {
            return [result, index];
        }
        result += c;
        index += 1;
    }
    return [result, index];
};

const keywordEnd = (s, begin) => {
    let t = "true";
    let f = "false";
    let n = "null";
    let v = "var";
    let c = "const";

    if (s.slice(begin, begin + t.length) === t) {
        return [true, t.length];
    } else if (s.slice(begin, begin + f.length) === f) {
        return [false, f.length];
    } else if (s.slice(begin, begin + n.length) === n) {
        return [null, n.length];
    } else if (s.slice(begin, begin + v.length) === v) {
        let [vn, length] = stringEnd(s, begin + v.length + 1);
        return [[v, vn], v.length + length + 1];
    } else if (s.slice(begin, begin + c.length) === c) {
        let [vn, length] = stringEnd(s, begin + c.length + 1);
        return [[c, vn], c.length + length + 1];
    } else {
        let [k, length] = stringEnd(s, begin);
        return [k, length];
    }
};

const logicSymbolEnd = (s, begin) => {
    let symbol = "=><!+-/*%";
    let result = "";
    let index = 0;
    for (let i = begin; i < s.length; i++) {
        let c = s[i];
        if (!symbol.includes(c)) {
            return [result, index];
        }
        result += c;
        index += 1;
    }
    return [result, index];
};

const toTokens = (s) => {
    let a = s.split("\n");
    a = a.filter((item) => item.trim());
    s = a.join("\n");
    // log('a', a)
    s = s.trim();
    s += "\n";
    // log('s', s)
    let digit = "0123456789";
    let letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let symbol = "=><!+/*%";

    let tokens = [];
    let index = 0;
    while (index < s.length) {
        let c = s[index];
        if (c === " ") {
            index += 1;
        } else if (c === "\n") {
            tokens.push(";");
            index += 1;
        } else if (c === "-") {
            let next = s[index + 1];
            if (digit.includes(next)) {
                let [num, length] = numberEnd(s, index);
                num = Number(num);
                tokens.push(num);
                index += length;
            } else {
                let [sym, length] = logicSymbolEnd(s, index);
                tokens.push(sym);
                index += length;
            }
        } else if (digit.includes(c)) {
            let [num, length] = numberEnd(s, index);
            num = Number(num);
            tokens.push(num);
            index += length;
        } else if (c === '"') {
            let [str, length] = quoteStringEnd(s, index + 1, '"');
            tokens.push(`"${str}"`);
            index += length + 2;
        } else if (c === "'") {
            let [str, length] = quoteStringEnd(s, index + 1, "'");
            tokens.push(`'${str}'`);
            index += length + 2;
        } else if (letter.includes(c)) {
            let [keyword, length] = keywordEnd(s, index);
            if (isArray(keyword)) {
                tokens = tokens.concat(keyword);
            } else {
                tokens.push(keyword);
            }
            index += length;
        } else if (symbol.includes(c)) {
            let [sym, length] = logicSymbolEnd(s, index);
            tokens.push(sym);
            index += length;
        } else {
            tokens.push(c);
            index += 1;
        }
    }
    log("tokens", tokens);
    let tokenList = [];
    for (let i = 0; i < tokens.length; i++) {
        let currentToken = tokens[i];
        if (isNumber(currentToken)) {
            let token = {
                tokenValue: currentToken,
                tokenType: TokenType.number,
            };
            tokenList.push(token);
        } else if (isSemi(currentToken)) {
            let token = {
                tokenValue: currentToken,
                tokenType: TokenType.semicolon,
            };
            tokenList.push(token);
        } else if (isKeyword(currentToken)) {
            let token = {
                tokenValue: currentToken,
                tokenType: TokenType.keyword,
            };
            tokenList.push(token);
        } else if (isString(currentToken)) {
            let token = {
                tokenValue: currentToken,
                tokenType: TokenType.string,
            };
            tokenList.push(token);
        } else {
            console.error(`unknow token:<${currentToken}>`);
        }
    }
    // log('tokenList', tokenList)
    return tokenList;
};

// const test = () => {
//     testNumber()
//     testString()
//     testKeyword()
//     testLogicSymbol()
//     testCalculator()
//     testVariable()
//     testGualangCode()
// }

// const _main = () => {
//     test()
// }

// _main()
