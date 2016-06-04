
echo 'running command yo builder:crud-from-db with parameter '
echo $1
yo builder:crud-from-db $1 --force
NODE_ENV=development grunt build
