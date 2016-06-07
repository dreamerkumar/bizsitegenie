# mongoose-integer

mongoose-integer is a plugin to validate integer values within a Mongoose Schema.

I was really tired of casting or validating my `Number` fields to an integer value. So I created this easy-to-use plugin that takes all the work from you.

## Usage

```
npm install mongoose-integer
```

Then, simply apply the plugin to your schema:

```js
var mongoose = require('mongoose');
var integerValidator = require('mongoose-integer');

var mySchema = new mongoose.Schema({
	value: {
		type: Number,
		integer: true
	}
});

mySchema.plugin(integerValidator);
```

## Custom Error Messages

You can pass through a custom error message as part of the optional `options` argument:

```js
mySchema.plugin(integerValidator, { message: 'Error, expected {PATH} to be an integer.' });
```

You can also pass a specific error message as a `string` in your field declaration:

```js
var mySchema = new mongoose.Schema({
	value: {
		type: Number,
		integer: 'Value must be an integer.'
	}
});
```

You have access to all of the standard Mongoose error message templating:

*   `{PATH}`
*   `{VALUE}`
*   `{TYPE}`

# Tests

To run the tests you need a local MongoDB instance available. Run with:

```
npm test
```
# Issues

Please use the GitHub issue tracker to raise any problems or feature requests.

If you would like to submit a pull request with any changes you make, please feel free!
