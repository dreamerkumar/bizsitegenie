#Bizsitegenie Web Application Framework#
An Open Source Full Stack Framework in Javascript prebuilt with the most common features that every web application needs. 

##MEAN Framework for Rapid Application Development##
Bizsitegenie can come in handy for Rapid Application Development. You can get a lot done before you even write your first line of code. 

It is built on top of the MEAN Framework at meanjs.org. It gives us the complete code base for our stack with the Authentication module already in place. That gives us User Login and Registration along with Social Logins. 

It also has a builder UI to generate CRUD code with complex relationships with ease. You can assign permissions to each modules based on user groups and roles. UI can also be used to create dashboards and graphs. Spreadsheets can be uploaded to import existing data and automatically create appropriate CRUD based on the spreadsheet columns.

See all the features in this 3 minute video:

[![Bizsitegenie Framework features at a glance](https://i.vimeocdn.com/video/571422537_295x166.webp)](https://player.vimeo.com/video/167171173)

Also check out a quick [video on creating a TODO application with bizsitegenie](https://bizsitegenie.com/example-todo/) using it's UI interface only (without touching the code base).

##Three components sharing the same database instance##
The MongoDB database instance will be shared between the Builder Interface, Builder and the Website. User inputs through the Builder Interface will be stored in the builder tables. The generator will pick information from these tables to generate the client files. Once client files are generated, user can use the website. At any given time, user with the creator rights can go the builder interface to update the website and regenerate the application code.

##Builder controls the main website files##
Builder should be able to generate the files in the main website folder

##Installation##

Since MEAN stack runs on node and mongodb database, they have to be installed first. To make sure that you don't run into compatibility issues, you should also install node in a way that you can switch the running version of node at any given time. 

Once the pre-requisities are installed you can take advantage of the installation scripts at the root level to get up and running with minimum efforts. Note that these scripts are .sh files so they are good for Mac. For windows, you can see the contents of these scripts and run the given commands in a new your command window. 

[Refer to this link for the detailed installation instructions with video tutorials](https://bizsitegenie.com/installation)

###Running the application using docker compose###
If you have docker compose installed and running, then you can just use the command "docker-compose up" from the root directly. Your application will be up and running right away. 

Behind the scenes, it will run two containers. One for MongoDB database. And the second one will be the actual web server connected to the first container. 

