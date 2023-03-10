/**
 * @author Noah Plasse
 * @email nplasse@qmail.qcc.edu
 * @version 1.0
 * @copyright 2021
 **/

let compileList = [];
const compOptimLevels = ["0", "1", "2", "3", "s"];
let setOptimLevels = ["s"];
const cppVersions = ["99", "11", "14", "17", "20"];
let setVersion = ["11"];
const miscCompileOpts = ["-Wall", "-Werror", "-g", "-dryrun"];
let setMiscOpts = [];
let divList = [];

$(function(){
    function List(list, setList, sectionName, type, radioName) {
        this.list = list;
        this.setList=setList;
        this.sectionName=sectionName;
        this.type=type;
        this.radioName = radioName;
        this.createList = function() {
            this.list.forEach((item) => {
                const sectionSelector = $(`#compOptForm #${this.sectionName}`);
                sectionSelector.append(`<label for=\'${item.replace(".", "_").replace("=", "+")}\'>${item}</label>`);
                let check = !!this.setList.find(currItem => item === currItem);
                let name = "";
                if(this.type === "radio"){
                    check = !!check;
                    name = `name=\'${radioName}\'`
                }
                const newItem = $(`<input id=\'${item.replace(".", "_").replace("=", "+")}\' type=\"${this.type}\" ${name}>  </input>`).attr("checked", check);
                sectionSelector.append(newItem);
                divList.push(this.sectionName);
            });
        }
        this.getChecked = function() {
            this.setList = [];
            this.list.forEach((item) => {
                let checked = $(`#compOptForm #${this.sectionName} #${item.replace(".","_").replace("=", "+")}`).is(":checked");
                if(this.type === "radio") { 
                    if(this.setList.length === 0) { 
                        if (checked) this.setList.push(item);                    
                    }
                } else {
                    if (checked) {this.setList.push(item); }                    
                }
            });
        }
    }

    let fileCheckboxes = new List(allFiles, compileList, "fileCheckboxes", "checkbox");
    let compilerOptimRadios = new List(compOptimLevels, setOptimLevels, "compilerOptimRadios", "radio", "optimRadio");
    let compilerVersionRadios = new List(cppVersions, setVersion, "compilerVersionRadios", "radio", "versionRadio");
    let miscCompilerCheckboxes = new List(miscCompileOpts, setMiscOpts, "miscCompilerOptsCheckboxes", "checkbox");

    ///Options Button
    $("#compOptBtn").click(function () {
        fileCheckboxes.list = allFiles;
        $("#terminal").css("display","none");
        $("#compOptDiv").css("display", "block");
        
        fileCheckboxes.createList();
        compilerOptimRadios.createList();
        compilerVersionRadios.createList();
        miscCompilerCheckboxes.createList();
    });
    
    ///Cancel Button
    $("#compOptForm #cancelBtn").click(function () {
        divList.forEach((div) => {$(`#compOptDiv #${div}`).empty();})
        divList = [];
        $("#terminal").css("display","block");
        $(this).parent().parent().hide();
    });

    ///Save Button
    $("#compOptForm #saveBtn").click(function () {
        fileCheckboxes.getChecked();
        compilerOptimRadios.getChecked();
        miscCompilerCheckboxes.getChecked();
        compilerVersionRadios.getChecked();

        setMiscOpts = miscCompilerCheckboxes.setList;
        setVersion = compilerVersionRadios.setList;
        compileList = fileCheckboxes.setList;
        setOptimLevels = compilerOptimRadios.setList;

        divList.forEach((div) => {$(`#compOptDiv #${div}`).empty();})
        divList = [];
        $("#terminal").css("display","block");
        $(this).parent().parent().hide();
    });
})(jQuery);