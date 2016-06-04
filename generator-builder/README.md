This project is a fork of original MeanJS Yeoman Generator with some added enhancements

[Original Documentation of the Official Mean.JS Yeoman Generator](https://github.com/meanjs/generator-meanjs)

##To Use This Generator
After downloading the files for this generator.

Install it with the following command 
```
npm install
```

Link it so that the generator is available from any folder
```
npm link
```

If yeoman is not already installed, install it globally
```
npm install -g yo
```

To test this generator, create a new folder and from within that folder, run this command to create the meanjs app. 
```
yo meanjs-plus <app name>
```

You should have a corresponding file with <app name>.json in the folder "yo-generator-inputs\meanjs-plus\" which should contain the details of the app. Here is the format for the file:
```
#!javascript
//By convention, the name of this input file will be the name of the application
{
	//How would you describe your application?
	"appDescription": "The first app ever created through yo meanjs-plus",

	//How would you describe your application in comma seperated key words?
	"appKeywords": "meanjs plus yeoman crud app web app",

	//What is your company/author name?
	"appAuthor": "Vishal Kumar",

	//Which Bootstrap theme would you like to include?
	//Available Options (see  http://www.bootstrapcdn.com/#bootswatch_tab)
	//Default Bootstrap Theme (default)
	//cerulean			
	//cosmo
	//cyborg			
	//darkly			
	//flatly
	//journal			
	//lumen			
	//paper			
	//readable			
	//sandstone			
	//simplex			
	//slate			
	//spacelab			
	//superhero			
	//united			
	//yeti
	"bootstrapTheme": "spacelab"

}
```

After that, it will generate the framework code for you.

You can run the application after that using the grunt command.

Keep Mongo running before trying to run the application
```
C:\Program Files\MongoDB\Server\3.0\bin>mongod --dbpath C:\path-to-folder-you-want-mongo-to-use-for-storing-data
```

Run the test application and verify if it is working on the browser at http://localhost:3000
```
grunt
```

##Currently Working On

Ability to create crud module for a set of input fields instead of just one tag
Ability to run in non interactive mode, so input will be provided through a .json file. This file should be within sub folder "yo-generator-inputs\meanjs-plus\crud-module-plus". The name of the json file will become the name of the module.

Below is the format of the json file

```
#!javascript

{
	//Whether new entitities will be created without overriding any existing module with the same name
	createNew: false,

	//Whether the module will be visible to other authenticated users
	visibleToOtherAuthenticatedUsers,

	//Whether the module will be visible to all users (authenticated and unauthenticated)
	visibleToUnAuthenticatedUsers,

	//Add menu to top bar that has submenus for list and create new
	showInTopMenu,

	//An array of one or more properties
	properties: [
	{
		//label of the property (can be string with spaces)
		//name will be inferred from this
		propertyLabel,

		//currently supported are input, select, textarea (Future - Date Time Control)
		//if left blank, the tagName will be set to input by default
		tagName,
		
		//array of name and value pairs e.g. type=text, value="1" that will be added to the create and edit screens
		//for tagName of input an entry of type=text is assigned by default if not specified		
		attributes, 	
		

		//label for the form field
		label,
		
		
		//placeholder text. default text is please enter a value for <propertyName>
		placeholder,
		

		//array containing text and a set of attributes (same rule as the one for attributes above applies)(an attribute of value is required) 
		//do not include the attribute selected as angular should handle it based on the value of the property
		selectTagOptions,  
		
		//text and an array of attributes (an attribute of value is required) 
		//do not include attribute checked which should be handled by angular based on the propertyvalue
		inputTagRadioTypeOptions

		//mongoose schema
		//default is
		//{
		//	type: String,
		//	default: '',
		//	required: 'Please fill <propertyName> name',
		//	trim: true
		//},
		mongooseSchema,
                
                //Future (support for templates to use. It might have some directories to look into.)
                viewTemplate,
                editTemplate,
                listTemplate,
                createTemplate
	}]
}

```
