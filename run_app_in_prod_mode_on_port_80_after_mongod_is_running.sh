#!/bin/bash
# redirect stdout/stderr to a file and console
exec > >(tee -i run_app_in_prod_mode_on_port_80_after_mongod_is_running_results.log)
exec 2>&1
echo "START ---> run_app_in_prod_mode_on_port_80_after_mongod_is_running"
echo "COMMAND ---> cd website"
cd website
echo "COMMAND ---> NODE_ENV=production PORT=80 forever server.js"
NODE_ENV=production PORT=80 forever server.js
echo "END ---> run_app_in_prod_mode_on_port_80_after_mongod_is_running"
