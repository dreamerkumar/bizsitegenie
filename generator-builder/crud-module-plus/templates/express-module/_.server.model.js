'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    integerValidator = require('mongoose-integer');

/**
 * <%= humanizedSingularName %> Schema
 */
var <%= classifiedSingularName %>Schema = new Schema({	
	<%if(isChildCrud){ %>parentId: {		
		type: String,
		default: '',
		required: 'Parent Id is missing',
		trim: true		
	},
	<%}%><% properties.forEach(function(prop){ %><%=prop.camelizedSingularName%>: {<%
		if(prop.required) { %>
		required: 'Please fill \'<%=prop.humanizedSingularAllLowerCaseName%>\'', <%}%><%
		if(prop.formFieldType === "checkbox"){ %>
		type: Boolean<%} else if(prop.formFieldType === "foreignkeyref"){ %>
		type: Schema.Types.ObjectId,
		ref: '<%=prop.attributes.referencedFeatureName%>'<%} else if(prop.formFieldType === "number"){ %>
		type: Number
		<%} else if(prop.formFieldType === "integer"){ %>
		type: Number, 
		integer: 'Please enter an integer value for \'<%=prop.humanizedSingularAllLowerCaseName%>\''<%} else if(prop.formFieldType === "datetime"){ %>
		type: Date<%} else if(prop.formFieldType === "image"){ %>
		type: String,
		default: '',		
		trim: true
	},
	<%=prop.camelizedSingularName%>_fileKey: {<%if(prop.required) { %>
		required: 'Please upload a file for \'<%=prop.humanizedSingularAllLowerCaseName%>\'', <%}%>	
		type: String,
		default: '',		
		trim: true 
	<%} else if(prop.formFieldType === "file"){ %>
		type: String,
		default: '',		
		trim: true
	},
	<%=prop.camelizedSingularName%>_fileKey: {<%if(prop.required) { %>
		required: 'Please upload a file for \'<%=prop.humanizedSingularAllLowerCaseName%>\'', <%}%>
		type: String,
		trim: true<%} else {%>		
		type: String,
		default: '',		
		trim: true<%}%>		
	},
	<% }); %>
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

<%= classifiedSingularName %>Schema.plugin(integerValidator);

mongoose.model('<%= classifiedSingularName %>', <%= classifiedSingularName %>Schema, '<%= classifiedSingularName %>');