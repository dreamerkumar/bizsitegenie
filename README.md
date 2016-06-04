#Bizsitegenie Website Builder#
MEAN Framework for Rapid Application Development. Enhanced version of the MEAN Framework at meanjs.org that has a builder UI to generate CRUD code with complex relationships, assign permissions to application modules and create dashboards and graphs.  Spreadsheets can be uploaded to create CRUD code to work with the spreadsheet data.

##Three components sharing the same database instance##
The MongoDB database instance will be shared between the Builder Interface, Builder and the Website. User inputs through the Builder Interface will be stored in the builder tables. The generator will pick information from these tables to generate the client files. Once client files are generated, user can use the website. At any given time, user with the creator rights can go the builder interface to update the website and regenerate the application code.

##Builder controls the main website files##
Builder should be able to generate the files in the main website folder




