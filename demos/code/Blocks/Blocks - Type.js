//A block that can be used for types
Blockly.Blocks['get_type'] = {
    init: function () {

        this.types = [
            ["int", "int"],
            ["size_t", "size_t"],
            ["double", "double"],
            ["char", "char"],
            ["string", "string"],
            ["bool", "bool"],
            ["short", "short"],
            ["long", "long"],
            ["long long", "long long"]
        ];

        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(this.types), 'type');

        this.setOutput(true);
        this.setColour(0);
        this.setTooltip("text");
        this.setHelpUrl("");

        //If this block gets a variable
        this.isGetter_ = true;
    },

    onchange: function () {
        this.allocateValues();
        this.allocateWarnings();
    },

    allocateValues: function () {
        this.typeName_ = this.getFieldValue('type');
    },

    allocateWarnings: function () {
        var TT = "";

        if (TT.length > 0) {
            this.setWarningText(TT);
        } else {
            this.setWarningText(null);
        }
    }
};
Blockly.C['get_type'] = function (block) {
    var code = '';

    code += this.typeName_;

    return [code, Blockly.C.ORDER_NONE];
};

//A block that can be used for any type
Blockly.Blocks['get_input'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput(""), "input");

        this.setOutput(true);
        this.setColour(stringHUE);
        this.setTooltip("This block is used for text in a printf.");
        this.setHelpUrl("");
    },

    onchange: function () {

        this.allocateValues();
        this.allocateWarnings();
    },

    allocateValues: function () {
        this.value_ = this.getField('input').getText();
    },

    allocateWarnings: function () {
        var TT = "";

        if (!this.parentBlock_) {
            TT += 'Block warning, this block has a return and must be connected.\n';
        } else {
            if (this.parentBlock_.type !== "printf") {
                TT += 'Block Error, this block is used for printf text.\n';
            }
        }


        if (TT.length > 0) {
            this.setWarningText(TT);
        } else {
            this.setWarningText(null);
        }
    }
};
Blockly.C['get_input'] = function (block) {
    var code = '';

    code += this.value_;

    return [code, Blockly.C.ORDER_NONE];
};

Blockly.Blocks['get_var'] = {
    init: function () {

        this.paramNames_ = [["", ""]];

        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(this.allocateDropdown.bind(this)), "VAR");
        this.setOutput(true, null);
        this.setColour(variableHUE);
        this.setTooltip("A block to get variables.");
        this.setHelpUrl("");

        this.paramCount_ = 0;

        //value
        this.value_ = "";

        //If this is a const
        this.isConst_ = false;

        //If the main variable has been initialized
        this.isInitialized_ = false;

        //If this block gets a variable
        this.isGetter_ = true;

        this.isInClass_ = false;

    },

    onchange: function () {
        this.allocateValues();
        this.allocateVariableParameters();

        this.allocateVariables();

        this.allocateScope();
        this.allocateWarnings();
    },

    allocateVariables: function () {
        let i;
        let C = C_Logic;

        const options = [];
        options.push(["", ""]);

        //Previous declaration
        let ptr = this.parentBlock_;
        while (ptr) {
            switch (ptr.getDataStr()) {
                case 'isVar':
                    if (ptr.isPointer_ !== true) {
                        options.push([ptr.getVar_, ptr.getVar_]);
                    }

                    this.paramCount_ = ptr.paramCount_;

                    break;
            }
            ptr = ptr.parentBlock_;
        }
		
		ptr = this.parentBlock_;
		while(ptr)
		{
			if (ptr.type === 'include_file')
			{
                for (i = 0; i < ptr.classVarPublic_.length; i++)
				{
                    options.push([ptr.classVarPublic_[i][3], ptr.classVarPublic_[i][3]]);
                        if (this.getVar_ === ptr.classVarPublic_[i][3]) {
                            this.isConst_ = ptr.classVarPublic_[i][0];
                            this.typeName_ = ptr.classVarPublic_[i][1];
                            this.ptrType_ = ptr.classVarPublic_[i][2];
                        }
				}
                for (i = 0; i < ptr.classVarProtected_.length; i++)
				{
                    options.push([ptr.classVarProtected_[i][3], ptr.classVarProtected_[i][3]]);
                        if (this.getVar_ === ptr.classVarProtected_[i][3]) {
                            this.isConst_ = ptr.classVarProtected_[i][0];
                            this.typeName_ = ptr.classVarProtected_[i][1];
                            this.ptrType_ = ptr.classVarProtected_[i][2];
                        }
				}
                for (i = 0; i < ptr.classVarPrivate_.length; i++)
				{
                    options.push([ptr.classVarPrivate_[i][3], ptr.classVarPrivate_[i][3]]);
                        if (this.getVar_ === ptr.classVarPrivate_[i][3]) {
                            this.isConst_ = ptr.classVarPrivate_[i][0];
                            this.typeName_ = ptr.classVarPrivate_[i][1];
                            this.ptrType_ = ptr.classVarPrivate_[i][2];
                        }
				}
			}
			ptr = ptr.parentBlock_;
		}

        ptr = this.getSurroundParent();

        while (ptr) {
            switch (ptr.type) {

                case 'loop_for':
                case 'loop_range':
                    options.push([ptr.getVar_, ptr.getVar_]);
                    if (this.getVar_ === ptr.getVar_) {
                        this.typeName_ = ptr.typeName_;
                    }
                    break;
                case 'ds_member':
                    for (i = 0; i < ptr.classVarPublic_.length; i++) {
                        options.push([ptr.classVarPublic_[i][3], ptr.classVarPublic_[i][3]]);
                        if (this.getVar_ === ptr.classVarPublic_[i][3]) {
                            this.isConst_ = ptr.classVarPublic_[i][0];
                            this.typeName_ = ptr.classVarPublic_[i][1];
                            this.ptrType_ = ptr.classVarPublic_[i][2];
                        }
                    }
					break;
					
                case 'class_constructor':
                    for (i = 0; i < ptr.funcParam_.length; i++) {
                        options.push([ptr.funcParam_[i][3], ptr.funcParam_[i][3]]);
                        if (this.getVar_ === ptr.funcParam_[i][3]) {
                            this.isConst_ = ptr.funcParam_[i][0];
                            this.typeName_ = ptr.funcParam_[i][1];
                            this.ptrType_ = ptr.funcParam_[i][2];
                        }
                    }
                    break;


            }
            switch (ptr.getDataStr()) {
                case 'isStruct':

                    for (i = 0; i < ptr.classVarPublic_.length; ++i) {
                        options.push([ptr.classVarPublic_[i][3], ptr.classVarPublic_[i][3]]);
                    }

                    break;

                case 'isClass':
                    for (i = 0; i < ptr.classVarPublic_.length; ++i) {
                        options.push([ptr.classVarPublic_[i][3], ptr.classVarPublic_[i][3]]);
                    }
                    for (i = 0; i < ptr.classVarPrivate_.length; ++i) {
                        options.push([ptr.classVarPrivate_[i][3], ptr.classVarPrivate_[i][3]]);
                    }
                    for (i = 0; i < ptr.classVarProtected_.length; ++i) {
                        options.push([ptr.classVarProtected_[i][3], ptr.classVarProtected_[i][3]]);
                    }
                    break;


            }


            ptr = ptr.getSurroundParent();
        }


        for (i = 0; i < options.length; ++i) {
            this.paramNames_.push(options[i]);
        }
    },

    allocateVariableParameters: function () {
        var options = [];
        options.push(["", ""]);
        //Loop through to get function variables
        let ptr = this.getSurroundParent();
        while (ptr) {
            switch (ptr.getDataStr()) {
                case 'isFunc':
                    if (ptr.funcParam_) {
                        //Loop through the function array to get the names of parameters
                        for (var i = 0; i < ptr.funcParam_.length; ++i) {
                            options.push([ptr.funcParam_[i][3], ptr.funcParam_[i][3]]);
                            if (this.getVar_ === ptr.funcParam_[i][3]) {
                                this.isConst_ = ptr.funcParam_[i][0];
                                this.typeName_ = ptr.funcParam_[i][1];
                            }
                        }
                    }
                    break;
            }
            ptr = ptr.getSurroundParent();
        }
        for (var i = 0; i < options.length; ++i) {
            this.paramNames_.push(options[i]);
        }
    },

    allocateScope: function () {
        //Get Scope variable
        let ptr = this.getSurroundParent();
        while (ptr) {
            switch (ptr.getDataStr()) {
                case 'isFunc':
                    for (var i = 0; ptr.paramCount_ && i < ptr.paramCount_; ++i) {
                        (ptr && ptr.paramNames_[i]) ? (this.paramNames_.push([ptr.paramNames_[i], ptr.paramNames_[i]])) : (0);
                    }
                    break;
            }
            ptr = ptr.getSurroundParent();
        }
    },

    /**
     * stream through the blocks to find the one we need,
     * then stream the information such as type
     */
    allocateValues: function () {
        this.getVar_ = this.getFieldValue('VAR');
        this.typeName_ = "";
        this.value_ = "";
        this.isConst_ = false;
        this.ptrType_ = "";
        this.isNull_ = false;
        this.paramNames_ = [["", ""]];
        this.isInClass_ = false;

        //Check function parameters using getSurroundParent()
        let ptr = this.getSurroundParent();

        while (ptr) {
            switch (ptr.getDataStr()) {
                case 'isFunc':
                    //get values from function parameter
                    if (ptr.funcParam_) {
                        for (var i = 0; i < ptr.funcParam_.length; ++i) {
                            if (this.getVar_ === ptr.funcParam_[i][3]) {
                                this.isConst_ = ptr.funcParam_[i][0];
                                this.typeName_ = ptr.funcParam_[i][1];
                                this.ptrType_ = ptr.funcParam_[i][2];
                                this.isInitialized_ = ptr.funcParam_[i][4];
                            }
                        }
                    }
                    break;
                case 'isStruct':
                    for (var i = 0; i < ptr.classVarPublic_.length; ++i) {
                        if (this.getVar_ === ptr.classVarPublic_[i][3]) {
                            this.isConst_ = ptr.classVarPublic_[i][0];
                            this.typeName_ = ptr.classVarPublic_[i][1];
                            this.ptrType_ = ptr.classVarPublic_[i][2];
                            this.isInClass_ = true;
                        }
                    }
                    break;
                case 'isClass':
                    for (var i = 0; i < ptr.classVarPublic_.length; ++i) {
                        if (this.getVar_ === ptr.classVarPublic_[i][3]) {
                            this.isConst_ = ptr.classVarPublic_[i][0];
                            this.typeName_ = ptr.classVarPublic_[i][1];
                            this.ptrType_ = ptr.classVarPublic_[i][2];
                            this.isInClass_ = true;
                        }
                    }
                    for (var i = 0; i < ptr.classVarPrivate_.length; ++i) {
                        if (this.getVar_ === ptr.classVarPrivate_[i][3]) {
                            this.isConst_ = ptr.classVarPrivate_[i][0];
                            this.typeName_ = ptr.classVarPrivate_[i][1];
                            this.ptrType_ = ptr.classVarPrivate_[i][2];
                            this.isInClass_ = true;
                        }
                    }
                    for (var i = 0; i < ptr.classVarProtected_.length; ++i) {
                        if (this.getVar_ === ptr.classVarProtected_[i][3]) {
                            this.isConst_ = ptr.classVarProtected_[i][0];
                            this.typeName_ = ptr.classVarProtected_[i][1];
                            this.ptrType_ = ptr.classVarProtected_[i][2];
                            this.isInClass_ = true;
                        }
                    }
                    break;

            }
            ptr = ptr.getSurroundParent();
        }

        //Set typeName_
        ptr = this.parentBlock_;
        while (ptr) {

            switch (ptr.getDataStr()) {
                case 'isVar':

                    //Stream data from var declaration block
                    if (this.getVar_ === ptr.getVar_) {

                        this.typeName_ = ptr.typeName_;
                        //stream input value
                        this.value_ = ptr.value_;

                        this.isInitialized_ = ptr.isInitialized_;

                        this.isNull_ = ptr.isNull_;

                        this.ptrType_ = ptr.ptrType_;

                        //stream const option
                        this.isConst_ = ptr.isConst_;

                        return;
                    }

                    break;
            }

            ptr = ptr.parentBlock_;
        }
    },

    allocateDropdown: function () {
        let i;
//Delete any repeating elements in the 2d array
        const temp = [];
        const temp2 = [];

        //grab the data from the matrix
        for (i = 0; i < this.paramNames_.length; ++i) {
            temp.push(this.paramNames_[i][1]);
        }

        this.paramNames_ = [];

        for (i = 0; i < temp.length; ++i) {
            if (temp2.indexOf(temp[i]) === -1) {
                temp2.push(temp[i]);
            }
        }

        for (i = 0; i < temp2.length; ++i) {
            this.paramNames_.push([temp2[i], temp2[i]]);
        }

        return this.paramNames_;
    },

    allocateWarnings: function () {
        let TT = "";
        let C = C_Logic;

        if (!this.parentBlock_) {
            TT += "Block warning, this block has a return and must be connected.\n";
        }

        //Errors if a variable exists
        if (this.getVar_.length > 0) {

            let i;
            let currentVarFound = false;

            for (i = 1; i < this.paramNames_.length; ++i) {
                if (this.getFieldValue('VAR') === this.paramNames_[i][1]) {
                    currentVarFound = true;
                    break;
                }
            }

            if (this.isInClass_) {
                let ptr = this.getSurroundParent();

                while (ptr) {
                    switch (ptr.getDataStr()) {
                        case 'isStruct':

                            for (i = 0; i < ptr.classVarPublic_.length; ++i) {
                                if (this.getVar_ === ptr.classVarPublic_[i][3]) {
                                    currentVarFound = true;
                                    break;
                                }
                            }

                            break;
                    }
                    ptr = ptr.getSurroundParent();
                }

            }


            if (!currentVarFound) {
                TT += 'Block warning, variable "' + this.getVar_ + '" is not declared in this scope.\n';
            }
        }

        if (TT.length > 0) {
            this.setWarningText(TT);
        } else {
            this.setWarningText(null);
        }
    }

};
Blockly.C['get_var'] = function (block) {
    let code = '';

    for (let i = 0; i < this.ptrLevel_; ++i) {
        code += '*';
    }

    code += this.getVar_;

    return [code, Blockly.C.ORDER_NONE];
};

Blockly.Blocks['get_func_void'] = {
    init: function () {

        this.appendValueInput('valinp1').setCheck(null);

        this.setInputsInline(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(funcHUE);

        this.setTooltip("A block used for void functions.");
        this.setHelpUrl("");

    },

    onchange: function () {
        this.allocateBlock();
        this.allocateWarnings();
    },

    allocateBlock: function () {
        let block = this.getInputTargetBlock('valinp1');

        if (block) {
            block.setColour(this.getColour());
            block.setMovable(false);
            block.setDeletable(false);
        }
    },

    allocateWarnings: function () {
        var TT = "";

        let block = this.getInputTargetBlock('valinp1');

        if (block) {
            if (block.typeName_ !== "void") {
                TT += 'Warning, non-void function return is ignored.\n';
            }
        }

        if (TT.length > 0) {
            this.setWarningText(TT);
        } else {
            this.setWarningText(null);
        }
    }
};
Blockly.C['get_func_void'] = function (block) {
    var val1 = Blockly.C.valueToCode(block, 'valinp1', Blockly.C.ORDER_ATOMIC);

    var code = "";

    code += val1 + ';\n';

    return code;
};

// Mutator blocks for the mutator
Blockly.Blocks['get_func_mutator'] = {
    init: function () {
        this.setColour(funcHUE);
        this.appendDummyInput().appendField('parameters');
        this.appendStatementInput('STACK');

        this.setPreviousStatement(false);
        this.setNextStatement(false);
        this.setTooltip('');
        this.contextMenu = false;
    }
};
Blockly.Blocks['get_func_add'] = {
    init: function () {
        this.setColour(funcHUE);
        this.appendDummyInput().appendField('add');

        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
        this.contextMenu = false;
    }
};

Blockly.Blocks['get_func'] = {
    init: function () {

        this.paramNames_ = [["", ""]];

        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(this.allocateDropdown.bind(this)), "funcVar");

        this.setInputsInline(true);

        this.setOutput(true, null);
        this.setColour(funcHUE);
        this.setTooltip("");
        this.setHelpUrl("");
        this.setInputsInline(true);

        this.funcProp_ = [];
        this.funcParam_ = [];
        this.classFuncProp_ = [];
        this.classFuncParam_ = [];

        this.classConProp_ = [];
        this.classConParam_ = [];

        this.classFuncPropPrivate_ = [];
        this.classFuncParamPrivate_ = [];

        this.classConPropPrivate_ = [];
        this.classConParamPrivate_ = [];

        this.classFuncPropPrivate_ = [];
        this.classFuncParamPrivate_ = [];

        this.classConPropPrivate_ = [];
        this.classConParamPrivate_ = [];

        this.setMutator(new Blockly.Mutator(['get_func_add']));

        this.paramCount_ = 0;

        //If this block gets a variable
        this.isGetter_ = true;

        this.isConstructor_ = false;

        this.isInClass_ = false;

    },

    mutationToDom: function () {
        if (!this.paramCount_) {
            return null;
        }
        const container = document.createElement('mutation');

        if (this.paramCount_) {
            container.setAttribute('param_add', this.paramCount_);
        }

        return container;
    },

    domToMutation: function (xmlElement) {
        this.paramCount_ = parseInt(xmlElement.getAttribute('param_add'), 10);

        for (let i = 1; i <= this.paramCount_; ++i) {

            this.appendValueInput('valinp' + i).setCheck(null).appendField('').setAlign(Blockly.ALIGN_RIGHT);

        }

    },

    decompose: function (workspace) {
        const containerBlock = workspace.newBlock('get_func_mutator');
        containerBlock.initSvg();

        let connection = containerBlock.getInput('STACK').connection;

        for (let i = 1; i <= this.paramCount_; ++i) {
            const add = workspace.newBlock('get_func_add');
            add.initSvg();

            connection.connect(add.previousConnection);
            connection = add.nextConnection;
        }

        return containerBlock;
    },

    compose: function (containerBlock) {

        for (let i = this.paramCount_; i > 0; --i) {
            this.removeInput('valinp' + i);
        }

        this.paramCount_ = 0;

        let clauseBlock = containerBlock.getInputTargetBlock('STACK');

        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'get_func_add':
                    this.paramCount_++;

                    const paramInput = this.appendValueInput('valinp' + this.paramCount_).setCheck(null).appendField('').setAlign(Blockly.ALIGN_RIGHT);

                    if (clauseBlock.valueConnection_) {
                        paramInput.connection.connect(clauseBlock.valueConnection_);
                    }

                    break;

                default:
                    throw 'Unknown block type.';
            }
            clauseBlock = clauseBlock.nextConnection
                && clauseBlock.nextConnection.targetBlock();
        }

    },

    saveConnections: function (containerBlock) {
        let clauseBlock = containerBlock.getInputTargetBlock('STACK');
        let i = 1;

        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'get_func_add':
                    const paramInput = this.getInput('valinp' + i);

                    clauseBlock.valueConnection_ = paramInput && paramInput.connection.targetConnection;

                    clauseBlock.statementConnection_ = i++;

                    break;
                default:
                    throw 'Unknown block type.';
            }
            clauseBlock = clauseBlock.nextConnection
                && clauseBlock.nextConnection.targetBlock();
        }

    },

    onchange: function () {
        if (!this.getField('funcVar')) {
           this.setFieldValue('', 'funcVar')
        }

        this.allocateValues();
        //this.allocateVariables();

        //If this block has a left connection
        if (this.parentBlock_) {
            switch (this.parentBlock_.type) {

                //If it's an object member block
                case 'ds_member':
                    this.allocateMembers(this.parentBlock_);
                    break;

                //If it's an object declare block
                case 'ds_object':
                    this.allocateConstructors(this.parentBlock_);
                    break;

                //If it's any other block
                default:
                    this.allocateVariables();
                    break;
            }
        } else {
            this.paramNames_ = [["", ""]];
        }
        this.allocateWarnings();
        //C_Var.get.updateDropdownText(this.paramNames_, 'funcVar', this);
    },

    allocateValues: function () {
        this.isConst_ = false;
        this.typeName_ = "";
        this.ptrType_ = "";
        let funcVarField = this.getField("funcVar");
        this.getVar_ =  funcVarField ? this.getFieldValue('funcVar') : '';
        this.value_ = "";

        this.isConstructor_ = false;

        this.funcParam_ = [];
        this.funcProp_ = [];

        this.classFuncProp_ = [];
        this.classFuncParam_ = [];

        this.classConProp_ = [];
        this.classConParam_ = [];

        this.classFuncPropPrivate_ = [];
        this.classFuncParamPrivate_ = [];

        this.classConPropPrivate_ = [];
        this.classConParamPrivate_ = [];

        this.isInClass_ = false;

        let ptr = this.getSurroundParent();
        while (ptr) {
            switch (ptr.getDataStr()) {
                case 'isClass':
                    this.isInClass_ = true;
                    break;
            }

            ptr = ptr.getSurroundParent();
        }
        if (this.isInClass_) {
            //locating class block

            this.allocateClassFunctions();

            //Find and stream variables


        } else {
            this.allocateVariables();
            //Find and stream variables
            ptr = this.parentBlock_;
            while (ptr) {

                if (ptr.getDataStr() === "isFunc" && this.getVar_ === ptr.getVar_) {
                    this.typeName_ = ptr.typeName_;
                    this.value_ = ptr.value_;

                    if (ptr.funcProp_) {
                        //Stream values
                        this.isConst_ = ptr.funcProp_[0];
                        this.typeName_ = ptr.funcProp_[1];
                        this.ptrType_ = ptr.funcProp_[2];
                    }

                    if (ptr.funcParam_) {
                        this.funcParam_ = ptr.funcParam_;
                    }

                    if (ptr.funcProp_) {
                        this.funcProp_ = ptr.funcProp_;
                    }

                    break;
                }

                ptr = ptr.parentBlock_;
            }
        }
    },

    allocateVariables: function () {
        let options = [];
        options.push(["", ""]);

        //Previous declaration

        let ptr = this.parentBlock_;

        while (ptr) {
            switch (ptr.getDataStr()) {
                case 'isFunc':
                    if (ptr.getVar_) {
                        options.push([ptr.getVar_, ptr.getVar_])
                    }
                    break;
            }
            ptr = ptr.parentBlock_;
        }

        this.paramNames_ = options;
    },
// TODO fix dropdown handling (maybe apply to more options?)
    allocateDropdown: function () {
        return C_Var.get.checkDropdown(this.paramNames_, "funcVar", this);
    },

    /**
     *
     * Function to check the left ds_member block
     * and grab function information
     *
     */
    allocateMembers: function(block) {
        let i;
        //Temp variable for options
        let options = [['','']];
        //Stream the function and parameter

        this.classFuncProp_ = block.classFuncProp_;
        this.classFuncParam_ = block.classFuncParam_;

        for (i = 0; i < block.classFuncProp_.length; ++i) {
            options.push([block.classFuncProp_[i][3], block.classFuncProp_[i][3]]);
        }

        this.paramNames_ = options;

        for (i = 0; i < block.classFuncProp_.length; ++i) {
            if (this.getFieldValue('funcVar') === block.classFuncProp_[i][3]) {

                this.isConst_ = block.classFuncProp_[i][0];
                this.typeName_ = block.classFuncProp_[i][1];
                this.ptrType_ = block.classFuncProp_[i][2];
                this.getVar_ = block.classFuncProp_[i][3];

                break;
            }
        }

        for (i = 0; i < this.classFuncProp_.length; ++i) {
            if (this.classFuncProp_[i][3] === this.getVar_) {
                this.funcParam_ = this.classFuncParam_[i];
            }
        }
    },

    allocateClassFunctions: function () {

        let i;
        let options = [];
        options.push(["", ""]);


        let ptr = this.getSurroundParent();
        while (ptr) {

            if (ptr.getDataStr() === "isClass") {
                this.classFuncProp_ = ptr.classFuncProp_;
                this.classFuncParam_ = ptr.classFuncParam_;

                this.classFuncPropPrivate_ = ptr.classFuncPropPrivate_;
                this.classFuncParamPrivate_ = ptr.classFuncParamPrivate_;

                break;
            }

            ptr = ptr.getSurroundParent();
        }

        for (i = 0; i < this.classFuncProp_.length; ++i) {
            options.push([this.classFuncProp_[i][3], this.classFuncProp_[i][3]]);
        }

        for (i = 0; i < this.classFuncPropPrivate_.length; ++i) {
            options.push([this.classFuncPropPrivate_[i][3], this.classFuncPropPrivate_[i][3]]);
        }
        this.paramNames_ = options;

        const types = [];

        for (i = 1; i <= this.paramCount_; ++i) {
            ptr = this.getInputTargetBlock('valinp' + i);
            if (ptr) {
                types.push(ptr.typeName_);
                this.funcParam_.push

                ([ptr.isConst_, ptr.typeName_, ptr.ptrType_, ptr.getVar_, true]);
            }
        }
        

        for (i = 0; i < this.classFuncParam_.length; ++i) {
            if (this.getVar_ === this.classFuncProp_[i][3] &&
                types.length === this.classFuncParam_[i].length) {
                let allEqual = true;
                for (let j = 0; j < types.length; ++j) {
                    if (types[j] !== this.classFuncParam_[i][j][1]) {
                        allEqual = false;
                    }
                }
                if (allEqual) {
                    //this.funcParam_ = this.classFuncParam_[i];
                    break;
                }
            }
        }


    },

    allocateConstructors: function (block) {
		let i;
    //initialize empty dropdown
        const options = [];
        options.push(["", ""]);
		
		//populate with class name for constructor
        if (block.getField('DS').getText().length > 0) {
            options.push([block.getField('DS').getText(), block.getField('DS').getText()]);
        }

		//array for holding the # of params, and allows for checking type
        const types = [];

        for (i = 1; i <= this.paramCount_; ++i) {
            const ptr = this.getInputTargetBlock('valinp' + i);

            if (ptr) {
                types.push(ptr.typeName_);
            }
        }

		
		
        for (i = 0; i < block.classConParam_.length; ++i) {
            if (types.length === block.classConParam_[i].length) {
                let allEqual = true;
                for (let j = 0; j < types.length; ++j) {
                    if (types[j] !== block.classConParam_[i][j][1]) {
                        allEqual = false;
                    }
                }
                if (allEqual) {
					
                    this.funcParam_ = block.classConParam_[i];
                    break;
                }
            }
        }

        this.isConstructor_ = true;

        this.classConParam_ = block.classConParam_;
        this.paramNames_ = options;
    },

    allocateWarnings: function () {
        let C = C_Logic;

        let TT = "";

        if (this.parentBlock_ == null) {
            TT += "Block warning, this block has a return and must be connected.\n";
        } else {

            switch (this.typeName_) {
                case 'void':
                    if (this.parentBlock_.type !== "get_func_void" && this.parentBlock_.parentBlock_.type !== 'ds_member2') {
                        TT += "Error, cannot return a void. (use void function block).\n"
                    }

                    break;
            }

        }

        //there is no constructor that has these parameters
        if (this.isConstructor_) {
            if (this.paramCount_ !== this.funcParam_.length) {
                TT += 'There is no constructor which requires ' + this.paramCount_ + ' parameters.\n';
            }
        } else {
            if (this.paramCount_ !== this.funcParam_.length) {
                TT += 'Error, function has ' + this.paramCount_ + ' parameters but requires ' + this.funcParam_.length + '.\n';
            }
        }

        //Check if the function has the correct amount of inputs

        //Loop through all the parameter inputs to check the correct types
        for (let i = 0; i < this.funcParam_.length; ++i) {
            const val = Blockly.C.valueToCode(this, 'valinp' + (i + 1), Blockly.C.ORDER_ATOMIC);
            let block = this.getInputTargetBlock('valinp' + (i + 1));

            if (block) {

                if (val.length < 1) {
                    TT += 'Error, no data is being returned on parameter #' + (i + 1) + '.\n';
                } else if (this.funcParam_[i][1] !== block.typeName_) {
                    TT += 'Error, parameter #' + (i + 1) + ' should be of type "' + this.funcParam_[i][1] + '", is currently of type "' + block.typeName_ + '".\n';
                }

            } else {
                TT += 'Error, parameter #' + (i + 1) + ' requires an input.\n';
            }
        }

        if (TT.length > 0) {
            this.setWarningText(TT);
        } else {
            this.setWarningText(null);
        }
    },
};
Blockly.C['get_func'] = function (block) {
    let code = '';

    if (this.getVar_.length > 0) {
        if (!this.isConstructor_) {
            code += this.getVar_;
        }
        code += '(';

        for (let i = 1; i <= this.paramCount_; ++i) {
            const arg = Blockly.C.valueToCode(block, 'valinp' + i, Blockly.C.ORDER_NONE);

            code += arg;

            if (i < this.paramCount_) {
                code += ", ";
            }
        }
        code += ')';
    }

    return [code, Blockly.C.ORDER_NONE];
};

Blockly.Blocks['get_num'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0), "NUM");

        this.setOutput(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");

        //The value
        this.value_ = "";
        //The type
        this.typeName_ = "int";
    },

    /**
     * Is called upon every change
     */
    onchange: function () {

        this.allocateValues();
        this.allocateWarnings();
    },
    /**
     * Sets all the variables needed
     */
    allocateValues: function () {
        // Added by David Hazell (SP21)
        this.type_ = "int";
        //the user inputted value to be updated.
        this.value_ = this.getField('NUM').getText();
        this.typeName_ = "int";

        //parse into a float, parseInt is tautological
        var valueInt = parseFloat(this.value_);

        //Deduce its type, never assume size_t can be 0,
        //because it's used to measure containers.
        //A container can never be 0 unless it is
        //uncreated or uninitialized.

        if (valueInt % 1 === 0) {
            this.typeName_ = "int";
        } else {
            this.typeName_ = "double";
        }


    },
    /**
     * Sets all the warnings
     */
    allocateWarnings: function () {
        var TT = "";

        //If there is a non number somewhere
        for (var i = 0; i < this.value_.length; ++i) {
            if (!(this.value_[i] >= '0' && this.value_[i] <= '9')) {
                if ((this.value_[i] !== '-' && this.value_[i] !== '.')) {
                    TT += "Error, this input must contain only numbers.\n";
                    break;
                }
            }
        }

        //If this block's return is not connected
        if (this.parentBlock_ === null) {
            TT += 'Block warning, this block has a return and must be connected.\n';
        }

        if (TT.length > 0) {
            this.setWarningText(TT);
        } else {
            this.setWarningText(null);
        }
    }
};
Blockly.C['get_num'] = function (block) {
    var code = '';

    code += this.value_;

    return [code, Blockly.C.ORDER_NONE];
};

Blockly.Blocks['get_char'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("'")
            .appendField(new Blockly.FieldTextInput("a"), "myChar")
            .appendField("'");

        this.setOutput(true, null);
        this.setColour(stringHUE);
        this.setTooltip("");
        this.setHelpUrl("");

        //The value
        this.value_ = "";
        //The type
        this.typeName_ = "char";
    },

    /**
     * Is called upon every change
     */
    onchange: function () {

        this.allocateValues();
        this.allocateWarnings();
    },

    /**
     * Sets all the variables needed
     */
    allocateValues: function () {

        //Get input from myChar
        this.value_ = this.getFieldValue("myChar");
    },

    /**
     * Sets all the warnings
     */
    allocateWarnings: function () {
        let TT = "";

        //Char formatting warnings and errors
        TT += C_Logic.logic.char_format(this.value_);

        //If this block's return is not connected
        if (!this.parentBlock_) {
            TT += 'Block warning, this block has a return and must be connected.\n';
        }

        if (TT.length > 0) {
            this.setWarningText(TT);
        } else {
            this.setWarningText(null);
        }
    }
};
Blockly.C['get_char'] = function (block) {

    var code = "'" + this.value_ + "'";


    return [code, Blockly.C.ORDER_NONE];
};

Blockly.Blocks['get_str'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('"')
            .appendField(new Blockly.FieldTextInput("str"), "myStr")
            .appendField('"');

        this.setOutput(true, null);
        this.setColour(stringHUE);
        this.setTooltip("");
        this.setHelpUrl("");

        //The value
        this.value_ = "";
        //The type
        this.typeName_ = "string";
    },

    /**
     * Is called upon every change
     */
    onchange: function () {

        this.allocateValues();
        this.allocateWarnings();
    },
    /**
     * Sets all the variables needed
     */
    allocateValues: function () {
        this.value_ = this.getFieldValue("myStr");
    },

    /**
     * Sets all the warnings
     */
    allocateWarnings: function () {
        let TT = "";

        //String format warnings and errors
        TT += C_Logic.logic.string_format(this.value_);

        //If this block's return is not connected
        if (!this.parentBlock_) {
            TT += 'Block warning, this block has a return and must be connected.\n';
        }

        if (TT.length > 0) {
            this.setWarningText(TT);
        } else {
            this.setWarningText(null);
        }
    }
};
Blockly.C['get_str'] = function (block) {

    var code = '"' + this.value_ + '"';

    return [code, Blockly.C.ORDER_NONE];
};

Blockly.Blocks['get_arr'] = {
    init: function () {

        this.paramNames_ = [["", ""]];

        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(this.allocateDropdown.bind(this)), "VAR");
        this.setOutput(true, null);
        this.setColour(arrayHUE);
        this.setTooltip("");
        this.setHelpUrl("");

        this.typeName_ = "";
        this.getVar_ = "";

        this.paramCount_ = 0;

        this.isInitialized_ = false;
        this.size_ = 0;

        this.objArr_ = [];

        //If this block gets a variable
        this.isGetter_ = true;
    },

    onchange: function () {

        let block = this.parentBlock_;

        //If the left block is a ds_member block
        if (block) {
            if (block.type === "ds_member" || (block.parentBlock_ && block.parentBlock_.type === "ds_member")) {
                this.allocateMembers();
            } else {
                this.allocateVariables();
            }
        } else {
            this.paramNames_ = [["", ""]];
        }


        this.allocateType();
        this.allocateValues();
        this.allocateWarnings();
    },

    allocateValues: function () {
        this.getVar_ = "";

        if (this.getFieldValue('VAR') && this.getFieldValue('VAR').length > 0) {
            this.getVar_ = this.getFieldValue('VAR');
        }

    },

    allocateVariables: function () {
        var options = [];

        options.push(["", ""]);

        //Previous declaration

        let ptr = this.parentBlock_;

        while (ptr) {

            if (this.getVar_ === ptr.getVar_) {
                this.isInitialized_ = ptr.isInitialized_;
                this.size_ = ptr.size_;
            }

            switch (ptr.getDataStr()) {
                case 'isArr':

                    (ptr && ptr.getVar_) ? (options.push([ptr.getVar_, ptr.getVar_])) : (0);

                    break;

                case 'isVar':

                    (ptr && ptr.typeName_ === "string") ?
                        (options.push([ptr.getVar_, ptr.getVar_]))
                        : (0);

                    break;
            }

            ptr = ptr.parentBlock_;
        }
        this.paramNames_ = options;

    },

    allocateMembers: function () {
        var options = [];
        options.push(["", ""]);

        let ptr = this.parentBlock_;

        var j = 1;

        while (ptr) {

            if (ptr.type === "ds_member") {
                this.objArr_ = ptr.classArr_;
                for (var i = 0; ptr.classArr_ && i < ptr.classArr_.length; ++i) {
                    options.push([ptr.classArr_[i][3], ptr.classArr_[i][3]]);
                }
                j++;
            }


            if (j > 2) {
                break;
            }

            ptr = ptr.parentBlock_;
        }

        this.paramNames_ = options;
    },

    allocateType: function () {
        //Set typeName_
        let ptr = this.parentBlock_;
        while (ptr) {

            switch (ptr.getDataStr()) {
                case 'isArr':

                    if (this.getVar_ === ptr.getVar_) {
                        this.typeName_ = ptr.typeName_;
                        return;
                    }

                    break;

            }

            ptr = ptr.parentBlock_;
        }
    },

    allocateDropdown: function () {
        return this.paramNames_;
    },

    allocateWarnings: function () {
        var TT = "";

        if (!this.parentBlock_) {
            TT += "Block warning, this block has a return and must be connected.\n";
        }

        if (this.size_ < 1) {
            //TT += 'Warning, attempting to return uninitialized array "' + this.getVar_ + '".\n';
        }

        if (TT.length > 0) {
            this.setWarningText(TT);
        } else {
            this.setWarningText(null);
        }
    }

};
Blockly.C['get_arr'] = function (block) {
    var code = '';

    code += this.getVar_;

    return [code, Blockly.C.ORDER_NONE];
};

Blockly.Blocks['get_vec'] = {
    init: function () {

        this.paramNames_ = [["", ""]];

        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(this.allocateDropdown.bind(this)), "VAR");

        this.setOutput(true, null);
        this.setColour(vectorHUE);
        this.setTooltip("");
        this.setHelpUrl("");

        this.typeName_ = "";
        this.getVar_ = "";

        this.paramCount_ = 0;

        this.isInitialized_ = false;

        //If this block gets a variable
        this.isGetter_ = true;

        //this.setMovable(false);
        //this.setDeletable(false);
    },

    onchange: function () {

        this.allocateValues();
        this.allocateVariables();
        this.allocateWarnings();
    },

    allocateValues: function () {

        if (this.getFieldValue('VAR') && this.getFieldValue('VAR').length > 0) {
            this.getVar_ = this.getFieldValue('VAR');
        } else {
            this.getVar_ = "";
        }

    },

    allocateVariables: function () {
        var options = [];

        options.push(["", ""]);

        //Previous declaration

        let ptr = this.parentBlock_;

        while (ptr) {

            if (this.getVar_ === ptr.getVar_) {
                this.isInitialized_ = ptr.isInitialized_;
            }

            switch (ptr.getDataStr()) {
                case 'isVec':

                    (ptr && ptr.getVar_) ? (options.push([ptr.getVar_, ptr.getVar_])) : (0);

                    break;
            }

            ptr = ptr.parentBlock_;
        }
        this.paramNames_ = options;

        this.allocateType();

    },

    allocateType: function () {
        //Set typeName_
        let ptr = this.parentBlock_;
        while (ptr) {

            switch (ptr.getDataStr()) {
                case 'isVec':

                    if (this.getVar_ === ptr.getVar_) {
                        this.typeName_ = ptr.typeName_;
                        return;
                    }

                    break;
            }

            ptr = ptr.parentBlock_;
        }
    },

    allocateDropdown: function () {
        return this.paramNames_;
    },

    allocateWarnings: function () {
        var TT = "";

        if (!this.parentBlock_) {
            TT += "Block warning, this block has a return and must be connected.\n";
        }

        if (this.parentBlock_ == null) {
            this.setWarningText(TT);
        } else {
            this.setWarningText(null);
        }
    }

};
Blockly.C['get_vec'] = function (block) {
    var code = '';

    code += this.getVar_;

    return [code, Blockly.C.ORDER_NONE];
};

Blockly.Blocks['get_objects'] = {
    init: function () {

        this.paramNames_ = [["", ""]];

        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(this.allocateDropdown.bind(this)), "VAR");


        this.setOutput(true, null);
        this.setColour(classHue);
        this.setTooltip("");
        this.setHelpUrl("");

        this.typeName_ = "";
        this.getVar_ = "";

        this.paramCount_ = 0;

        this.isInitialized_ = false;

        //If this block gets a variable
        this.isGetter_ = true;
    },

    onchange: function () {

        this.allocateValues();
        this.allocateVariables();
        this.allocateWarnings();
    },

    allocateValues: function () {
        this.typeName_ = this.getFieldValue('VAR');
    },

    allocateVariables: function () {
        var options = [];

        options.push(["", ""]);

        //Previous declaration

        let ptr = this.parentBlock_;

        while (ptr) {

            switch (ptr.getDataStr()) {
                case 'isStruct':
                case 'isClass':

                    options.push([ptr.getVar_, ptr.getVar_]);

                    break;
            }

            ptr = ptr.parentBlock_;
        }
        this.paramNames_ = options;
    },

    allocateDropdown: function () {
        return this.paramNames_;
    },

    allocateWarnings: function () {
        var TT = "";

        if (!this.parentBlock_) {
            TT += "Block warning, this block has a return and must be connected.\n";
        }

        if (this.parentBlock_ == null) {
            this.setWarningText(TT);
        } else {
            this.setWarningText(null);
        }
    }

};
Blockly.C['get_objects'] = function (block) {
    var code = '';

    code += this.typeName_;

    return [code, Blockly.C.ORDER_NONE];
};
