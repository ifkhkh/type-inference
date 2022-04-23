class TokenType {
    // type
    static number = new TokenType('number')
    static boolean = new TokenType('boolean')
    static string = new TokenType('string')
    static null = new TokenType('null')
    static variable = new TokenType('variable')

    // keyword: break, const, continue, if, else, while, for
    // function, return, this, var
    static keyword = new TokenType('keyword')

    // operator
    static auto = new TokenType('auto')
    static colon = new TokenType('colon')
    static comma = new TokenType('comma')
    // 分号
    static semicolon = new TokenType('semicolon')

    static equal = new TokenType('equal')
    static assign = new TokenType('assign')

    static notEqual = new TokenType('notEqual')
    static greaterThan = new TokenType('greaterThan')
    static lessThan = new TokenType('lessThan')
    static greaterEqual = new TokenType('greaterEqual')
    static lessEqual = new TokenType('lessEqual')

    static plus = new TokenType('plus')
    static minus = new TokenType('minus')
    static multiply = new TokenType('multiply')
    static divide = new TokenType('divide')

    // += -= *= /= %/
    static assignPlus = new TokenType('assignPlus')
    static assignMinus = new TokenType('assignMinus')
    static assignMultiply = new TokenType('assignMultiply')
    static assignDivide = new TokenType('assignDivide')
    static assignMod = new TokenType('assignMod')

    static and = new TokenType('and')
    static or = new TokenType('or')
    static not = new TokenType('not')

    static mod = new TokenType('mod')
    static dot = new TokenType('dot')
    // [
    static bracketLeft = new TokenType('bracketLeft')
    // ]
    static bracketRight = new TokenType('bracketRight')
    // {
    static curlyLeft = new TokenType('curlyLeft')
    // }
    static curlyRight = new TokenType('curlyRight')
    // (
    static parenthesesLeft = new TokenType('parenthesesLeft')
    // )
    static parenthesesRight = new TokenType('parenthesesRight')

    constructor(name) {
        this.enumName = name
    }

    toString() {
        return `${this.constructor.name}.${this.enumName}`
    }
}
