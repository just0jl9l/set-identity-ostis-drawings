SetIdentityComponent = {
    ext_lang: 'set_identity_code',
    formats: ['format_set_identity_json'],
    struct_support: true,

    factory: function(sandbox) {
        return new setIdentityViewerWindow(sandbox);
    }
};

var setIdentityViewerWindow = function(sandbox) {

    var self = this;
    this.sandbox = sandbox;
    this.sandbox.container = sandbox.container;

    var inputSetIdentity = '#set-identity-tools-' + sandbox.container + " #set-identity-input"
    var buttonSave = '#set-identity-tools-' + sandbox.container + " #button-load-set-identity";
    var buttonEmptySet =  '#set-identity-tools-' + sandbox.container + " #button-empty-set";
    var buttonIntersection =  '#set-identity-tools-' + sandbox.container + " #button-intersection";
    var buttonCombination =  '#set-identity-tools-' + sandbox.container + " #button-combination";
    var buttonDifference =  '#set-identity-tools-' + sandbox.container + " #button-difference";
    var buttonAddition =  '#set-identity-tools-' + sandbox.container + " #button-addition";
    var buttonLeftParenthesis =  '#set-identity-tools-' + sandbox.container + " #button-left-parenthesis";
    var buttonRightParenthesis =  '#set-identity-tools-' + sandbox.container + " #button-right-parenthesis";
    var buttonEq =  '#set-identity-tools-' + sandbox.container + " #button-eq";
    var example = '#set-identity-tools-' + sandbox.container + " #set-identity-example";

    var keynodes = ['ui_set_identity_load_in_memory', 'ui_set_identity_example'];

    $('#' + sandbox.container).prepend('<div class="inputBox" id="set-identity-tools-' + sandbox.container + '"></div>');
    $('#set-identity-tools-' + sandbox.container).load('static/components/html/set-identity-main-page.html', function() {
        SCWeb.core.Server.resolveScAddr(keynodes, function (keynodes) {
            SCWeb.core.Server.resolveIdentifiers(keynodes, function (idf) {
                var buttonLoad = idf[keynodes['ui_set_identity_load_in_memory']];
                var exampleText = idf[keynodes['ui_set_identity_example']];

                $(buttonSave).html(buttonLoad);
                $(buttonEmptySet).html('∅');
                $(buttonIntersection).html('∩');
                $(buttonCombination).html('∪');
                $(buttonDifference).html('\\');
                $(buttonAddition).html('`');
                $(buttonLeftParenthesis).html('(');
                $(buttonRightParenthesis).html(')');
                $(buttonEq).html('=');
                $(example).html(exampleText);


                $(buttonEmptySet).click(function() {
                    $(inputSetIdentity).val($(inputSetIdentity).val() + '∅');
                    $(inputSetIdentity).focus();
                });

                $(buttonIntersection).click(function() {
                    $(inputSetIdentity).val($(inputSetIdentity).val() + '∩');
                    $(inputSetIdentity).focus();
                });

                $(buttonCombination).click(function() {
                    $(inputSetIdentity).val($(inputSetIdentity).val() + '∪');
                    $(inputSetIdentity).focus();
                });

                $(buttonDifference).click(function() {
                    $(inputSetIdentity).val($(inputSetIdentity).val() + '\\');
                    $(inputSetIdentity).focus();
                });

                $(buttonAddition).click(function() {
                    $(inputSetIdentity).val($(inputSetIdentity).val() + '`');
                    $(inputSetIdentity).focus();
                });

                $(buttonLeftParenthesis).click(function() {
                    $(inputSetIdentity).val($(inputSetIdentity).val() + '(');
                    $(inputSetIdentity).focus();
                });

                $(buttonRightParenthesis).click(function() {
                    $(inputSetIdentity).val($(inputSetIdentity).val() + ')');
                    $(inputSetIdentity).focus();
                });

                $(buttonEq).click(function() {
                    $(inputSetIdentity).val($(inputSetIdentity).val() + '=');
                    $(inputSetIdentity).focus();
                });

                $(buttonSave).click(function() {
                    var setIdentityString = $(inputSetIdentity).val();

                    if (isValidUserString(setIdentityString)) {
                        callGenSetIdentity(convertToReversePolishNotation(setIdentityString));
                    }else{
            console.log("Wrong input");
        }
                });
            });
        });
    });

    this.applyTranslation = function(namesMap) {
        SCWeb.core.Server.resolveScAddr(keynodes, function (keynodes) {
            SCWeb.core.Server.resolveIdentifiers(keynodes, function (idf) {
                var buttonLoad = idf[keynodes['ui_set_identity_load_in_memory']];
                var exampleText = idf[keynodes['ui_set_identity_example']];

                $(buttonSave).html(buttonLoad);
                $(example).html(exampleText);
            });
        });
    };
    this.sandbox.eventApplyTranslation = $.proxy(this.applyTranslation, this);

};

SCWeb.core.ComponentManager.appendComponentInitialize(SetIdentityComponent);

function isValidUserString(userString){
    var indexOfEqual = userString.indexOf('=');
    if(indexOfEqual < 1 || indexOfEqual > userString.length - 2)
        return false;
    var numberOfOpeningBrackets = 0;
    var numberOfClosingBrackets = 0; 
    for(var i = 0; i < userString.length; i++){
        if(userString.charAt(i) == '(')
            numberOfOpeningBrackets++;
        if(userString.charAt(i) == ')')
            numberOfClosingBrackets++;
    }
    if (numberOfOpeningBrackets != numberOfClosingBrackets)
        return false;
    return true;
}

function convertToReversePolishNotation(input) {
    console.log(input);
    var output = [];
    var stack = [];
    var operations = ['=','(','∩','∪','\\','`'];
    var operationsPriority = [0, 1, 2, 2, 2, 3];
    var length=input.length;
    
    for (var i = 0; i < length; i++) {
        var e = input.charAt(i);
        if (e === '(') {
            stack.push(e);
        } else if (e === ')') {
            while (stack[stack.length-1] != '('){
                output.push(stack.pop());
            }
            stack.pop();
        } else if (operations.indexOf(e) != -1) {
            while (stack.length > 0) {
                if (operationsPriority[operations.indexOf(e)] <= operationsPriority[operations.indexOf(stack[stack.length-1])]) {
                    output.push(stack.pop());
                } else break;
            }
            stack.push(e);
        } else{
            output.push(e);
        }
    }
    while (stack.length > 0){
        output.push(stack.pop());
    }
    console.log(output);
    return output;
}

function callGenSetIdentity(input){
    SCWeb.core.Server.resolveScAddr(['nrel_system_identifier','empty_set','nrel_addition','nrel_sets_difference',
        'rrel_1','rrel_2','nrel_combination','nrel_intersection','nrel_equality','rrel_key_sc_element'], function (keynodes) {
        var stack = [];
        var generatedNodes = {
            name: [],
            node: []
        };
        var nrelKeyEl = keynodes['rrel_key_sc_element'];
        window.sctpClient.create_node(sc_type_const).done(function (contour) {        
            window.sctpClient.create_node(sc_type_const).done(function (mainNode) { 
                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, mainNode, contour).done(function (arc) { 
                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrelKeyEl, arc);
                    nextOperation(input,stack,keynodes,contour,generatedNodes);
                });
            });
        });
    });
}

function nextOperation(input,stack,keynodes,contour,generatedNodes){
    var operations = ['=','∩','∪','\\','`','∅'];
    var e = input.shift();
    if(operations.indexOf(e) < 0){
        generateNode(e,input,stack,keynodes,contour,generatedNodes);
    }else if (e === '∅'){
        emptySet(input,stack,keynodes,contour,generatedNodes);
    }else if (e === '`'){
        generateAddition(input,stack,keynodes,contour,generatedNodes);
    }else if (e === '\\'){
        generateDifference(input,stack,keynodes,contour,generatedNodes);
    }else if (e === '∪'){
        generateCombination(input,stack,keynodes,contour,generatedNodes);
    }else if (e === '∩'){
        generateIntersection(input,stack,keynodes,contour,generatedNodes);
    }else if (e === '='){
        generateEquality(stack,keynodes,contour,generatedNodes);
    }
}

function generateNode(name,input,stack,keynodes,contour,generatedNodes){
    console.log("Generate node "+name);
    var nrelSysId = keynodes['nrel_system_identifier'];
	var n;
	for(var i=0; i<generatedNodes.name.length; i++){
		if(name === generatedNodes.name[i]){
			n = generatedNodes.node[i];
		}
	}
    if(n == null){
		window.sctpClient.create_node(sc_type_const).done(function (newNode) {
			window.sctpClient.create_link().done(function (linkId) { 
				window.sctpClient.set_link_content(linkId, name);    
				window.sctpClient.create_arc(sc_type_const, newNode, linkId).done(function (commonArc) { 
					window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrelSysId, commonArc); 
					// add in contour
					window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, newNode);
                    // put in generated
					generatedNodes.name.push(name);
					generatedNodes.node.push(newNode);
					
					stack.push(newNode);
					nextOperation(input,stack,keynodes,contour,generatedNodes);
				});
			});
		});
	} else{
		window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, n);
        stack.push(n);
		nextOperation(input,stack,keynodes,contour,generatedNodes);
	}
}

function emptySet(input,stack,keynodes,contour,generatedNodes){
    console.log("Empty set");
    var emptySet = keynodes['empty_set'];
    // add in contour
    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, emptySet);
    
    stack.push(emptySet);
    nextOperation(input,stack,keynodes,contour,generatedNodes);
            
}

function generateAddition(input,stack,keynodes,contour,generatedNodes){
    console.log("Generate addition");
    var addNode = stack.pop();
    var nrelAdd = keynodes['nrel_addition'];
    window.sctpClient.create_node(sc_type_const).done(function (aNode) {
        window.sctpClient.create_arc(sc_type_const, addNode, aNode).done(function (commonArc) { 
            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrelAdd, commonArc).done(function (arc) {     
            
                // add in contour
                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, nrelAdd);
                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, commonArc);
                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, arc);
                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, aNode);
                
                stack.push(aNode);
                nextOperation(input,stack,keynodes,contour,generatedNodes);
            });
        });
    });
}

function generateDifference(input,stack,keynodes,contour,generatedNodes){
    console.log("Generate difference");
    var nrelDif = keynodes['nrel_sets_difference'];
    var rrelFirst = keynodes['rrel_1'];
    var rrelSecond = keynodes['rrel_2'];
    var dif2 = stack.pop();    
    var dif1 = stack.pop();
    window.sctpClient.create_node(sc_type_const).done(function (dNode1) {
        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, dNode1, dif1).done(function (arc1) { 
            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, rrelFirst, arc1).done(function (arc11) { 
                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, dNode1, dif2).done(function (arc2) { 
                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, rrelSecond, arc2).done(function (arc22) {
                        window.sctpClient.create_node(sc_type_const).done(function (dNode2) {            
                            window.sctpClient.create_arc(sc_type_const, dNode1, dNode2).done(function (commonArc) { 
                                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrelDif, commonArc).done(function (arc) {     
                    
                                    // add in contour
                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, nrelDif);
                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, commonArc);
                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, arc);
                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, dNode1);
                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, dNode2);
                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, rrelFirst);
                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, rrelSecond);
                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, arc1);
                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, arc2);
                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, arc11);
                                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, arc22);
                            
                                    stack.push(dNode2);
                                    nextOperation(input,stack,keynodes,contour,generatedNodes);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function generateCombination(input,stack,keynodes,contour,generatedNodes){
    console.log("Generate combination");
    var nrelCom = keynodes['nrel_combination'];
    var com1 = stack.pop();    
    var com2 = stack.pop();
    window.sctpClient.create_node(sc_type_const).done(function (cNode1) {
        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, cNode1, com1).done(function (arc1) {
            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, cNode1, com2).done(function (arc2) {
                window.sctpClient.create_node(sc_type_const).done(function (cNode2) {            
                    window.sctpClient.create_arc(sc_type_const, cNode1, cNode2).done(function (commonArc) { 
                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrelCom, commonArc).done(function (arc) { 
                    
                            // add in contour
                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, nrelCom);
                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, commonArc);
                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, arc);
                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, cNode1);
                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, cNode2);
                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, arc1);
                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, arc2);
                            
                            stack.push(cNode2);
                            nextOperation(input,stack,keynodes,contour,generatedNodes);
                         });
                     });
                 });
            });
        });
    });
}

function generateIntersection(input,stack,keynodes,contour,generatedNodes){
    console.log("Generate intersection");
    var nrelInter = keynodes['nrel_intersection'];
    var int1 = stack.pop();    
    var int2 = stack.pop();
    window.sctpClient.create_node(sc_type_const).done(function (iNode1) {
        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, iNode1, int1).done(function (arc1) {
            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, iNode1, int2).done(function (arc2) {
                window.sctpClient.create_node(sc_type_const).done(function (iNode2) {            
                    window.sctpClient.create_arc(sc_type_const, iNode1, iNode2).done(function (commonArc) { 
                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrelInter, commonArc).done(function (arc) { 
                    
                            // add in contour
                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, nrelInter);
                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, commonArc);
                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, arc);
                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, iNode1);
                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, iNode2);
                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, arc1);
                            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, arc2);
                            
                            stack.push(iNode2);
                            nextOperation(input,stack,keynodes,contour,generatedNodes);
                        });
                    });
                });
            });
        });
    });
}


function generateEquality(stack,keynodes,contour,generatedNodes){
    console.log("Generate equality");
    var nrelEq = keynodes['nrel_equality'];
    var eq1 = stack.pop();    
    var eq2 = stack.pop();
    window.sctpClient.create_node(sc_type_const).done(function (eNode) {
        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, eNode, eq1).done(function (arc1) {
            window.sctpClient.create_arc(sc_type_arc_pos_const_perm, eNode, eq2).done(function (arc2) {
                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrelEq, eNode).done(function (arc) {
                    
                    // add in contour
                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, nrelEq);
                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, arc);
                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, eNode);
                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, arc1);
                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, arc2);
                    
                    SCWeb.core.Main.doDefaultCommand([contour]);   
                }); 
            }); 
        }); 
    }); 
}
