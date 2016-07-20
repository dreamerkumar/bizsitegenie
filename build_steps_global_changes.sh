#!/bin/bash
# redirect stdout/stderr to a file and console
exec > >(tee -i build_steps_global_changes_results.log)
exec 2>&1
echo "START ---> build_steps_global_changes"
echo "COMMAND ---> npm install -g forever"
npm install -g forever
echo "COMMAND ---> npm install -g grunt-cli"
npm install -g grunt-cli
echo "COMMAND ---> npm install -g bower"
npm install -g bower
echo "COMMAND ---> npm -g install yo"
npm -g install yo
echo "---> Fix issue with yo command"
echo "COMMAND ---> mkdir -p /root/.config/configstore"
mkdir -p /root/.config/configstore
echo "COMMAND ---> chmod g+rwx /root /root/.config /root/.config/configstore"
chmod g+rwx /root /root/.config /root/.config/configstore
echo "---> link the builder yo generator so that it is available locally"
echo "COMMAND ---> cd generator-builder"
cd generator-builder
echo "COMMAND ---> npm link"
npm link
echo "END ---> build_steps_global_changes"
