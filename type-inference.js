const { parse } = require("abstract-syntax-tree");

const log = console.log.bind(console);
const isNumber = (o) => Object.prototype.toString.call(o) === "[object Number]";
const isString = (o) => Object.prototype.toString.call(o) === "[object String]";

class AstType {
    // 变量声明
    static VariableDeclaration = new AstType("VariableDeclaration");
    // 变量;
    static Identifier = new AstType("Identifier");
    // 字面量
    static Literal = new AstType("Literal");

    // 表达式
    static ExpressionStatement = new AstType("ExpressionStatement");
    static BinaryExpression = new AstType("BinaryExpression");

    constructor(name) {
        this.enumName = name;
    }

    toString() {
        return `${this.constructor.name}.${this.enumName}`;
    }
}

class TypeType {
    static String = "String";
    static Number = "Number";
    static Identifier = "number";
}

const isAstType = (current, astType) => {
    return current.type === astType.enumName;
};

// 字面量类型
const typeLiteral = (literal) => {
    const it = literal;
    const { value, raw } = it;
    let _type = null;
    if (isNumber(value)) {
        _type = TypeType.Number;
    } else if (isString(value)) {
        _type = TypeType.String;
    } else {
        console.error("unknow typeLiteral", value, raw);
    }
    // log("type:", _type);
    // return {
    //     type: _type,
    //     value: value,
    //     raw: raw,
    // };
    return {
        _type,
    };
};

// 左右计算
const typeCalc = (left, right) => {
    // log("left, right", left, right);
    if (left._type === right._type) {
        return left._type;
    } else {
        console.error("typeCalc func error");
    }
};

// binary 表达式类型
const typeBinaryExpression = (expression) => {
    const exp = expression;
    // log("bin exp", exp);
    // let _type = null;
    const { left, right } = exp;
    // log("left, right", left, right);

    exp.left = typeProcess(left);
    exp.right = typeProcess(right);
    const _type = typeCalc(exp.left, exp.right);
    return _type;
};

// 变量
const typeIdentifier = (token) => {
    return TypeType.Identifier;
};

const typeProcess = (token) => {
    let t = null;
    // 字面量
    if (isAstType(token, AstType.Literal)) {
        t = typeLiteral(token);
    } else if (isAstType(token, AstType.BinaryExpression)) {
        // binary 表达式处理
        t = typeBinaryExpression(token);
    } else if (isAstType(token, AstType.Identifier)) {
        // 变量
        t = typeIdentifier(token);
    } else {
        console.error("typeProcess func unknow type", token);
    }
    return t;
};

const typeInference = (ast_list) => {
    log("处理前:", JSON.stringify(ast_list, null, 4));
    const list = JSON.parse(JSON.stringify(ast_list));
    let index = 0;
    while (index < list.length) {
        const current = list[index];

        if (isAstType(current, AstType.VariableDeclaration)) {
            // log(current);
            // 处理声明语句里的字面量
            current.declarations.forEach((decla) => {
                const literal = decla.init;
                const t = typeProcess(literal);
                // decla.init._type = t;
                // 暂时只留下 类型 信息
                decla.init = t;
            });
        } else if (isAstType(current, AstType.ExpressionStatement)) {
            // log("表达式:", current);
            const t = typeProcess(current.expression);
            // 处理声明语句里的字面量
            current._type = t;
        } else {
            console.error("unknown type", current.type);
        }
        index++;
    }

    log("处理后:", JSON.stringify(list, null, 4));
};

const __main = () => {
    const s = `
    a
    `;

    const ast = parse(s);
    log(s);

    const ast_list = ast.body;

    typeInference(ast_list);
};

__main();
