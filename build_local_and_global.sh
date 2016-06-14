#!/bin/sh
echo "START ---> build_local_and_global"
echo "RUN SCRIPT FILE ---> build_steps_for_local_dir.sh"
./build_steps_for_local_dir.sh
echo "RUN SCRIPT FILE ---> build_steps_global_changes.sh"
./build_steps_global_changes.sh
echo "END ---> build_local_and_global"