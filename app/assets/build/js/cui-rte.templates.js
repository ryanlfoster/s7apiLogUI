this["CUI"] = this["CUI"] || {};
this["CUI"]["rte"] = this["CUI"]["rte"] || {};
this["CUI"]["rte"]["Templates"] = this["CUI"]["rte"]["Templates"] || {};

this["CUI"]["rte"]["Templates"]["dlg-link"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div data-rte-dialog=\"link\" class=\"popover rte-dialog\">\n    <div class=\"rte-dialog-column-container\">\n        <div class=\"rte-dialog-column\">\n            <input type=\"text\" data-type=\"href\" value=\"\" class=\"dark\">\n        </div>\n        <div class=\"rte-dialog-column\">Open in new tab:</div>\n        <div class=\"rte-dialog-column\"><label><input type=\"radio\" name=\"targetBlank\" value=\"true\" data-type=\"targetBlank\"><span></span>Yes</label></div>\n        <div class=\"rte-dialog-column\"><label><input type=\"radio\" name=\"targetBlank\" value=\"false\" data-type=\"targetBlank\" checked><span></span>No</label></div>\n        <div class=\"rte-dialog-column\">\n            <button type=\"button\" data-type=\"cancel\" tabindex=\"-1\" class=\"dialog-button icon-close small white\"></button>\n        </div>\n        <div class=\"rte-dialog-column\">\n            <button type=\"button\" data-type=\"apply\" tabindex=\"-1\" class=\"dialog-button icon-check small white primary\"></button>\n        </div>\n    </div>\n</div>\n";
  });

this["CUI"]["rte"]["Templates"]["popover-item"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<button type=\"button\" data-action=\"";
  if (stack1 = helpers.plugin) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.plugin; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "#";
  if (stack1 = helpers.command) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.command; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"-1\" class=\"item disabled ";
  if (stack1 = helpers.icon) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.icon; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1);
  if (stack1 = helpers.addClasses) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.addClasses; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></button>";
  return buffer;
  });

this["CUI"]["rte"]["Templates"]["popover-trigger"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<button type=\"button\" data-action=\"";
  if (stack1 = helpers.ref) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.ref; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"-1\" class=\"item ";
  if (stack1 = helpers.icon) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.icon; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " trigger";
  if (stack1 = helpers.addClasses) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.addClasses; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></button>";
  return buffer;
  });

this["CUI"]["rte"]["Templates"]["popover"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }

  buffer += "<div data-id=\"";
  if (stack1 = helpers.ref) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.ref; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"popover rte-popover\">\n";
  stack1 = helpers.each.call(depth0, depth0.popoverItems, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>";
  return buffer;
  });

this["CUI"]["rte"]["Templates"]["separator"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div class=\"separator\"></div>";
  });

this["CUI"]["rte"]["Templates"]["tb-container"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n<div data-type=\""
    + escapeExpression(((stack1 = depth0.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n    ";
  stack2 = ((stack1 = depth0.toolbar),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    ";
  stack2 = helpers.each.call(depth0, depth0.popovers, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</div>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        ";
  stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0.toolbars, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });

this["CUI"]["rte"]["Templates"]["toolbar-item"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<button type=\"button\" data-action=\"";
  if (stack1 = helpers.plugin) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.plugin; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "#";
  if (stack1 = helpers.command) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.command; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"-1\" class=\"item disabled ";
  if (stack1 = helpers.icon) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.icon; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1);
  if (stack1 = helpers.addClasses) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.addClasses; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></button>";
  return buffer;
  });

this["CUI"]["rte"]["Templates"]["toolbar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }

  buffer += "<div class=\"rte-toolbar\">\n";
  stack1 = helpers.each.call(depth0, depth0.toolbarItems, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>";
  return buffer;
  });

this["CUI"]["rte"]["Templates"]["ui-space"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div data-type=\"";
  if (stack1 = helpers.mode) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.mode; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></div>";
  return buffer;
  });