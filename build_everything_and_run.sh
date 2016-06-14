#!/bin/sh
echo "START ---> build_everything_and_run"
echo "RUN SCRIPT FILE ---> build_local_and_global.sh"
./build_local_and_global.sh
echo "RUN SCRIPT FILE ---> run_mongod_service.sh"
./run_mongod_service.sh
echo "RUN SCRIPT FILE ---> run_app_in_prod_mode_after_mongod_is_running.sh"
./run_app_in_prod_mode_after_mongod_is_running.sh
echo "END ---> build_everything_and_run"