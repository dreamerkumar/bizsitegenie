#!/bin/bash
# redirect stdout/stderr to a file and console
exec > >(tee -i build_steps_for_local_dir_results.log)
exec 2>&1
echo "START ---> build_steps_for_local_dir"
echo "COMMAND ---> cd website"
cd website
echo "COMMAND ---> cd public"
cd public
echo "COMMAND ---> mkdir -p dist"
mkdir -p dist
echo "COMMAND ---> chmod 777 dist"
chmod 777 dist
echo "COMMAND ---> cd ../"
cd ../
echo "COMMAND ---> npm install"
npm install
echo "COMMAND ---> bower install --allow-root"
bower install
echo "COMMAND ---> grunt build"
grunt build
echo "COMMAND ---> cd public"
cd public
echo "COMMAND ---> 777 modules"
chmod 777 modules
echo "COMMAND ---> ../app"
cd ../app
echo "COMMAND ---> 777 *"
chmod 777 *
echo "COMMAND ---> mkdir -p models"
mkdir -p models
echo "COMMAND ---> 777 models"
chmod 777 models
echo "COMMAND ---> ../../generator-builder"
cd ../../generator-builder
echo "COMMAND ---> npm install"
npm install
echo "END ---> build_steps_for_local_dir"
