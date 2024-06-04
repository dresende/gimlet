export default [
	{
		languageOptions : {
			ecmaVersion : 13,
			sourceType  : "module",
		},
		ignores         : [
			"coverage/**",
			"test/**",
		],
		rules           : {
			"indent"                           : [ "error", "tab", { SwitchCase: 1, MemberExpression: "off", CallExpression: { arguments: "off" } } ],
			"linebreak-style"                  : [ "error", "unix" ],
			"quotes"                           : [ "error", "double", { allowTemplateLiterals: true } ],
			"semi"                             : [ "error", "always" ],
			"no-mixed-spaces-and-tabs"         : [ "error", "smart-tabs" ],
			"nonblock-statement-body-position" : [ "error", "beside" ],
			"keyword-spacing"                  : [ "error", { "before": true, "after": true } ],
			"no-unused-vars"                   : [ "error", { "caughtErrors": "none" } ],
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
			"prefer-const"                     : [ "error", { destructuring: "all" } ],
			"no-var"                           : [ "error" ],
			"arrow-spacing"                    : [ "error" ],
			"comma-style"                      : [ "error", "last" ],
			"comma-spacing"                    : [ "error" ],
			"no-unneeded-ternary"              : [ "error" ],
			"space-before-blocks"              : [ "error", "always" ],
			"no-multiple-empty-lines"          : [ "error", { max: 1, maxEOF: 0 } ],
			"no-async-promise-executor"        : [ "off" ],
		}
	}
];
