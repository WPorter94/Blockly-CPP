/**
 * @author Joseph Pauplis
 * @version 0.1
 */

/*TODO:

*/

let ClassIncludeHUE = 140;
/**
 * ##define_file
 * Defines a header file
 *   <br>
 *   \#ifndef FILE_H<br>
 *   \#define FILE_H<br>
 *   ...<br>
 *   \#endif<br>
 **/
Blockly.Blocks['define_file'] = {

    init: function () {
        /** Adds a notch to connect up. */
        this.setPreviousStatement(true, null);
        /** Adds a notch to connect down. */
        this.setNextStatement(true, null);
        /** Sets color of the block. */
        this.setColour(ClassIncludeHUE);
        /** This tooltip text appears when hovering block. */
        this.setTooltip("");
        /** The Help URL directs to hyperlink when a block is right clicked and Help is selected. */
        this.setHelpUrl("");
        this.setDataStr("isClass", true);

        //append text areas
        this.appendDummyInput()
            .appendField("#ifndef")
            .appendField("FILE_H", "ifndefText");

        this.appendDummyInput()
            .appendField("#define")
            .appendField("FILE_H", "defineText");

        this.appendStatementInput("statementInput").setCheck(null);

        this.appendDummyInput()
            .appendField("#endif");

        //hold all of the info from the class (already held just push in from declaration)
        this.classVarPublic_ = [];
        this.classFuncProp_ = [];
        this.classFuncParam_ = [];
        this.classConProp_ = [];
        this.classConParam_ = [];
        this.classObj_ = [];

        this.classVarPrivate_ = [];
        this.classFuncPropPrivate_ = [];
        this.classFuncParamPrivate_ = [];
        this.classConPropPrivate_ = [];
        this.classConParamPrivate_ = [];
        this.classObjPrivate_ = [];

        this.className_ = currentFile;
        this.getVar_ = '';

        this.includedClasses_ = [];
    },

    onchange: function () {
        this.allocateValues();
    },

    allocateValues: function () {
        let classFile = currentFile;
        for (const [key, value] of allWorkspaces.entries()) {
            if (this.workspace === value) {
                classFile = key;
                break;
            }
        }

        let headerNameArr = classFile.split(".");
        let headerName = `${headerNameArr[0].toUpperCase()}_${headerNameArr[1].toUpperCase()}`;
        //console.log(headerName);
        /// TODO: Get the workspace's current file name to replace default <file name>
        this.setFieldValue(headerName, "ifndefText");
        this.setFieldValue(headerName, "defineText");
        this.className_ = classFile;

        this.classVarPublic_ = [];
        this.classFuncProp_ = [];
        this.classFuncParam_ = [];
        this.classConProp_ = [];
        this.classConParam_ = [];
        this.classObj_ = [];

        this.classVarProtected_ = [];
        this.classFuncPropProtected_ = [];
        this.classFuncParamProtected_ = [];
        this.classConPropProtected_ = [];
        this.classConParamProtected_ = [];
        this.classObjProtected_ = [];

        this.classVarPrivate_ = [];
        this.classFuncPropPrivate_ = [];
        this.classFuncParamPrivate_ = [];
        this.classConPropPrivate_ = [];
        this.classConParamPrivate_ = [];
        this.classObjPrivate_ = [];

        /**
         * OtherFiles Properties
         *
         * [0] - getVar_ | name of included class selected
         *
         * [1] - function properties
         *
         * [2] - parameter properties
         */
        this.includedClasses_ = [];

        //only get info from the class declaration block, probably add include here later
        let ptr = this.getInputTargetBlock("statementInput");
        while (ptr) {
            if (ptr.type === "ds_class") {
                this.classVarPublic_ = (ptr.classVarPublic_);
                this.classFuncProp_ = (ptr.classFuncProp_);
                this.classFuncParam_ = (ptr.classFuncParam_);
                this.classConProp_ = (ptr.classConProp_);
                this.classConParam_ = (ptr.classConParam_);
                this.classObj_ = (ptr.classObjPublic_);

                this.classVarPrivate_ = (ptr.classVarPrivate_);
                this.classFuncPropPrivate_ = (ptr.classFuncPropPrivate_);
                this.classFuncParamPrivate_ = (ptr.classFuncParamPrivate_);
                this.classConPropPrivate_ = (ptr.classConPropPrivate_);
                this.classConParamPrivate_ = (ptr.classConParamPrivate_);
                this.classObjPrivate_ = (ptr.classObjPrivate_);

                this.getVar_ = ptr.getVar_;
            }
            if (ptr.type === "ds_superclass") {
                this.classVarPublic_ = (ptr.classVarPublic_);
                this.classFuncProp_ = (ptr.classFuncProp_);
                this.classFuncParam_ = (ptr.classFuncParam_);
                this.classConProp_ = (ptr.classConProp_);
                this.classConParam_ = (ptr.classConParam_);
                this.classObj_ = (ptr.classObjPublic_);
				
                this.classVarProtected_ = (ptr.classVarProtected_);
                this.classFuncPropProtected_ = (ptr.classFuncPropProtected_);
                this.classFuncParamProtected_ = (ptr.classFuncParamProtected_);
                this.classConPropProtected_ = (ptr.classConPropProtected_);
                this.classConParamProtected_ = (ptr.classConParamProtected_);
                this.classObjProtected_ = (ptr.classObjProtected_);

                this.classVarPrivate_ = (ptr.classVarPrivate_);
                this.classFuncPropPrivate_ = (ptr.classFuncPropPrivate_);
                this.classFuncParamPrivate_ = (ptr.classFuncParamPrivate_);
                this.classConPropPrivate_ = (ptr.classConPropPrivate_);
                this.classConParamPrivate_ = (ptr.classConParamPrivate_);
                this.classObjPrivate_ = (ptr.classObjPrivate_);

                this.getVar_ = ptr.getVar_;
            }
            ptr = ptr.getNextBlock();
        }
        ptr = this.getInputTargetBlock("statementInput");
        while (ptr) {
            if (ptr.type === "include_file") {
                this.includedClasses_.push(ptr.includedClassesProps_);
            }
            ptr = ptr.getNextBlock();
        }
        const currentWorkspace = allWorkspaces.get(this.className_);
        const currWorkspaceXML = Blockly.Xml.workspaceToDom(currentWorkspace);
        const nodeList = currWorkspaceXML.getElementsByTagName("block");
        for (let i = 0; i < nodeList.length; i++) {
            const typeName = nodeList.item(i).getAttribute("type");
            if (typeName === "define_file") {
                classList.set(this.className_, this);
            }
        }

    }
};

/// C code for define_file
Blockly.C['define_file'] = function (block) {
    const statementCode =
        Blockly.C.statementToCode(block, "statementInput");
    let headerNameArr = block.className_.split(".");
    let headerName = `${headerNameArr[0].toUpperCase()}_${headerNameArr[1].toUpperCase()}`;
    let code = "";
    code += "#ifndef " + headerName + "\n";
    code += "#define " + headerName + "\n";
    code += statementCode;
    code += "#endif " + "\n";
    return code;
};

//Include a header file
Blockly.Blocks['include_file'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("#include ")
            .appendField(new Blockly.FieldDropdown(this.allocateDropdown.bind(this)), "classDropdown");

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(ClassIncludeHUE);
        this.setTooltip("");
        this.setHelpUrl("");
        this.setDataStr("isClass", true);

        this.classVarPublic_ = [];
        this.classFuncProp_ = [];
        this.classFuncParam_ = [];
        this.classConProp_ = [];
        this.classConParam_ = [];
        this.classObj_ = [];

        this.classVarProtected_ = [];
        this.classFuncPropProtected_ = [];
        this.classFuncParamProtected_ = [];
        this.classConPropProtected_ = [];
        this.classConParamProtected_ = [];
        this.classObjProtected_ = [];

        this.classVarPrivate_ = [];
        this.classFuncPropPrivate_ = [];
        this.classFuncParamPrivate_ = [];
        this.classConPropPrivate_ = [];
        this.classConParamPrivate_ = [];
        this.classObjPrivate_ = [];

        this.includedClasses_ = [];
        this.includedClassesProps_ = [];

        this.className_ = 'FILE_H';
    },

    allocateDropdown: function () {
        const options = [["", ""]];
        /** add list of defined classes from map to dropdown to select from */
        if (classList.size !== 0) {
            for (const key of classList.keys()) {
                options.push([key, key]);
            }
        }

        return C_Var.get.checkDropdown(options, "classDropdown", this);
    },

    onchange: function () {
        this.allocateValues();
    },

    allocateValues: function () {
        this.classVarPublic_ = [];
        this.classFuncProp_ = [];
        this.classFuncParam_ = [];
        this.classConProp_ = [];
        this.classConParam_ = [];
        this.classObj_ = [];

        this.classVarProtected_ = [];
        this.classFuncPropProtected_ = [];
        this.classFuncParamProtected_ = [];
        this.classConPropProtected_ = [];
        this.classConParamProtected_ = [];
        this.classObjProtected_ = [];

        this.classVarPrivate_ = [];
        this.classFuncPropPrivate_ = [];
        this.classFuncParamPrivate_ = [];
        this.classConPropPrivate_ = [];
        this.classConParamPrivate_ = [];
        this.classObjPrivate_ = [];

        this.includedClasses_ = [];
        this.includedClassesProps_ = [];
        let includeDropdownText = "";
        let checkField = this.getField('classDropdown');
        if(checkField) {
            includeDropdownText = checkField.getText();
        }
        this.className_ = includeDropdownText;
        let ptr;
        const value = classList.get(includeDropdownText);
        if (value) {
            ptr = value;
        }

        if (ptr) {
            this.classVarPublic_ = (ptr.classVarPublic_);
            this.classFuncProp_ = (ptr.classFuncProp_);
            this.classFuncParam_ = (ptr.classFuncParam_);
            this.classConProp_ = (ptr.classConProp_);
            this.classConParam_ = (ptr.classConParam_);
            this.classObj_ = (ptr.classObj_);

            this.classVarProtected_ = (ptr.classVarProtected_);
            this.classFuncPropProtected_ = (ptr.classFuncPropProtected_);
            this.classFuncParamProtected_ = (ptr.classFuncParamProtected_);
            this.classConPropProtected_ = (ptr.classConPropProtected_);
            this.classConParamProtected_ = (ptr.classConParamProtected_);
            this.classObjProtected_ = (ptr.classObjProtected_);

            this.classVarPrivate_ = (ptr.classVarPrivate_);
            this.classFuncPropPrivate_ = (ptr.classFuncPropPrivate_);
            this.classFuncParamPrivate_ = (ptr.classFuncParamPrivate_);
            this.classConPropPrivate_ = (ptr.classConPropPrivate_);
            this.classConParamPrivate_ = (ptr.classConParamPrivate_);
            this.classObjPrivate_ = (ptr.classObjPrivate_);

            this.includedClassesProps_[0] = ptr.getVar_;
            this.includedClassesProps_[1] = ptr.classFuncProp_;
            this.includedClassesProps_[2] = ptr.classFuncParam_;

            this.includedClasses_ = (ptr.includedClasses_);
            this.getVar_ = ptr.getVar_;
        }

    }
};

//Translate to C code output on right.
Blockly.C['include_file'] = function (block) {
    return `#include "${block.className_}"\n`;
};

//class function declaration block
Blockly.Blocks['class_function_declaration'] = {
    init: function () {
        this.pPtrs_ = [
            ["", ""],
            ["*", "*"],
            ["&", "&"],
            ["**", "**"],
            ["*&", "*&"]
        ];

        this.appendValueInput("valueInput")
            .appendField(new Blockly.FieldDropdown(
                [
                    ["", ""],
                    ["const", "const"],
                    ["virtual", "virtual"]
                ]),
                'const')
            .appendField(new Blockly.FieldDropdown(this.allocateDropdown.bind(this)), "myFuncReturn")
            .appendField(new Blockly.FieldDropdown(this.pPtrs_), "pointer")
            .appendField(new Blockly.FieldTextInput("myFunction"), "identifier")
            .appendField('(');
        this.appendDummyInput()
            .appendField(');');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(ClassIncludeHUE);
        this.setTooltip("Creates a new function.\nLeft const - The value of this function will be constant.\nType - Choose the return type of the function. Non voids must return this data type. Voids do not return values.\nInput - The parameters of the function.)");
        this.setHelpUrl("");

        //Set this data type
        //to a function
        this.setDataStr('isFunc', true);

        this.setInputsInline(true);

        //Counter to count the
        //default parameter names
        this.paramCount_ = 0;

        /**
         * Function Properties
         *
         * The properties relating to the function
         *
         * [0] - left constant | boolean
         *
         * [1] - return type | string
         *
         * [2] - pointer | string
         *
         * [3] - function name | string
         *
         * [4] - right constant | boolean
         */
        this.funcProp_ = [false, "", "", "", false];

        /**
         * Function Parameters
         *
         * A 2D array used to store the information of the parameters
         *
         * Example:
         *
         * [0] = [false, "int", "*", "myParam1", true]
         *
         * [1] = [true, "string", "&", "myParam2", false]
         */
        this.funcParam_ = [];

        this.isConstructor_ = false;

        this.isDestructor_ = false;

    },

    onchange: function () {
        this.allocateValues();
    },

    allocateDropdown: function () {
        const options = [
            ["", ""],
            ["void", "void"],
            ["int", "int"],
            ["size_t", "size_t"],
            ["double", "double"],
            ["char", "char"],
            ["string", "string"],
            ["bool", "bool"],
            ["short", "short"],
            ["long", "long"],
            ["long long", "long long"]];

        /** add list of declared classes to dropdown*/
        let ptr = this.parentBlock_;
        while (ptr) {
            if (ptr.getDataStr() === 'isClass') {
                /** Add class name to dropdown list. */
                const className = ptr.getVar_;
                options.push([className, className]);
            }
            ptr = ptr.parentBlock_;
        }


        return C_Var.get.checkDropdown(options, 'myFuncReturn', this);

    },

    allocateValues: function () {
        // Modified by David Hazell (SP21)
        // - Normalized variable names (type_, identifier_, etc)
        // - Got rid of funProp[] ... this is just storing existing variables
        //   in an array.  No need to store these values twice.  If you need
        //   to access the function type use this.type_ instead of this.funcProp[1]
        this.isConst_ = (this.getFieldValue('const'));
        this.type_ = this.getFieldValue('myFuncReturn');
        this.identifier_ = this.getFieldValue('identifier');
        this.ptr_ = this.getFieldValue('pointer');


        // Old variables names - left in place so as not to break existing code that uses these variables
        this.typeName_ = this.getFieldValue('myFuncReturn');
        this.getVar_ = this.getFieldValue('identifier');
        this.isConst_ = (this.getFieldValue('const'));
        this.isConstructor_ = false;
        this.isDestructor_ = false;

        //Allocate function properties
        this.funcProp_[0] = this.isConst_;
        this.funcProp_[1] = this.typeName_;
        this.funcProp_[2] = this.ptr_;
        this.funcProp_[3] = this.getVar_;
        this.funcProp_[4] = false;

        //Allocate function parameters
        this.funcParam_ = [];
        let inputBlock = this.getInputTargetBlock('valueInput');

        while (inputBlock) {
            //If an incorrect block is asserted
            if (inputBlock.type !== "function_parameters" && inputBlock.type !== "class_parameters") {
                return;
            }

            //Push into the this.paramProp array
            if (inputBlock.paramProp_) {
                this.funcParam_.push(inputBlock.paramProp_);
            }

            //Get the next block after that
            inputBlock = inputBlock.childBlocks_[0];

        }

        //Check whether this function is a constructor
        inputBlock = this.getSurroundParent();
        while (inputBlock) {
            switch (inputBlock.getDataStr()) {
                case 'isStruct':
                case 'isClass':
                    if (this.getVar_ === inputBlock.getVar_) {
                        this.isConstructor_ = true;

                    }
                    if (this.getVar_ === ('~' + inputBlock.getVar_)) {
                        this.isDestructor_ = true;
                    }

                    break;
            }
            inputBlock = inputBlock.getSurroundParent();
        }

    }
};

//c code
Blockly.C['class_function_declaration'] = function (block) {

    // Modified by David Hazell (SP21)
    // - more descriptive variable names
    // - code string construction easier to follow

    let valueInput = Blockly.C.valueToCode(block, 'valueInput', Blockly.C.ORDER_ATOMIC);
    let statementInput = Blockly.C.statementToCode(block, 'statementInput');
    let code = '';


    if (block.isConst_ === 'const') {
        code += "const ";
    } else if (block.isConst_ === 'virtual') {
        code += "virtual "
    }

    if (block.type_ === "string" && !C_Include.using.std(block)) {
        code += "std::";
    }


    if (block.type_ === "") {
        code += block.identifier_ + "(" + valueInput + ");\n";
        return code;
    }

    code += block.type_ + block.funcProp_[2] + " " + block.identifier_ + "(" + valueInput + ");\n";

    return code;
};

//def
Blockly.Blocks['class_function_definition'] = {
    init: function () {

        this.appendValueInput("valueInput")
            .appendField('const', 'const')
            .appendField(new Blockly.FieldDropdown(this.allocateDropdown.bind(this)), "type")
            .appendField('ptr', "pointer")
            .appendField(new Blockly.FieldDropdown(this.allocateDropdown2.bind(this)), 'class_name')
            .appendField(' :: ')
            .appendField(new Blockly.FieldDropdown(this.allocateDropdown3.bind(this)), 'identifier')
            .appendField('(');
        this.appendDummyInput()
            .appendField(') {');
        this.appendStatementInput("statementInput").setCheck(null);
        this.appendDummyInput()
            .appendField('}');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(ClassIncludeHUE);
        this.setTooltip("Creates a new function.\nLeft const - The value of this function will be constant.\nType - Choose the return type of the function. Non voids must return this data type. Voids do not return values.\nInput - The parameters of the function.)");
        this.setHelpUrl("");

        //Set this data type
        //to a function
        this.setDataStr('isFunc', true);

        this.setInputsInline(true);

        //Counter to count the
        //default parameter names
        this.paramCount_ = 0;

        /**
         * Function Properties
         *
         * The properties relating to the function
         *
         * [0] - left constant | boolean
         *
         * [1] - return type | string
         *
         * [2] - pointer | string
         *
         * [3] - function name | string
         *
         * [4] - right constant | boolean
         */
        this.funcProp_ = [false, "", "", "", false];

        /**
         * Function Parameters
         *
         * A 2D array used to store the information of the parameters
         *
         * Example:
         *
         * [0] = [false, "int", "*", "myParam1", true]
         *
         * [1] = [true, "string", "&", "myParam2", false]
         */
        this.funcParam_ = [];

        this.className_ = 'none';

    },

    onchange: function () {
        this.allocateValues();
    },

    //dropdown for function type
    allocateDropdown: function () {
        const options = [["", ""]];

        //go up
        let ptr = this.parentBlock_;
        while (ptr) {
            //find the include file block
            if (ptr.type === 'include_file') {
                //match the include block to the selected class
                if (ptr.getVar_ === (this.getFieldValue('class_name'))) {
                    //find the selected function
                    for (let i = 0; i < ptr.classFuncProp_.length; i++) {
                        if (ptr.classFuncProp_[i][3] === this.getFieldValue('identifier')) {
                            const optionName = ptr.classFuncProp_[i][1];
                            options.push([optionName, optionName]);
                        }
                    }
                }
            }
            ptr = ptr.parentBlock_;
        }
        return C_Var.get.checkDropdown(options, 'type',this);
    },

    //dropdown for class ::
    allocateDropdown2: function () {
        const options = [["", ""]];

        let ptr = this.parentBlock_;
        while (ptr) {
            if (ptr.type === 'include_file') {
                /** Add class name to dropdown list. */
                options.push([ptr.getVar_, ptr.getVar_]);

            }
            ptr = ptr.parentBlock_;
        }
        return C_Var.get.checkDropdown(options, 'class_name', this);
    },

    //dropdown for function name
    allocateDropdown3: function () {
        const options = [["", ""]];

        let ptr = this.parentBlock_;
        while (ptr) {
            if (ptr.type === 'include_file') {
                /** Add functions to dropdown list. */

                if (ptr.getVar_ === (this.getFieldValue('class_name'))) {
                    for (let i = 0; i < ptr.classFuncProp_.length; i++) {
                        const functionName = ptr.classFuncProp_[i][3];
                        options.push([functionName, functionName]);
                    }
                }
            }
            ptr = ptr.parentBlock_;
        }
        return C_Var.get.checkDropdown(options, 'identifier', this);
    },

    allocateValues: function () {
        let ptr = this.parentBlock_;
        while (ptr) {
            //find the include file block
            if (ptr.type === 'include_file') {
                //match the include block to the selected class
                if (ptr.getVar_ === (this.getFieldValue('class_name'))) {
                    //go through each function
                    for (let i = 0; i < ptr.classFuncProp_.length; i++) {
                        //match the functions by name
                        if (ptr.classFuncProp_[i][3] === this.getFieldValue('identifier')) {
                            //match by type selected in case theres 2 functions with diff types
                            if (ptr.classFuncProp_[i][1] === this.getFieldValue('type')) {
                                if (ptr.classFuncProp_[i][0] === 'true') {
                                    this.setFieldValue('const', 'const');
                                } else {
                                    this.setFieldValue('', 'const');
                                }
                                this.setFieldValue(ptr.classFuncProp_[i][2], 'pointer');
                            }
                        }
                    }
                }
            }
            ptr = ptr.parentBlock_;
        }

        // Modified by David Hazell (SP21)
        // - Normalized variable names (type_, identifier_, etc)
        // - Got rid of funProp[] ... this is just storing existing variables
        //   in an array.  No need to store these values twice.  If you need
        //   to access the function type use this.type_ instead of this.funcProp[1]
        this.isConst_ = (this.getFieldValue('const') === "const");
        this.type_ = this.getFieldValue('type');
        this.identifier_ = this.getFieldValue('identifier');
        this.ptr_ = this.getFieldValue('pointer');
        this.className_ = this.getFieldValue('class_name');

        // Old variables names - left in place so as not to break existing code that uses these variables
        this.typeName_ = this.getFieldValue('type');
        this.getVar_ = this.getFieldValue('identifier');
        this.isConst_ = (this.getFieldValue('const') === "const");

        //Allocate function properties
        this.funcProp_[0] = this.isConst_;
        this.funcProp_[1] = this.typeName_;
        this.funcProp_[2] = this.ptr_;
        this.funcProp_[3] = this.getVar_;
        this.funcProp_[4] = false;


        //Allocate function parameters
        this.funcParam_ = [];
        let inputBlock = this.getInputTargetBlock('valueInput');

        while (inputBlock) {
            //If an incorrect block is asserted
            if (inputBlock.type !== "function_parameters" && inputBlock.type !== "class_parameters") {
                return;
            }

            //Push into the this.paramProp array
            if (inputBlock.paramProp_) {
                this.funcParam_.push(inputBlock.paramProp_);
            }

            //Get the next block after that
            inputBlock = inputBlock.childBlocks_[0];

        }
    }
};

//c code
Blockly.C['class_function_definition'] = function (block) {
    let valueInput = Blockly.C.valueToCode(block, 'valueInput', Blockly.C.ORDER_ATOMIC);
    let statementInput = Blockly.C.statementToCode(block, 'statementInput');
    let code = '';

    if (block.isConst_ === 'const') {
        code += "const ";
    }

    if (block.type_ === "string" && !C_Include.using.std(block)) {
        code += "std::";
    }

    if (block.type_ !== "") {
        code += block.type_ + block.funcProp_[2] + " ";
    }

    code += block.className_ + "::" + block.identifier_ + "(" + valueInput + ") {\n"
        + statementInput
        + "}\n";

    return code;
};

Blockly.Blocks['delete_block'] = {
    init: function () {
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setOutput(false);

        this.setColour(ClassIncludeHUE);
        this.setTooltip("");
        this.setHelpUrl("");

        this.appendValueInput("valinp1")
            .setCheck(null)
            .appendField("delete")
            .appendField("");
    },

    onchange: function () {
        this.allocateWarnings();
    },

    allocateWarnings: function () {
        var TT = "";

        if (this.childBlocks_[0]) {
            ptr = this.childBlocks_[0];
            if (ptr.type === 'ds_member') {
                if (ptr.isNew !== true) {
                    TT += "Error, must use delete on object created with new.\n";
                }
            }
        }

        if (TT.length > 0) {
            this.setWarningText(TT);
        } else {
            this.setWarningText(null);
        }
    }
};

Blockly.C['delete_block'] = function (block) {
    var val1 = Blockly.C.valueToCode(block, 'valinp1', Blockly.C.ORDER_ATOMIC);
    var code = '';

    code += 'delete';


    if (val1 != 0) {
        code += ' ' + val1;
    }

    code += ';\n';

    return code;
};

