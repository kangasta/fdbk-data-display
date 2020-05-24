module.exports = {
	moduleFileExtensions: [
		"js",
		"jsx",
		"ts",
		"tsx"
	],
	setupFilesAfterEnv: [
		"<rootDir>/src/setupTests.ts"
	],
	testPathIgnorePatterns: [
		"<rootDir>/node_modules/",
		"<rootDir>/demo/"
	]
}