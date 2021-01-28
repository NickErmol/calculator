class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
        this.updateFlag = false;
        this.equalFlag = false;
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0,-1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
        if (this.equalFlag) {
            // this.previousOperand = '';
            this.currentOperand = '';
            this.currentOperand = this.currentOperand.toString() + number.toString();
            this.equalFlag = false;
        }
    }

    chooseOperation(operation) {
        let tempCurrentOperand;
        tempCurrentOperand = this.currentOperand;
        // if (this.previousOperandTextElement.innerText.includes('sqrt')){
        //     this.updateFlag = true;
        //     this.operation = operation;
        //     return;
        // }
        if (this.currentOperand === '') return;
        //FIRST Attempt
        // this.operation = operation;
        // if (this.previousOperand !== '' || operation == 'Х²'|| operation == '√' ) {
        //     this.operation = operation;
        //     this.compute();
        // }

        //second attempt
        // if (this.previousOperand !== '') {
        //     this.compute();
        // } else if (operation == 'Х²'|| operation == '√') {
        //     this.operation = operation;
        //     this.compute();
        // }

        //third attempt
        if (this.previousOperand !== '') {
            this.compute();
        } else if (operation == '√') {
            this.operation = operation;
            this.compute();
        }

        this.operation = operation;
        
        //third attempt
        // if (operation === 'Х²' || operation === '√') {
        //     this.previousOperand = tempCurrentOperand;
        //     this.currentOperand = this.computation;
        // } else {
        //     this.previousOperand = this.currentOperand;
        //     this.currentOperand = '';
        // }
        if (operation === '√') {
            this.previousOperand = tempCurrentOperand;
            this.currentOperand = this.computation;
        } else {
            this.previousOperand = this.currentOperand;
            this.currentOperand = '';
        }
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (this.equalFlag && this.operation === '√' ) return;
        if ((isNaN(prev) && (this.operation !== 'Х²'&& this.operation !== '√' ))|| isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            case 'Х²':
                // computation = Math.pow(current, 2);
                computation = Math.pow(prev , current);
                break;
            case '√':
                computation = Math.sqrt(current);
                this.equalFlag = true;
                break;    
            default:
                return;    
        } 
        this.computation = parseFloat(computation.toFixed(10));
        this.currentOperand = this.computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
        integerDisplay ='';
    } else {
        integerDisplay = integerDigits.toLocaleString('en',{maximumFractionDigits: 0});
    }
    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
    } else {
        return integerDisplay;
    }
}

updateDisplay() {
    // if (this.updateFlag){
    //     this.updateFlag = false;
    //     this.previousOperandTextElement.innerText =
    //     `${this.getDisplayNumber(this.currentOperand)} ${this.operation}`;
    //     this.currentOperandTextElement.innerText = '';
    //     this.previousOperand = this.currentOperand;
    //     this.currentOperand = '';
    //     return;
    // }
    this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
        switch (this.operation) {
            case 'Х²':
                this.previousOperandTextElement.innerText =
            `sqr(${this.getDisplayNumber(this.previousOperand)})`;
                break;
            case '√':
                if (this.previousOperand <= 0) {
                    this.currentOperandTextElement.innerText = 'Введены неверные данные';
                    this.previousOperand = '';
                    this.currentOperand = '';
                    return;
                }
                this.previousOperandTextElement.innerText =
            `sqrt(${this.getDisplayNumber(this.previousOperand)})`;
                break;
            default:  
                this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        }
    } else {
        this.previousOperandTextElement.innerText = '';
    }
} 

updateSignDisplay(){
    this.currentOperand = - this.currentOperand;
    this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
}

}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const signOperationButton = document.querySelector('[data-sign-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    })
})

equalsButton.addEventListener('click', button => {
    calculator.equalFlag = true;
    calculator.compute();
    calculator.updateDisplay();
})

signOperationButton.addEventListener('click', button => {
    calculator.updateSignDisplay();
})

allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
})

deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
})