const presets = [
	"@babel/preset-env",
	"@babel/preset-react",
	"@babel/typescript"
];
const plugins = [
	"@babel/plugin-transform-runtime",
];

if (process.env["NODE_ENV"] === "production") {
  plugins.push([
    'babel-plugin-transform-imports',
    {
      '@material-ui/core': {
        'transform': '@material-ui/core/esm/${member}',
        'preventFullImport': true
      },
      '@material-ui/icons': {
        'transform': '@material-ui/icons/esm/${member}',
        'preventFullImport': true
      }
    }
  ]);
}

module.exports = { presets, plugins };
