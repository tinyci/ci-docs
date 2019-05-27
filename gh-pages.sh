#!bash

set -e

curbranch=$(git rev-parse HEAD)
dir=${PWD}

git checkout master
make build
git branch -D gh-pages || :
git checkout --orphan gh-pages
find . ! -wholename './build/*' -a ! -wholename './build' -a ! -wholename './.git' -a ! -wholename './.git/*' | xargs rm -rf || :
rsync -av build/* .
rm -rf build

agents=$(mktemp -d /tmp/ci-agents.XXXXX)
git clone https://github.com/tinyci/ci-agents ${agents}
cd ${agents}
git submodule update --init --recursive
cd ci-gen
make swagger-docs grpc-docs
mkdir ${dir}/swagger
cp swagger/docs.html ${dir}/swagger/index.html
mkdir ${dir}/grpc
cp grpc/docs/index.html ${dir}/grpc/index.html
rm -rf ${agents}

cd ${dir}

git add .
git commit -a -s -m "tinyCI docs generated on $(date)"
git push -f origin gh-pages
update-github-pages
