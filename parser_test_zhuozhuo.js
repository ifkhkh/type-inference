// 1
// 1 + 2

// add(1, 2)
// a[0]
// this.a
// this.add(1, 2)
// 1+add(1, 2)
// 1+a[0]
// this.a + 1

// 1 + add(1, 2)
// var o = { test: 123, key: 99 }
// var o = { test: 1 + add(2, 3), key: 99 }

const test_expression_1 = () => {
    let code = `1`
    log("测试代码:", code)

    const tokenList = [
        {tokenValue: 1, tokenType: TokenType.number},
    ]

    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_expression_1 tokenizer')
    // log('my tokens', myTokens, tokenList)
    const result = parser(tokenList)

    const expect = [
        {
            tokenType: TokenType.number,
            tokenValue: 1,
        }
    ]
    ensure(equals(result, expect), '### test_expression_1 parser')
    // log('res', result, expect)
}

// 1 + 2
const test_expression_2 = () => {
    let code = `1 + 2
    `
    log("测试代码:", code)

    const tokenList = [
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: '+', tokenType: TokenType.plus},
        {tokenValue: 2, tokenType: TokenType.number},
        {tokenValue: ';', tokenType: TokenType.semicolon},
    ]
    let myTokens = toTokens(code)
    // log('my tokens', myTokens, tokenList)
    ensure(equals(myTokens, tokenList), '### test_expression_2 tokenizer')
    const result = parser(tokenList)

    const expect = [
        {
            type: AstType.ExpressionBinary,
            operator: {
                tokenType: TokenType.plus,
                tokenValue: '+'
            },
            left: {
                tokenType: TokenType.number,
                tokenValue: 1,
            },
            right: {
                tokenType: TokenType.number,
                tokenValue: 2,
            },
        }
    ]

    ensure(equals(result, expect), '### test_expression_2 parser')
    // log('res', result, expect)
}

// a
const test_expression_3 = () => {
    let code = `a`
    log("测试代码:", code)

    const tokenList = [
        {tokenValue: "a", tokenType: TokenType.variable},
    ]

    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_expression_3 tokenizer')

    const result = parser(tokenList)

    const expect = [
        {
            tokenType: TokenType.variable,
            tokenValue: "a",
        }
    ]
    ensure(equals(result, expect), '### test_expression_3 parser')
}


// a[1]
const test_expression_4 = () => {
    const code = `a[1]
    `
    log("测试代码:", code)

    const tokenList = [
        {tokenValue: 'a', tokenType: TokenType.variable},
        {tokenValue: '[', tokenType: TokenType.bracketLeft},
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: ",", tokenType: TokenType.comma},
        {tokenValue: ']', tokenType: TokenType.bracketRight},
        {tokenValue: ';', tokenType: TokenType.semicolon},
    ]

    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_expression_4 tokenizer')
    // log('my tokens', myTokens, tokenList)
    const expect = [{
        type: AstType.ExpressionMember,
        object: {
            tokenType: TokenType.variable,
            tokenValue: 'a',
        },
        // 相当于a.1
        property: {
            tokenType: TokenType.number,
            tokenValue: 1,
        }
    }]
    const result = parser(tokenList, 0)
    ensure(equals(result, expect), '### test_expression_4 parser')
}

// this.a
const test_expression_5 = () => {
    const code = `this.a
    `
    log("测试代码:", code)


    const tokenList = [
        {tokenValue: 'this', tokenType: TokenType.variable},
        {tokenValue: '.', tokenType: TokenType.dot},
        {tokenValue: 'a', tokenType: TokenType.variable},
        {tokenValue: ';', tokenType: TokenType.semicolon},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_expression_5 tokenizer')


    const result = parser(tokenList, 0)

    const expect = [{
        type: AstType.ExpressionMember,
        object: {
            tokenType: TokenType.variable,
            tokenValue: "this",
        },
        property: {
            tokenType: TokenType.variable,
            tokenValue: 'a',
        }
    }]
    ensure(equals(result, expect), '### test_expression_5 parser')
}

// add(1, 2)
const test_expression_6 = () => {
    const code = `add(1, 2)
    `
    log("测试代码:", code)

    const tokenList = [
        {tokenValue: "add", tokenType: TokenType.variable},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: 2, tokenType: TokenType.number},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: ';', tokenType: TokenType.semicolon},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_expression_6 tokenizer')
    // log('my tokens', myTokens, tokenList)

    const result = parser(tokenList, 0)

    const expect = [{
        type: AstType.ExpressionCall,
        // 被调用的函数名
        callee: {
            tokenType: TokenType.variable,
            tokenValue: 'add',
        },
        // 参数
        arguments: [
            {
                tokenType: TokenType.number,
                tokenValue: 1,
            },
            {
                tokenType: TokenType.number,
                tokenValue: 2,
            },
        ],
    }]
    ensure(equals(result, expect), '### test_expression_6 parser')
}

// 类方法访问 item.log(1)
const test_expression_7 = () => {
    const code = `item.log(1, 2)
    `
    log("测试代码:", code)


    const tokenList = [
        {tokenValue: 'item', tokenType: TokenType.variable},
        {tokenValue: '.', tokenType: TokenType.dot},
        {tokenValue: 'log', tokenType: TokenType.variable},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: 2, tokenType: TokenType.number},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: ';', tokenType: TokenType.semicolon},

    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_expression_7 tokenizer')

    const result = parser(tokenList, 0)

    const expect = [{
        type: AstType.ExpressionCall,
        callee: {
            type: AstType.ExpressionMember,
            object: {
                tokenType: TokenType.variable,
                tokenValue: "item",
            },
            property: {
                tokenType: TokenType.variable,
                tokenValue: 'log',
            },
        },
        arguments: [
            {
                tokenType: TokenType.number,
                tokenValue: 1,
            },
            {
                tokenType: TokenType.number,
                tokenValue: 2,
            },
        ]
    }]
    ensure(equals(result, expect), '### test_expression_7 parser')
}
//todo 添加复杂运算测试

//复杂表达式
//1+2
//1 * ( 2 + 3 )
//1 + add(1, 2)
//1 + arr[2]
//1 + this.a


// 1 * ( 3 + 4 )
const test_expression_8 = () => {
    let code = `1 * ( 3 + 4 )
    `
    log("测试代码:", code)

    const tokenList = [
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: '*', tokenType: TokenType.multiply},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: 3, tokenType: TokenType.number},
        {tokenValue: '+', tokenType: TokenType.plus},
        {tokenValue: 4, tokenType: TokenType.number},
        {tokenValue: ",", tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: ';', tokenType: TokenType.semicolon},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_expression_8 tokenizer')

    const result = parser(tokenList)

    const expect = [
        {
            type: AstType.ExpressionBinary,
            operator: {
                tokenType: TokenType.multiply,
                tokenValue: '*'
            },
            left: {
                tokenType: TokenType.number,
                tokenValue: 1,
            },
            right:  {
                type: AstType.ExpressionBinary,
                operator: {
                    tokenType: TokenType.plus,
                    tokenValue: '+'
                },
                left: {
                    tokenType: TokenType.number,
                    tokenValue: 3,
                },
                right: {
                    tokenType: TokenType.number,
                    tokenValue: 4,
                },
            },
        }
    ]
    ensure(equals(result, expect), '### test_expression_8 parser')

}


// 1 + a[1]
const test_expression_9 = () => {
    let code = `1+a[1]
    `
    log("测试代码:", code)
    const tokenList = [
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: '+', tokenType: TokenType.plus},
        {tokenValue: 'a', tokenType: TokenType.variable},
        {tokenValue: '[', tokenType: TokenType.bracketLeft},
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: ",", tokenType: TokenType.comma},
        {tokenValue: ']', tokenType: TokenType.bracketRight},
        {tokenValue: ';', tokenType: TokenType.semicolon},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_expression_9 tokenzier')
    // log('my tokens', myTokens, tokenList)


    const result = parser(tokenList)
    const expect = [
        {
            type: AstType.ExpressionBinary,
            operator: {
                tokenType: TokenType.plus,
                tokenValue: '+'
            },
            left: {
                tokenType: TokenType.number,
                tokenValue: 1,
            },
            right:  {
                type: AstType.ExpressionMember,
                object: {
                    tokenType: TokenType.variable,
                    tokenValue: 'a',
                },
                // 相当于a.1
                property: {
                    tokenType: TokenType.number,
                    tokenValue: 1,
                }
            }
        }
    ]
    ensure(equals(result, expect), '### test_expression_9 parser')

}



// 变量声明
// var a = 1
// var a = 1 + 2
// var a = arr[1]
// var a = []
// var a = [1]
// var a = [1, 2]
// var a = {}
// var a = {
//     k:v,
// }
// var a = {
//     k1 : v1,
//     k2 : v2,
// }



//  var a = 99
const test_declaration_1 = () => {

    const code = ` var a = 99
    `
    log("测试代码:", code)


    const tokenList = [
        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: "a", tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 99, tokenType: TokenType.number},
        {tokenValue: ";", tokenType: TokenType.semicolon},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_declaration_1 tokenizer')
    // log('my tokens', myTokens, tokenList)

    const result = parser(tokenList, 0)

    const expect = [{

        type: AstType.DeclarationVariable,
        kind: 'var',
        variable: {
            tokenType: TokenType.variable,
            tokenValue:"a",
        },
        value: {
            tokenType: TokenType.number,
            tokenValue: 99,
        }
    }]
    ensure(equals(result, expect), '### test_declaration_1 parser')
}

// var a = 1 + 2
const test_declaration_2 = () => {

    const code = ` var a = 1+2
    `
    log("测试代码:", code)


    const tokenList = [
        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: "a", tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: '+', tokenType: TokenType.plus},
        {tokenValue: 2, tokenType: TokenType.number},
        {tokenValue: ';', tokenType: TokenType.semicolon},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_declaration_2 tokenizer')
    const result = parser(tokenList, 0)

    const expect = [{

        type: AstType.DeclarationVariable,
        kind: 'var',
        variable: {
            tokenType: TokenType.variable,
            tokenValue:"a",
        },
        value: {
            type: AstType.ExpressionBinary,
            operator: {
                tokenType: TokenType.plus,
                tokenValue: '+'
            },
            left: {
                tokenType: TokenType.number,
                tokenValue: 1,
            },
            right: {
                tokenType: TokenType.number,
                tokenValue: 2,
            },
        }
    }]
    ensure(equals(result, expect), '### test_declaration_2 parser')
}

// var a = arr[1]
const test_declaration_3 = () => {

    const code = ` var a = a[1]
    `
    log("测试代码:", code)

    const tokenList = [
        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: "a", tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 'a', tokenType: TokenType.variable},
        {tokenValue: '[', tokenType: TokenType.bracketLeft},
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: ",", tokenType: TokenType.comma},
        {tokenValue: ']', tokenType: TokenType.bracketRight},
        {tokenValue: ';', tokenType: TokenType.semicolon},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_declaration_3 tokenizer')
    const result = parser(tokenList, 0)

    const expect = [{

        type: AstType.DeclarationVariable,
        kind: 'var',
        variable: {
            tokenType: TokenType.variable,
            tokenValue:"a",
        },
        value: {
            type: AstType.ExpressionMember,
            object: {
                tokenType: TokenType.variable,
                tokenValue: 'a',
            },
            // 相当于a.1
            property: {
                tokenType: TokenType.number,
                tokenValue: 1,
            }
        },
    }]
    ensure(equals(result, expect), '### test_declaration_3 parser')
}

//var a = []
const test_declaration_4 = () => {

    const code = `  var a = [] 
    `
    log("测试代码:", code)


    const tokenList = [
        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: "a", tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: '[', tokenType: TokenType.bracketLeft},
        {tokenValue: ']', tokenType: TokenType.bracketRight},
        {tokenValue: ';', tokenType: TokenType.semicolon},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_declaration_4 tokenizer')
    // log('my tokens', myTokens, tokenList)


    const result = parser(tokenList, 0)

    const expect = [{

        type: AstType.DeclarationVariable,
        kind: 'var',
        variable: {
            tokenType: TokenType.variable,
            tokenValue:"a",
        },
        value: {
            type: AstType.ExpressionArray,
            elements: [
            ]
        }
    }]
    ensure(equals(result, expect), '### test_declaration_4 parser')
}

// var arr = [1, 2, 3]
const test_declaration_5 = () => {
    const code = `var arr = [1, 2, 3]
`
    log("测试代码:", code)

    const tokenList = [
        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: 'arr', tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: '[', tokenType: TokenType.bracketLeft},
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: 2, tokenType: TokenType.number},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: 3, tokenType: TokenType.number},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ']', tokenType: TokenType.bracketRight},
        {tokenValue: ';', tokenType: TokenType.semicolon},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_declaration_5 tokenizer')

    const result = parser(tokenList, 0)

    const expect = [{
        type: AstType.DeclarationVariable,
        kind: 'var',
        variable: {
            tokenType: TokenType.variable,
            tokenValue:"arr",
        },
        value: {
            type: AstType.ExpressionArray,
            elements: [
                {
                    tokenType: TokenType.number,
                    tokenValue: 1,
                },
                {
                    tokenType: TokenType.number,
                    tokenValue: 2,
                },
                {
                    tokenType: TokenType.number,
                    tokenValue: 3,
                },
            ]
        }
    }]
    ensure(equals(result, expect), '### test_declaration_5 parser')
}
// var o = {
// }
const test_declaration_6 = () => {
    const code = `var o = {
    }
    `
    log("测试代码:", code)

    const tokenList = [
        {tokenValue: 'var', tokenType: TokenType.keyword},
        {tokenValue: 'o', tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: '{', tokenType: TokenType.curlyLeft},
        {tokenValue: ';', tokenType: TokenType.semicolon},
        {tokenValue: "}", tokenType: TokenType.curlyRight},
        {tokenValue: ';', tokenType: TokenType.semicolon},

    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_declaration_6 tokenizer')
    const result = parser(tokenList, 0)

    const expect = [{
        type: AstType.DeclarationVariable,
        kind: 'var',
        variable: {
            tokenType: TokenType.variable,
            tokenValue:"o",
        },
        value: {
            type: AstType.ExpressionObject,
            properties: [
            ],
        }

    }]

    ensure(equals(result, expect), '### test_declaration_6 parser')
}
const test_declaration_7 = () => {
    const code = `var o = {
        test: 123,
    }`
    log("测试代码:", code)

    // const tokenList = new TokenList(code)

    const tokenList = [
        {tokenValue: 'var', tokenType: TokenType.keyword},
        {tokenValue: 'o', tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: '{', tokenType: TokenType.curlyLeft},
        {tokenValue: ';', tokenType: TokenType.semicolon},

        {tokenValue: "test", tokenType: TokenType.variable},
        {tokenValue: ':', tokenType: TokenType.colon},
        {tokenValue: 123, tokenType: TokenType.number},
        {tokenValue: ",", tokenType: TokenType.comma},
        {tokenValue: ';', tokenType: TokenType.semicolon},


        {tokenValue: "}", tokenType: TokenType.curlyRight},
    ]

    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_declaration_7 tokenizer')
    // log('my tokens', myTokens, tokenList)

    const result = parser(tokenList, 0)

    const expect = [{
        type: AstType.DeclarationVariable,
        kind: 'var',
        variable: {
            tokenType: TokenType.variable,
            tokenValue:"o",
        },
        value: {
            type: AstType.ExpressionObject,
            properties: [
                {
                    type: AstType.PropertyObject,
                    key: {
                        tokenType: TokenType.variable,
                        tokenValue: 'test',
                    },
                    value: {
                        tokenType: TokenType.number,
                        tokenValue: 123,
                    }
                }
            ],
        }

    }]

    ensure(equals(result, expect), '### test_declaration_7 parser')
}

//var f = function(){
//     }
const test_declaration_8 = () => {
    const code = `var f = function(){
    }`
    log("测试代码:", code)


    const tokenList = [
        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: 'f', tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 'function', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: ',', tokenType: TokenType.comma},

        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: '{', tokenType: TokenType.curlyLeft},
        {tokenValue: ';', tokenType: TokenType.semicolon},

        {tokenValue: '}', tokenType: TokenType.curlyRight},
    ]
    let myTokens = toTokens(code)

    ensure(equals(myTokens, tokenList), '### test_declaration_8 tokenizer')
    // log('my tokens', myTokens, tokenList)
    const result = parser(tokenList, 0)

    const expect = [{
        type: AstType.DeclarationVariable,
        kind: 'var',
        variable: {
            tokenType: TokenType.variable,
            tokenValue: "f",
        },
        value: {
            // 函数类型
            type: AstType.ExpressionFunction,
            // 参数列表
            params: [

            ],
            body: {
                type: AstType.StatementBlock,
                body: [
                ]
            },
        },
    }]

    ensure(equals(result, expect), '### test_declaration_8 parser')
}
// var f = function(a, b){
// }
const test_declaration_9 = () => {
    const code = `var f = function(a, b){
    }`
    log("测试代码:", code)


    const tokenList = [
        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: 'f', tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 'function', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: 'a', tokenType: TokenType.variable},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: 'b', tokenType: TokenType.variable},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: '{', tokenType: TokenType.curlyLeft},
        {tokenValue: ';', tokenType: TokenType.semicolon},
        {tokenValue: '}', tokenType: TokenType.curlyRight},

    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_declaration_9 tokenizer')
    const result = parser(tokenList, 0)

    const expect = [{
        type: AstType.DeclarationVariable,
        kind: 'var',
        variable: {
            tokenType: TokenType.variable,
            tokenValue: "f",
        },
        value: {
            // 函数类型
            type: AstType.ExpressionFunction,
            // 参数列表
            params: [
                {
                    tokenType: TokenType.variable,
                    tokenValue: 'a',
                },
                {
                    tokenType: TokenType.variable,
                    tokenValue: 'b',
                },
            ],
            body: {
                type: AstType.StatementBlock,
                body: [
                ]
            },
        },
    }]
    ensure(equals(result, expect), '### test_declaration_9 parser')
}

//var f = function(a, b){
//         var x = 10
//     }
const test_declaration_10 = () => {
    const code = `var f = function(a, b){
        var x = 10
    }`
    log("测试代码:", code)

    const tokenList = [
        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: 'f', tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 'function', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: 'a', tokenType: TokenType.variable},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: 'b', tokenType: TokenType.variable},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: '{', tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: 'x', tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 10, tokenType: TokenType.number},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: '}', tokenType: TokenType.curlyRight},

    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_declaration_10 tokenizer')
    const result = parser(tokenList, 0)

    const expect = [{
        type: AstType.DeclarationVariable,
        kind: 'var',
        variable: {
            tokenType: TokenType.variable,
            tokenValue: "f",
        },
        value: {
            // 函数类型
            type: AstType.ExpressionFunction,
            // 参数列表
            params: [
                {
                    tokenType: TokenType.variable,
                    tokenValue: 'a',
                },
                {
                    tokenType: TokenType.variable,
                    tokenValue: 'b',
                },
            ],
            body: {
                type: AstType.StatementBlock,
                body: [
                    // 函数体是一条条语句组成的，所以是数组
                    {
                        type: AstType.DeclarationVariable,
                        kind: 'var',
                        variable: {
                            tokenType: TokenType.variable,
                            tokenValue: "x",
                        },
                        value: {
                            tokenType: TokenType.number,
                            tokenValue: 10,
                        }
                    },
                ]
            },
        },
    }]
    ensure(equals(result, expect), '### test_declaration_10 parser')
}

// 类定义
const test_declaration_11 = () => {
    const code = `var a = class() {
        }
    `
    log("测试代码:", code)

    // const tokenList = new TokenList(code)

    const tokenList = [
        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: 'a', tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 'class', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: ",", tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: '{', tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},
        {tokenValue: '}', tokenType: TokenType.curlyRight},
        {tokenValue: ";", tokenType: TokenType.semicolon},

    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_declaration_11 tokenizer')
    const expect = [{
        type: AstType.DeclarationVariable,
        kind: 'var',
        variable: {
            tokenType: TokenType.variable,
            tokenValue:"a",
        },
        value: {
            type: AstType.ExpressionClass,
            body: {
                type: AstType.StatementBlock,
                body: []
            },
        }
    }]
    // log("finally expect", expect)
    const result = parser(tokenList, 0)

    ensure(equals(result, expect), '### test_declaration_11 parser')
}
const test_declaration_12 = () => {
    const code = `var Gua = class() {
        var new = function(name){
        }
    }
    `
    log("测试代码:", code)

    const tokenList = [
        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: 'Gua', tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 'class', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: '{', tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: 'new', tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 'function', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: 'name', tokenType: TokenType.variable},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: '{', tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},


        {tokenValue: '}', tokenType: TokenType.curlyRight},
        {tokenValue: ";", tokenType: TokenType.semicolon},
        {tokenValue: '}', tokenType: TokenType.curlyRight},
        {tokenValue: ";", tokenType: TokenType.semicolon},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_declaration_12 tokenizer')
    const expect = [{
        type: AstType.DeclarationVariable,
        kind: 'var',
        variable: {
            tokenType: TokenType.variable,
            tokenValue:"Gua",
        },
        value: {
            type: AstType.ExpressionClass,
            body: {
                type: AstType.StatementBlock,
                body: [{
                    type: AstType.DeclarationVariable,
                    kind: 'var',
                    variable: {
                        tokenType: TokenType.variable,
                        tokenValue: "new",
                    },
                    value: {
                        // 函数类型
                        type: AstType.ExpressionFunction,
                        // 参数列表
                        params: [
                            {
                                tokenType: TokenType.variable,
                                tokenValue: 'name',
                            },

                        ],
                        body: {
                            type: AstType.StatementBlock,
                            body: [
                            ]
                        },
                    },
                }]
            },
        }
    }]
    // log("finally expect", expect)
    const result = parser(tokenList, 0)

    ensure(equals(result, expect), '### test_declaration_12 parser')

}
const test_declaration_13 = () => {
    const code = `this.a = 1
    `
    log("测试代码:", code)


    const tokenList = [
        {tokenValue: 'this', tokenType: TokenType.variable},
        {tokenValue: '.', tokenType: TokenType.dot},
        {tokenValue: 'a', tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: ";", tokenType: TokenType.semicolon},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_declaration_13 tokenizer')

    const result = parser(tokenList, 0)

    const expect = [{
        type: AstType.ExpressionAssignment,
        operator: {
            tokenType: TokenType.assign,
            tokenValue: '='
        },
        left: {
            type: AstType.ExpressionMember,
            object: {
                tokenType: TokenType.variable,
                tokenValue: "this",
            },
            property: {
                tokenType: TokenType.variable,
                tokenValue: 'a',
            }
        },
        right: {
            tokenType: TokenType.number,
            tokenValue: 1,
        },
    }]
    ensure(equals(result, expect), '### test_declaration_13 parser')
}

const test_declaration_14 = () => {
    const code = `var Gua = class() {
        var new = function(name){
            this.name = name
        }
    }    
    `
    log("测试代码:", code)

    const tokenList = [
        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: 'Gua', tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 'class', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: '{', tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: 'new', tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 'function', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: 'name', tokenType: TokenType.variable},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: '{', tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "this", tokenType: TokenType.variable},
        {tokenValue: '.', tokenType: TokenType.dot},
        {tokenValue: 'name', tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: "name", tokenType: TokenType.variable},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: '}', tokenType: TokenType.curlyRight},
        {tokenValue: ";", tokenType: TokenType.semicolon},
        {tokenValue: '}', tokenType: TokenType.curlyRight},
        {tokenValue: ";", tokenType: TokenType.semicolon},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_declaration_14 tokenzier')
    const expect = [{
        type: AstType.DeclarationVariable,
        kind: 'var',
        variable: {
            tokenType: TokenType.variable,
            tokenValue:"Gua",
        },
        value: {
            type: AstType.ExpressionClass,
            body: {
                type: AstType.StatementBlock,
                body: [{
                    type: AstType.DeclarationVariable,
                    kind: 'var',
                    variable: {
                        tokenType: TokenType.variable,
                        tokenValue: "new",
                    },
                    value: {
                        // 函数类型
                        type: AstType.ExpressionFunction,
                        // 参数列表
                        params: [
                            {
                                tokenType: TokenType.variable,
                                tokenValue: 'name',
                            },

                        ],
                        body: {
                            type: AstType.StatementBlock,
                            body: [{
                                type: AstType.ExpressionAssignment,
                                operator: {
                                    tokenType: TokenType.assign,
                                    tokenValue: '='
                                },
                                left: {
                                    type: AstType.ExpressionMember,
                                    object: {
                                        tokenType: TokenType.variable,
                                        tokenValue: "this",
                                    },
                                    property: {
                                        tokenType: TokenType.variable,
                                        tokenValue: 'name',
                                    }
                                },
                                right: {
                                    tokenType: TokenType.variable,
                                    tokenValue: 'name',
                                },
                            }]
                        },
                    },
                }]
            },
        }
    }]
    // log("finally expect", expect)
    const result = parser(tokenList, 0)

    ensure(equals(result, expect), '### test_declaration_14 parser')

}


const test_declaration_15 = () => {
    const code = `var Gua = class() {
        var new = function(name){
            this.name = name
        }
    }
    var a = 99   
    `
    log("测试代码:", code)
    const tokenList = [
        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: 'Gua', tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 'class', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: '{', tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: 'new', tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 'function', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: 'name', tokenType: TokenType.variable},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: '{', tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "this", tokenType: TokenType.variable},
        {tokenValue: '.', tokenType: TokenType.dot},
        {tokenValue: 'name', tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: "name", tokenType: TokenType.variable},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: '}', tokenType: TokenType.curlyRight},
        {tokenValue: ";", tokenType: TokenType.semicolon},
        {tokenValue: '}', tokenType: TokenType.curlyRight},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: "a", tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 99, tokenType: TokenType.number},
        {tokenValue: ";", tokenType: TokenType.semicolon},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_declaration_15 tokenzier')

    const expect = [{
        type: AstType.DeclarationVariable,
        kind: 'var',
        variable: {
            tokenType: TokenType.variable,
            tokenValue:"Gua",
        },
        value: {
            type: AstType.ExpressionClass,
            body: {
                type: AstType.StatementBlock,
                body: [{
                    type: AstType.DeclarationVariable,
                    kind: 'var',
                    variable: {
                        tokenType: TokenType.variable,
                        tokenValue: "new",
                    },
                    value: {
                        // 函数类型
                        type: AstType.ExpressionFunction,
                        // 参数列表
                        params: [
                            {
                                tokenType: TokenType.variable,
                                tokenValue: 'name',
                            },

                        ],
                        body: {
                            type: AstType.StatementBlock,
                            body: [{
                                type: AstType.ExpressionAssignment,
                                operator: {
                                    tokenType: TokenType.assign,
                                    tokenValue: '='
                                },
                                left: {
                                    type: AstType.ExpressionMember,
                                    object: {
                                        tokenType: TokenType.variable,
                                        tokenValue: "this",
                                    },
                                    property: {
                                        tokenType: TokenType.variable,
                                        tokenValue: 'name',
                                    }
                                },
                                right: {
                                    tokenType: TokenType.variable,
                                    tokenValue: 'name',
                                },
                            }]
                        },
                    },
                }]
            },
        }
    },
        {

            type: AstType.DeclarationVariable,
            kind: 'var',
            variable: {
                tokenType: TokenType.variable,
                tokenValue:"a",
            },
            value: {
                tokenType: TokenType.number,
                tokenValue: 99,
            }
        }]
    const result = parser(tokenList, 0)
    ensure(equals(result, expect), '### test_declaration_15 parser')

}

const test_if_statement_1 = () => {
    //只有if
    const code = `if (1) {
        var c = 99
    }`
    log("测试代码:", code)


    const tokenList = [
        {tokenValue: 'if', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: "{", tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: "c", tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 99, tokenType: TokenType.number},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "}", tokenType: TokenType.curlyRight},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_if_statement_1 tokenzier')
    // log('my tokens', myTokens, tokenList)


    const result = parser(tokenList, 0)

    const expect = [{
        type: AstType.StatementIf,
        // if块运行的条件, 可以是表达式等
        condition: {
            tokenType: TokenType.number,
            tokenValue: 1
        },
        // if的condition为true时，执行的作用域
        consequent: {
            type: AstType.StatementBlock,
            body: [
                // 函数体是一条条语句组成的，所以是数组
                {
                    type: AstType.DeclarationVariable,
                    kind: 'var',
                    variable:{
                        tokenType: TokenType.variable,
                        tokenValue:"c",
                    },
                    value: {
                        tokenType: TokenType.number,
                        tokenValue: 99,
                    }
                },
            ]
        },
        alternate: {
        }
    }]
    // ensure(equals(result, expect), '### test_if_statement_1 parser')
}

const test_if_statement_2 = () => {
    //只有if
    const code = `if (1) {
    }`
    log("测试代码:", code)

    // const tokenList = new TokenList(code)

    const tokenList = [
        {tokenValue: 'if', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: "{", tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},
        {tokenValue: "}", tokenType: TokenType.curlyRight},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_if_statement_2 tokenizer')


    const result = parser(tokenList, 0)

    const expect = [{
        type: AstType.StatementIf,
        // if块运行的条件, 可以是表达式等
        condition: {
            tokenType: TokenType.number,
            tokenValue: 1
        },
        // if的condition为true时，执行的作用域
        consequent: {
            type: AstType.StatementBlock,
            body: [

            ]
        },
        alternate: {
        }
    }]
    ensure(equals(result, expect), '### test_if_statement_2 parser')
}
const test_if_statement_3 = () => {
    //只有if
    const code = `if (1) {
        var c = 99
    }`
    log("测试代码:", code)

    const tokenList = [
        {tokenValue: 'if', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: "{", tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: "c", tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 99, tokenType: TokenType.number},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "}", tokenType: TokenType.curlyRight},
    ]

    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_if_statement_3 tokenizer')


    const result = parser(tokenList, 0)

    const expect = [{
        type: AstType.StatementIf,
        // if块运行的条件, 可以是表达式等
        condition: {
            tokenType: TokenType.number,
            tokenValue: 1
        },
        // if的condition为true时，执行的作用域
        consequent: {
            type: AstType.StatementBlock,
            body: [
                // 函数体是一条条语句组成的，所以是数组
                {
                    type: AstType.DeclarationVariable,
                    kind: 'var',
                    variable:{
                        tokenType: TokenType.variable,
                        tokenValue:"c",
                    },
                    value: {
                        tokenType: TokenType.number,
                        tokenValue: 99,
                    }
                },
            ]
        },
        alternate: {
        }
    }]
    ensure(equals(result, expect), '### test_if_statement_3 parser')
}
const test_if_statement_4 = () => {
    //if else
    const code = `if (true) {
    } else {
    }`
    log("测试代码:", code)

    // const tokenList = new TokenList(code)

    const tokenList = [
        {tokenValue: 'if', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: true, tokenType: TokenType.boolean},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: "{", tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "}", tokenType: TokenType.curlyRight},
        {tokenValue: 'else', tokenType: TokenType.keyword},
        {tokenValue: "{", tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "}", tokenType: TokenType.curlyRight},

    ]

    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_if_statement_4 tokenizer')
    // log('my tokens', myTokens, tokenList)


    const result = parser(tokenList, 0)

    const expect = [{
        type:  AstType.StatementIf,
        // if块运行的条件, 可以是表达式等
        condition: {
            tokenType: TokenType.boolean,
            tokenValue: true
        },
        // if的condition为true时，执行的作用域
        consequent: {
            type: AstType.StatementBlock,
            body: [
            ]
        },
        // else的作用域
        alternate: {
            type: AstType.StatementBlock,
            body: [
            ]
        }
    }]
    ensure(equals(result, expect), '### test_if_statement_4 parser')
}
const test_if_statement_5 = () => {
    //if else
    const code = `if (1) {
        var c = 99
    } else {
        var a = 100
    }`
    log("测试代码:", code)

    // const tokenList = new TokenList(code)

    const tokenList = [
        {tokenValue: 'if', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: "{", tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: "c", tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 99, tokenType: TokenType.number},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "}", tokenType: TokenType.curlyRight},
        {tokenValue: 'else', tokenType: TokenType.keyword},
        {tokenValue: "{", tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: "a", tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 100, tokenType: TokenType.number},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "}", tokenType: TokenType.curlyRight},

    ]

    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '###  test_if_statement_5 tokenizer')

    const result = parser(tokenList, 0)

    const expect = [{
        type:  AstType.StatementIf,
        // if块运行的条件, 可以是表达式等
        condition: {
            tokenType: TokenType.number,
            tokenValue: 1
        },
        // if的condition为true时，执行的作用域
        consequent: {
            type: AstType.StatementBlock,
            body: [
                // 函数体是一条条语句组成的，所以是数组
                {
                    type: AstType.DeclarationVariable,
                    kind: 'var',
                    variable: {
                        tokenType: TokenType.variable,
                        tokenValue:"c",
                    },
                    value: {
                        tokenType: TokenType.number,
                        tokenValue: 99,
                    }
                },
            ]
        },
        // else的作用域
        alternate: {
            type: AstType.StatementBlock,
            body: [
                // 函数体是一条条语句组成的，所以是数组
                {
                    type: AstType.DeclarationVariable,
                    kind: 'var',
                    variable:{
                        tokenType: TokenType.variable,
                        tokenValue:"a",
                    },
                    value: {
                        tokenType: TokenType.number,
                        tokenValue: 100,
                    }
                },
            ]
        }
    }]
    ensure(equals(result, expect), '### test_if_statement_5 parser')
}


const test_if_statement_6 = () => {
    const code = ` if (1) {
    } else if (2) {
    } else {
    }`
    log("测试代码:", code)

    // const tokenList = new TokenList(code)

    const tokenList = [
        {tokenValue: 'if', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: "{", tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},


        {tokenValue: "}", tokenType: TokenType.curlyRight},
        {tokenValue: 'else', tokenType: TokenType.keyword},
        {tokenValue: 'if', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: 2, tokenType: TokenType.number},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: "{", tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},


        {tokenValue: "}", tokenType: TokenType.curlyRight},
        {tokenValue: 'else', tokenType: TokenType.keyword},
        {tokenValue: "{", tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},


        {tokenValue: "}", tokenType: TokenType.curlyRight},

    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_if_statement_6 tokenizer')
    // log('my tokens', myTokens, tokenList)


    const result = parser(tokenList, 0)

    const expect =  [{
        type:  AstType.StatementIf,
        // if块运行的条件, 可以是表达式等
        condition: {
            tokenType: TokenType.number,
            tokenValue: 1
        },
        // if的condition为true时，执行的作用域
        consequent: {
            type: AstType.StatementBlock,
            body: [
            ]
        },
        // else的作用域
        alternate: {
            type: AstType.StatementIf,
            condition: {
                tokenType: TokenType.number,
                tokenValue: 2
            },
            consequent: {
                type: AstType.StatementBlock,
                body: [
                ]
            },
            alternate: {
                type: AstType.StatementBlock,
                body: [
                ]

            }
        }
    }]
    ensure(equals(result, expect), '### test_if_statement_6 parser')
}


const test_if_statement_7 = () => {
    //if ifelse  else
    const code = ` if (1) {
        var a = 99
    } else if (2) {
        var b = 100
    } else {
        var c = 199
    }`
    log("测试代码:", code)

    // const tokenList = new TokenList(code)

    const tokenList = [
        {tokenValue: 'if', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: "{", tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: "a", tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 99, tokenType: TokenType.number},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "}", tokenType: TokenType.curlyRight},
        {tokenValue: 'else', tokenType: TokenType.keyword},
        {tokenValue: 'if', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: 2, tokenType: TokenType.number},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: "{", tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: "b", tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 100, tokenType: TokenType.number},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "}", tokenType: TokenType.curlyRight},
        {tokenValue: 'else', tokenType: TokenType.keyword},
        {tokenValue: "{", tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: "c", tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 199, tokenType: TokenType.number},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "}", tokenType: TokenType.curlyRight},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_if_statement_7 tokenizer')

    const result = parser(tokenList, 0)

    const expect =  [{
        type:  AstType.StatementIf,
        // if块运行的条件, 可以是表达式等
        condition: {
            tokenType: TokenType.number,
            tokenValue: 1
        },
        // if的condition为true时，执行的作用域
        consequent: {
            type: AstType.StatementBlock,
            body: [
                // 函数体是一条条语句组成的，所以是数组
                {
                    type: AstType.DeclarationVariable,
                    kind: 'var',
                    variable: {
                        tokenType: TokenType.variable,
                        tokenValue:"a",
                    },
                    value: {
                        tokenType: TokenType.number,
                        tokenValue: 99,
                    }
                },
            ]
        },
        // else的作用域
        alternate: {
            type: AstType.StatementIf,
            condition: {
                tokenType: TokenType.number,
                tokenValue: 2
            },
            consequent: {
                type: AstType.StatementBlock,
                body: [
                    {
                        type: AstType.DeclarationVariable,
                        kind: 'var',
                        variable: {
                            tokenType: TokenType.variable,
                            tokenValue:"b",
                        },
                        value: {
                            tokenType: TokenType.number,
                            tokenValue: 100,
                        }
                    },
                ]
            },
            alternate: {
                type: AstType.StatementBlock,
                body: [
                    {
                        type: AstType.DeclarationVariable,
                        kind: 'var',
                        variable: {
                            tokenType: TokenType.variable,
                            tokenValue:"c",
                        },
                        value: {
                            tokenType: TokenType.number,
                            tokenValue: 199,
                        }
                    },
                ]

            }
        }
    }]
    ensure(equals(result, expect), '### test_if_statement_7 parser')
}

const test_while_statement_1 = () => {
    //while
    const code = `while (true) {
    }`
    log("测试代码:", code)

    // const tokenList = new TokenList(code)

    const tokenList = [
        {tokenValue: 'while', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: true, tokenType: TokenType.boolean},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: "{", tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},


        {tokenValue: "}", tokenType: TokenType.curlyRight},
    ]

    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_while_statement_1 tokenizer')

    const result = parser(tokenList, 0)

    const expect = [{
        type: AstType.StatementWhile,
        condition: {
            tokenType: TokenType.boolean,
            tokenValue: true
        },
        // while的condition为true时，执行的作用域
        body: {
            type: AstType.StatementBlock,
            body: [
            ]
        }
    }]
    // log("finally expect", expect)
    ensure(equals(result, expect), '### test_while_statement_1 parser')
}
const test_while_statement_2 = () => {
    //while
    const code = `while (true) {
        var a = 99
    }`
    log("测试代码:", code)

    // const tokenList = new TokenList(code)

    const tokenList = [
        {tokenValue: 'while', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},
        {tokenValue: true, tokenType: TokenType.boolean},
        {tokenValue: ',', tokenType: TokenType.comma},
        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: "{", tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: "a", tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 99, tokenType: TokenType.number},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "}", tokenType: TokenType.curlyRight},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_while_statement_2 tokenizer')

    const result = parser(tokenList, 0)

    const expect = [{
        type: AstType.StatementWhile,
        condition: {
            tokenType: TokenType.boolean,
            tokenValue: true
        },
        // while的condition为true时，执行的作用域
        body: {
            type: AstType.StatementBlock,
            body: [
                // 函数体是一条条语句组成的，所以是数组
                {
                    type: AstType.DeclarationVariable,
                    kind: 'var',
                    variable:{
                        tokenType: TokenType.variable,
                        tokenValue:"a",
                    },
                    value: {
                        tokenType: TokenType.number,
                        tokenValue: 99,
                    }
                },
            ]
        }
    }]
    // log("finally expect", expect)
    ensure(equals(result, expect), '### test_while_statement_2 parser')
}
const test_for_statement_1 = () => {
    //for
    const code = `for(var i = 0; i < 10; i = 1 + i) {
        var a = 99
    }`
    log("测试代码:", code)


    const tokenList = [
        {tokenValue: 'for', tokenType: TokenType.keyword},
        {tokenValue: '(', tokenType: TokenType.parenthesesLeft},

        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: "i", tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 0, tokenType: TokenType.number},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "i", tokenType: TokenType.variable},
        {tokenValue: '<', tokenType: TokenType.lessThan},
        {tokenValue: 10, tokenType: TokenType.number},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "i", tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 1, tokenType: TokenType.number},
        {tokenValue: '+', tokenType: TokenType.plus},
        {tokenValue: "i", tokenType: TokenType.variable},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: ')', tokenType: TokenType.parenthesesRight},
        {tokenValue: "{", tokenType: TokenType.curlyLeft},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "var", tokenType: TokenType.keyword},
        {tokenValue: "a", tokenType: TokenType.variable},
        {tokenValue: '=', tokenType: TokenType.assign},
        {tokenValue: 99, tokenType: TokenType.number},
        {tokenValue: ";", tokenType: TokenType.semicolon},

        {tokenValue: "}", tokenType: TokenType.curlyRight},
    ]
    let myTokens = toTokens(code)
    ensure(equals(myTokens, tokenList), '### test_for_statement_1 tokenizer')
    // log('my tokens', myTokens, tokenList)


    const expect =  [{
        type: AstType.StatementFor,
        // 初始化
        init: {
            type: AstType.DeclarationVariable,
            kind: 'var',
            variable: {
                tokenType: TokenType.variable,
                tokenValue:"i",
            },
            value: {
                tokenType: TokenType.number,
                tokenValue: 0,
            }

        },
        // for的循环判断
        condition: {
            type: AstType.ExpressionBinary,
            operator: {
                tokenType: TokenType.lessThan,
                tokenValue: "<",
            },
            left: {
                tokenType: TokenType.variable,
                tokenValue: "i",
            },
            right: {
                tokenType:  TokenType.number,
                tokenValue: 10,
            }
        },
        // for的变量更新
        update: {
            type: AstType.ExpressionAssignment,
            operator: {
                tokenType: TokenType.assign,
                tokenValue: '='
            },
            left: {
                tokenType: TokenType.variable,
                tokenValue: 'i',
            },
            right: {
                type: AstType.ExpressionBinary,
                operator: {
                    tokenType: TokenType.plus,
                    tokenValue: "+",
                },
                left: {
                    tokenType: TokenType.number,
                    tokenValue: 1,
                },
                right:
                    {
                        tokenType: TokenType.variable,
                        tokenValue: 'i',
                    },
            }
        },
        body: {
            type: AstType.StatementBlock,
            body: [
                // 函数体是一条条语句组成的，所以是数组
                {
                    type: AstType.DeclarationVariable,
                    kind: 'var',
                    variable: {
                        tokenType: TokenType.variable,
                        tokenValue:"a",
                    },
                    value: {
                        tokenType: TokenType.number,
                        tokenValue: 99,
                    }
                },
            ]
        }
    }]
    // log("tokens", tokenList)
    // log("finally expect", expect)
    const result = parser(tokenList, 0)
    ensure(equals(result, expect), '### test_for_statement_1 parser')
}

const __main = () => {
    test_expression_1()
    test_expression_2()
    test_expression_3()
    test_expression_4()
    test_expression_5()
    test_expression_6()
    test_expression_7()
    test_expression_8()
    test_expression_9()

    test_declaration_1()
    test_declaration_2()
    test_declaration_3()
    test_declaration_4()
    test_declaration_5()
    test_declaration_6()
    test_declaration_7()
    test_declaration_8()
    test_declaration_9()
    test_declaration_10()
    test_declaration_11()
    test_declaration_12()
    test_declaration_13()
    test_declaration_14()
    test_declaration_15()

    test_if_statement_1()
    test_if_statement_2()
    test_if_statement_3()
    test_if_statement_4()
    test_if_statement_5()
    test_if_statement_6()
    test_if_statement_7()

    test_while_statement_1()
    test_while_statement_2()

    test_for_statement_1()
}

__main()
