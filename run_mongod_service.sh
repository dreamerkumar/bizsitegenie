#!/bin/bash
# redirect stdout/stderr to a file and console
exec > >(tee -i run_mongod_service_results.log)
exec 2>&1
echo "START ---> run_mongod_service"
echo "COMMAND ---> mkdir -p mongodb"
mkdir -p mongodb
echo "COMMAND ---> mongod --dbpath mongodb"
mongod --fork --logpath mongodb.log --dbpath mongodb 
echo "END ---> run_mongod_service"
