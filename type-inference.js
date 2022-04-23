const { parse } = require("abstract-syntax-tree");

// 用来记录变量类型的 map
const TypeMap = {};
// 更新 map 的方法
const setType = (variable, variableType) => {
    if (TypeMap[variable]) {
        console.error(
            "TypeMap[variable] 已经存在",
            variable,
            TypeMap[variable]
        );
    } else {
        TypeMap[variable] = variableType;
    }
};

const log = console.log.bind(console);
const isNumber = (o) => Object.prototype.toString.call(o) === "[object Number]";
const isString = (o) => Object.prototype.toString.call(o) === "[object String]";

// Ast 的类型
class AstType {
    // 变量声明
    static VariableDeclaration = new AstType("VariableDeclaration");
    // 声明
    static VariableDeclarator = new AstType("VariableDeclarator");
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

// 判断 Ast 的类型
const isAstType = (current, astType) => {
    return current.type === astType.enumName;
};

// 类型的 枚举
class TypeType {
    static String = "String";
    static Number = "Number";
    static Identifier = "number";
}

// 处理 字面量 类型
const typeLiteral = (literal) => {
    const it = literal;
    const { value, raw } = it;
    let _type = null;
    if (isNumber(value)) {
        _type = TypeType.Number;
    } else if (isString(value)) {
        _type = TypeType.String;
    } else {
        console.error("unknow type Literal", value, raw);
    }
    // log("type:", it, _type);
    return {
        ...it,
        _type,
    };
    // return {
    //     _type,
    // };
    // return _type;
};

// binary 左右计算
const typeCalc = (left, right) => {
    // log("left, right", left, right);
    if (left._type === right._type) {
        return left._type;
    } else {
        console.error("typeCalc func error");
    }
};

// 计算 binary 表达式的值
const calcBinaryValue = (expression, _type) => {
    const exp = expression;
    // log("calcBinaryValue", exp);
    const { left, right, operator } = exp;
    let v = null;
    if (_type === TypeType.Number) {
        if (operator === "+") {
            v = left.value + right.value;
        }
    } else if (_type === TypeType.String) {
        if (operator === "+") {
            v = `${left.value}${right.value}`;
        }
    } else {
        console.error("BinaryExpression calc error", operator, left, right);
    }
    return v;
};

// 处理 binary 表达式类型
const typeBinaryExpression = (expression) => {
    const exp = expression;
    // log("bin exp", exp);
    const { left, right, operator } = exp;
    // log("111111left, right", left, right);
    // 求左边类型
    const leftType = typeProcess(left);
    // 求右边类型
    const rightType = typeProcess(right);
    // log("111111after left, right", leftType, rightType);
    // 更新左边和右边
    exp.left = leftType;
    exp.right = rightType;
    // 获取计算的类型
    const _type = typeCalc(leftType, rightType);
    // 计算 value
    const value = calcBinaryValue(exp, _type);
    // log("binary_value", value);
    return {
        _type,
        value,
    };
};

// 变量
const typeIdentifier = (token) => {
    // todo: 待修改
    return TypeType.Identifier;
};

// 处理类型推导
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
            // 处理声明语句
            current.declarations.forEach((decla) => {
                // 声明类的有字面量
                const init = decla.init;
                let t = null;
                // if (isAstType(init, AstType.VariableDeclarator)) {
                //     t = typeProcess(init);
                //     // decla.init._type = t;
                //     // 暂时只留下 类型 信息
                // } else if (isAstType(init, AstType.BinaryExpression)) {
                //     t = typeBinaryExpression(init);
                // } else {
                //     console.error("unknow declarations init", init);
                // }
                t = typeProcess(init);
                decla.init._type = t;
                decla.id._type = t;
                setType(decla.id.name, t);
            });
        } else if (isAstType(current, AstType.ExpressionStatement)) {
            // log("表达式:", current);
            const t = typeProcess(current.expression);
            log("表达式:", t);
            // 处理声明语句里的字面量
            current._type = t._type;
            current.value = t.value;
        } else {
            console.error("unknown type", current.type);
        }
        index++;
    }

    return list;
};

const __main = () => {
    const s = `
    // var a = 1 + 2 + 1
    // var a = "a" + "b" + "c"
    // var a = "1" + 2
    // 1 + 2 + 23
    `;

    const ast = parse(s);
    log(s);

    const ast_list = ast.body;

    const afterList = typeInference(ast_list);
    log("处理后:", JSON.stringify(afterList, null, 4));
    console.log("类型字典:");
    console.log(JSON.stringify(TypeMap, null, 4));
};

__main();
