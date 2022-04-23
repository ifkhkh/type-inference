const processBracketRight = (stackNode, stackOperator) => {
    // 遇到右方括号, 说明遇到数组结尾或对象取值结尾
    while (true) {
        let operator = stackOperator.pop()
        if (isType(operator, TokenType.variable)) {
            // stackOperator 的栈顶是数组名/对象名
            // 需要从 stackNode 中拿到下标节点
            let offset = stackNode.pop()
            let ast = {
                type: AstType.ObjectProperty,
                object: operator,
                property: offset,
            }
            stackNode.push(ast)
            break
        } else {
            // 操作符栈的栈顶是普通操作符 op
            // pop stackNum 与 op 组成节点, 然后push 进 stackNode
            // 进入下一个循环, 直到遇到数组名/对象名
            // todo: 重复的代码
            if (isType(operator, TokenType.not)) {
                // not 只有一个操作数，要单独处理
                let right = stackNode.pop()
                let ast = {
                    type: AstType.ExpressionBinary,
                    operator,
                    right: right,
                }
                stackNode.push(ast)
            } else {
                // 普通的有两个操作数的操作符
                let right = stackNode.pop()
                let left = stackNode.pop()
                let ast = {
                    type: AstType.ExpressionBinary,
                    operator,
                    left: left,
                    right: right,
                }
                stackNode.push(ast)
            }
        }
    }
}

const processParenthesesRight = (stackNode, stackOperator) => {
    // 右圆括号有两种情况
    // 1. 提升运算为最高级
    // 2. 函数调用
    while (true) {
        let operator = stackOperator.pop()
        if (isType(operator, TokenType.parenthesesLeft)) {
            // 栈顶是左圆括号, 说明是第一种情况
            // 此时直接结束掉循环, 因为提升的运算数据已经在 stackNode 中
            break
        } else if (isType(operator, TokenType.variable)) {
            // 栈顶是变量名, 说明是第二种情况
            // 这时需要从 stackNode 中拿到参数列表
            // 和函数名一起组成节点，push 进 stackNode
            // 最后直接结束循环
            let as = []
            while (true) {
                let t = stackNode.pop()
                if (isType(t, TokenType.parenthesesLeft)) {
                    break
                }
                as.unshift(t)
            }
            let ast = {
                type: AstType.ExpressionCall,
                callee: operator,
                arguments: as,
            }
            stackNode.push(ast)
            break
        } else {
            // 操作符栈的栈顶是普通操作符 op
            // pop stackNode 与 op 组成节点
            // push 进 stackNode 里
            // 开始下一个循环
            if (isType(operator, TokenType.not)) {
                // not 只有一个操作数，要单独处理
                let right = stackNode.pop()
                let ast = {
                    type: AstType.ExpressionUnary,
                    operator,
                    right: right,
                }
                stackNode.push(ast)
            } else if (isType(operator, TokenType.dot)) {
                let property = stackNode.pop()
                let object = stackNode.pop()
                let ast = {
                    type: AstType.ObjectProperty,
                    object,
                    property,
                }
                stackNode.push(ast)
            } else {
                // 普通的有两个操作数的操作符
                let right = stackNode.pop()
                let left = stackNode.pop()
                let ast = {
                    type: AstType.ExpressionBinary,
                    operator,
                    left: left,
                    right: right,
                }
                stackNode.push(ast)
            }
        }
    }
}

const processOperator = (currentToken, stackNode, stackOperator) => {
    let currT = currentToken
    if (stackOperator.length === 0) {
        // stackOperator 是空的, 不用比较优先级, 直接进栈
        stackOperator.push(currT)
    } else {
        // 需要比较 stackOperator 顶的元素
        // 如果当前运算符优先级比栈顶优先级高
        // 直接 push 进 stackOperator
        // 如果当前运算符优先级比栈顶优先级低
        // 则把栈顶元素 pop 出来，同时 stackNode 也要 pop 两个元素，组成一个节点
        // 然后把节点 push 进 stackNode
        // 直到 stackOperator 为空, 或者 pop 出的元素运算符优先级比 current Type op 低
        while (true) {
            let op = stackOperator.pop()
            let c = compareOpPriority(op, currT)
            if (c > 1) {
                // current op 优先级小于或等于栈顶 op
                // todo: 重复的代码
                if (isType(op, TokenType.not)) {
                    let right = stackNode.pop()
                    let ast = {
                        type: AstType.ExpressionUnary,
                        operator: op,
                        right: right,
                    }
                    stackNode.push(ast)
                } else {
                    let right = stackNode.pop()
                    let left = stackNode.pop()
                    let ast = {
                        type: AstType.ExpressionBinary,
                        operator: op,
                        left: left,
                        right: right,
                    }
                    stackNode.push(ast)
                }
            } else {
                // current op 优先级大于栈顶 op
                // 把取出的 op 放回栈里
                stackOperator.push(op)
                stackOperator.push(currT)
                break
            }
            // 当 stackOperator 所有的 op 都被 pop 出去了
            // 此时stackOperator 为空时
            // 则把 currT push 进 stackOperator
            // 然后结束循环
            if (stackOperator.length === 0) {
                stackOperator.push(currT)
                break
            }
        }
    }
}

const parseArray = (tokenList, index) => {
    // 遇到右边方括号说明数组取到了结尾
    // 用于计算中括号
    // 进入了此函数说明遇到了 [
    let bracket = 1
    let elements = []
    // 跳过 [
    index += 1
    let start = index
    while (index < tokenList.length) {
        let currT = tokenList[index]
        if (isType(currT, TokenType.bracketLeft)) {
            bracket += 1
        } else if (isType(currT, TokenType.bracketRight)) {
            bracket -= 1
        }

        // 遇到 , 说明逗号前是一个数组元素或者表达式
        // 而且在 tokenizer 给数组尾元素插入了尾逗号
        // 所以可以根据逗号取每一个数组元素
        if (isType(currT, TokenType.comma)) {
            let l = tokenList.slice(start, index)
            let [ast, offset] = parseExpression(l)
            start = index + 1
            index += offset
            elements.push(ast)
        }

        // 检测是否遇到数组结尾
        if (bracket === 0) {
            break
        }

        index += 1
    }
    let ast = {
        type: AstType.ExpressionArray,
        elements,
    }
    return [ast, index]
}

const parseObjectElement = (tokenList, index) => {
    let len = tokenList.length
    let ast = {
        type: AstType.ExpressionObject,
        key: tokenList[0],
        value: tokenList[len - 1]
    }
    return [ast, len]
}

const parseObject = (tokenList, index) => {
    // 遇到右边大括号说明数组取到了结尾
    // 用于计算大括号
    // 进入了此函数说明遇到了 {
    let bracket = 1
    let properties = []
    // 跳过 {
    index += 1
    let start = index
    while (index < tokenList.length) {
        let currT = tokenList[index]
        if (isType(currT, TokenType.bracketLeft)) {
            bracket += 1
        } else if (isType(currT, TokenType.bracketRight)) {
            bracket -= 1
        } else if (isType(currT, TokenType.semicolon)) {
            index += 1
            start += 1
            continue
        }

        // 遇到 , 说明逗号前是一个对象元素或者表达式
        // 而且在 tokenizer 给数组尾元素插入了尾逗号
        // 所以可以根据逗号取每一个对象元素
        if (isType(currT, TokenType.comma)) {
            let l = tokenList.slice(start, index)
            let [ast, offset] = parseObjectElement(l)
            start = index + 1
            index += offset
            properties.push(ast)
        }

        // 检测是否遇到对象结尾
        if (bracket === 0) {
            break
        }

        index += 1
    }
    let ast = {
        type: AstType.ExpressionObject,
        properties,
    }
    return [ast, index]
}

const parseParams = (tokenList, index) => {
    let params = []
    // 把参数都取出来
    while (true) {
        index += 1
        let e = tokenList[index]
        if (isType(e, TokenType.variable)) {
            params.push(e)
        }
        // 遇到右圆括号说明参数已经取完了
        if (isType(e, TokenType.parenthesesRight)) {
            break
        }
    }
    return [params, index]
}

const parseBody = (tokenList, index) => {
    let body = []
    let bracket = 1
    let start = index + 1
    // 把函数体都取出来
    while (true) {
        index += 1
        let e = tokenList[index]
        if (isType(e, TokenType.curlyLeft)) {
            bracket += 1
        } else if (isType(e, TokenType.curlyRight)) {
            bracket -= 1
        }

        if (bracket === 0) {
            let tokens = tokenList.slice(start, index)
            let ast = parser(tokens)
            if (ast !== undefined) {
                body.push(...ast)
            }
            index += 1
            break
        }
    }
    let ast = {
        type: AstType.StatementBlock,
        body,
    }
    return [ast, index]
}

const parseFunction = (tokenList, index) => {
    let [params, i] = parseParams(tokenList, index + 1)
    let [body, offset] = parseBody(tokenList, i + 1)
    let ast = {
        type: AstType.ExpressionFunction,
        params,
        body,
    }
    return [ast, offset]
}

const parseClass = (tokenList, index) => {
    // class 暂时用不到 params
    let [params, i] = parseParams(tokenList, index + 1)
    let [body, offset] = parseBody(tokenList, i + 1)
    let ast = {
        type: AstType.ExpressionClass,
        body,
    }
    return [ast, offset]
}

const parseValue = (tokenList, index) => {
    let t = tokenList[index]
    if (isType(t, TokenType.bracketLeft)) {
        return parseArray(tokenList, index)
    } else if (isType(t, TokenType.curlyLeft)) {
        return parseObject(tokenList, index)
    } else if (isType(t, TokenType.keyword) && t.tokenValue === 'function') {
        return parseFunction(tokenList, index)
    }  else if (isType(t, TokenType.keyword) && t.tokenValue === 'class') {
        return parseClass(tokenList, index)
    } else {
        let [ast, offset] = parseExpression(tokenList, index)
        return [ast, offset]
    }
}

const parseExpression = (tokenList, index=0) => {
    let stackNode = []
    let stackOperator = []
    while (index < tokenList.length) {
        let currT = tokenList[index]
        let nextT = tokenList[index + 1]
        if (isType(currT, TokenType.variable) && isType(nextT, TokenType.bracketLeft)) {
            // 变量名后面接左方括号，说明这个变量是一个数组或对象，正在取值，方括号内部是数组下标或对象属性名
            // 把数组名/对象名放入 stackOperator 中
            stackOperator.push(currT)
            index += 2
        } else if (isType(currT, TokenType.bracketLeft)) {
            // 遇到左方括号，说明是数组表达式
            let [ast, offset] = parseArray(tokenList, index)
            stackNode.push(ast)
            index += offset
        }  else if (isType(currT, TokenType.bracketRight)) {
            // 处理右大括号
            processBracketRight(stackNode, stackOperator)
            index += 1
        } else if (isType(currT, TokenType.variable) && isType(nextT, TokenType.parenthesesLeft)) {
            // 变量名后面接左圆括号，说明这个变量是一个函数
            // 正在调用它，圆括号内部是函数的参数列表
            // 把变量名放入 stackOperator 中
            stackOperator.push(currT)
            // 因为不确定参数的个数，所以把左圆括号放入 stackNode 中
            // 用于标记参数的起始位置
            stackNode.push(nextT)
            index += 2
        } else if (isType(currT, TokenType.parenthesesLeft)) {
            // 遇到单独左圆括号 (前面没有函数变量名)
            // 说明是普通的提升运算优先级的圆括号
            stackOperator.push(currT)
            index += 1
        } else if (isType(currT, TokenType.parenthesesRight)) {
            // 处理右圆括号
            processParenthesesRight(stackNode, stackOperator)
            index += 1
        } else if (isOperatorToken(currT)) {
            // 处理操作符
            processOperator(currT, stackNode, stackOperator)
            index += 1
        } else if (isType(currT, TokenType.semicolon)) {
            // 分号结束表达式
            index += 1
            break
        } else if (isType(currT, TokenType.comma)) {
            // 逗号跳过
            index +=1
        } else {
            stackNode.push(currT)
            index += 1
        }
    }

    // 表达式解析完，stackOp 中剩余的 op 继续组节点
    while (stackOperator.length !== 0) {
        let operator = stackOperator.pop()
        if (isType(operator, TokenType.not)) {
            let right = stackNode.pop()
            let ast = {
                type: AstType.ExpressionUnary,
                operator,
                right,
            }
            stackNode.push(ast)
        } else if (isType(operator, TokenType.dot)) {
            let right = stackNode.pop()
            let left = stackNode.pop()
            // 检查是否是类方法调用
            let ast = {}
            if (right.type !== undefined && isType(right.type, AstType.ExpressionCall)) {
                // 类方法调用
                ast.type = AstType.ExpressionCall
                ast.callee = {
                    type: AstType.ObjectProperty,
                    object: left,
                    property: right.callee,
                }
                ast.arguments = right.arguments
            } else {
                // 对象访问属性
                ast.type = AstType.ObjectProperty
                ast.object = left
                ast.property = right
            }
            stackNode.push(ast)
        } else {
            let right = stackNode.pop()
            let left = stackNode.pop()
            let ast = {
                type: AstType.ExpressionBinary,
                operator,
                left,
                right,
            }
            stackNode.push(ast)
        }
    }

    return [stackNode[0], index]
}

const parseStatementDeclaration = (tokenList, index) => {
    let ast = {
        type: AstType.StatementDeclaration,
        kind: tokenList[index].tokenValue,
    }
    // 跳过声明关键字
    let start = index + 1
    while (index < tokenList.length) {
        let currT = tokenList[index]
        // 取变量
        if (isType(currT, TokenType.assign)) {
            let v = tokenList.slice(start, index)
            ast.variable = parseExpression(v)[0]
            break
        }
        index += 1
    }
    // 取值
    let [r, i] = parseValue(tokenList, index + 1)
    ast.value = r
    // 统一计算 value parse 后的偏移
    let offset = i - start + 1
    return [ast, offset]
}

const parseStatementAssignment =(tokenList, index) => {
    let ast = {
        type: AstType.StatementAssignment,
    }
    let start = index
    while (index < tokenList.length) {
        let next = tokenList[index]
        if (isAssignsToken(next)) {
            let v = tokenList.slice(start, index)
            ast.left = parseExpression(v)[0]
            break
        }
        index += 1
    }
    ast.operator = tokenList[index]
    let [r, j] = parseValue(tokenList, index + 1)
    ast.right = r
    return [ast, j]
}

const parseVariable = (tokenList, index) => {
    let hasAssign = false
    let t = TokenType
    for (let i = index; i < tokenList.length; i++) {
        let next = tokenList[i]
        if (isAssignsToken(next)) {
            hasAssign = true
            break
        }
        // 遇到分号说明是语句结束
        // 说明没有找到 assign
        if (isType(next, t.semicolon)) {
            break
        }
    }
    if (hasAssign) {
        let [ast, offset] = parseStatementAssignment(tokenList, index)
        return [ast, offset]
    } else {
        return []
    }
}

const parseCondition = (tokenList, index) => {
    let l = tokenList.slice(index)
    let i = l.findIndex(t => isType(t, TokenType.parenthesesRight))
    let tokens = tokenList.slice(index + 1, index + i)
    let ast = parseExpression(tokens)[0]
    return [ast, index + i]
}

const parseIfConsequent = (tokenList, index) => {
    let [ast, offset] = parseBody(tokenList, index + 1)
    return [ast, offset]
}

const parseIfAlternate = (tokenList, index) => {
    let [ast, offset] = parseBody(tokenList, index + 1)
    return [ast, offset]
}

const parseStatementIf = (tokenList, index) => {
    let ast = {
        type: AstType.StatementIf,
        alternate: {},
    }
    let [cond, i] = parseCondition(tokenList, index + 1)
    let [cons, j] = parseIfConsequent(tokenList, i + 1)
    let offset = j

    // 处理 else if 和 else 的情况
    let t = tokenList[j]
    if (isType(t, TokenType.keyword) && t.tokenValue === 'else') {
        let next = tokenList[j + 1]
        if (isType(t, TokenType.keyword) && next.tokenValue === 'if') {
            [alte, k] = parseStatementIf(tokenList, j + 1)
        } else {
            [alte, k] = parseIfAlternate(tokenList, j + 1)
        }
        ast.alternate = alte
        offset = k
    }
    ast.condition = cond
    ast.consequent = cons
    return [ast, offset]
}

const parseStatementWhile = (tokenList, index) => {
    let ast = {
        type: AstType.StatementWhile,
    }
    let [cond, i] = parseCondition(tokenList, index + 1)
    let [body, offset] = parseBody(tokenList, i + 1)
    ast.condition = cond
    ast.body = body
    return [ast, offset]
}

const parseForInit = (tokenList, index) => {
    return parseStatementDeclaration(tokenList, index)
}

const parseForCondition = (tokenList, index) => {
    return parseExpression(tokenList, index)
}

const parseForUpdate = (tokenList, index) => {
    return parseVariable(tokenList, index)
}

const parseStatementFor = (tokenList, index) => {
    let ast = {
        type: AstType.StatementFor,
    }
    let [init, i] = parseForInit(tokenList, index + 2)
    let [cond, j] = parseForCondition(tokenList, i + index + 2)
    let [upde, k] = parseForUpdate(tokenList, j + index)
    let [body, offset] = parseBody(tokenList, k + 2)
    ast.init = init
    ast.condition = cond
    ast.update = upde
    ast.body = body
    return [ast, offset]
}

const parser = (tokenList, index=0) => {
    let r = []
    while (index < tokenList.length) {
        let currT = tokenList[index]
        if (isType(currT, TokenType.keyword)) {
            if (currT.tokenValue === 'var' || currT.tokenValue === 'const') {
                let [ast, offset] = parseStatementDeclaration(tokenList, index)
                r.push(ast)
                index += offset + 1
            } else if (currT.tokenValue === 'if') {
                let [ast, offset] = parseStatementIf(tokenList, index)
                r.push(ast)
                index += offset + 1
            } else if (currT.tokenValue === 'while') {
                let [ast, offset] = parseStatementWhile(tokenList, index)
                r.push(ast)
                index += offset + 1
            } else if (currT.tokenValue === 'for') {
                let [ast, offset] = parseStatementFor(tokenList, index)
                r.push(ast)
                index += offset + 1
            }
            continue
        } else if (isType(currT, TokenType.variable)) {
            let [ast, offset] = parseVariable(tokenList, index)
            if (ast !== undefined) {
                r.push(ast)
                index += offset + 1
                continue
            }
        }
        let [ast, offset] = parseExpression(tokenList, index)
        if (ast === undefined) {
            index += 1
        } else {
            r.push(ast)
            index += (offset - index) + 1
        }
    }
    return r
}
