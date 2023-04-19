module.exports = {
	env : {
		browser : true,
		node    : true,
		es2022  : true,
	},
	parserOptions : {
		ecmaVersion : 13,
	},
	extends        : [ "eslint:recommended" ],
	rules          : {
		"indent"                           : [ "error", "tab", { SwitchCase: 1, MemberExpression: "off", CallExpression: { arguments: "off" } } ],
		"linebreak-style"                  : [ "error", "unix" ],
		"quotes"                           : [ "error", "double", { allowTemplateLiterals: true } ],
		"semi"                             : [ "error", "always" ],
		"no-mixed-spaces-and-tabs"         : [ "error", "smart-tabs" ],
		"nonblock-statement-body-position" : [ "error", "beside" ],
		"keyword-spacing"                  : [ "error", { "before": true, "after": true } ],
		"no-unused-vars"                   : [ "warn" ],
		"no-cond-assign"                   : [ "error" ],
		"no-useless-escape"                : [ "off" ],
		"no-console"                       : [ "off" ],
		"no-control-regex"                 : [ "off" ],
		"no-empty"                         : [ "error", { allowEmptyCatch: true } ],
		"no-prototype-builtins"            : [ "off" ],
		"no-unmodified-loop-condition"     : [ "error" ],
		"no-unreachable-loop"              : [ "error" ],
		"require-atomic-updates"           : [ "off" ],
		"no-unsafe-optional-chaining"      : [ "error" ],
		"no-delete-var"                    : [ "off" ],
		"prefer-const"                     : [ "warn", { destructuring: "all" } ],
		"no-var"                           : [ "warn" ],
	}
};
