class AstType {
    // expression
    // 对象定义
    static ExpressionObject = new AstType('ExpressionObject')
    // 函数定义
    static ExpressionFunction = new AstType('ExpressionFunction')
    // 数组定义
    static ExpressionArray = new AstType('ExpressionArray')
    // 二元表达式
    static ExpressionBinary = new AstType('ExpressionBinary')
    // 函数调用
    static ExpressionCall = new AstType('ExpressionFunction')
    // 赋值
    static ExpressionAssignment = new AstType('ExpressionFunction')
    // 类的定义
    static ExpressionClass = new AstType('ExpressionFunction')
    // 访问数组、访问类变量或函数
    static ExpressionMember = new AstType('ExpressionFunction')

    // statement
    static StatementBlock = new AstType('StatementBlock')
    static StatementIf = new AstType('StatementIf')
    static StatementWhile = new AstType('StatementWhile')
    static StatementFor = new AstType('StatementFor')

    // 变量声明
    static DeclarationVariable = new AstType('DeclarationVariable')
    // 对象属性
    static PropertyObject = new AstType('PropertyObject')

    constructor(name) {
        this.enumName = name
    }

    toString() {
        return `${this.constructor.name}.${this.enumName}`
    }
}