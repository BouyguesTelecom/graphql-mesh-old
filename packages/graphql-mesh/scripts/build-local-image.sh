#!/bin/sh

set -e

# Copy parent patches to the docker context
cp -r ../../patches/* ./patches
# build the docker image
docker build -t graphql-mesh .
# Remove the patches from the docker context
rm -rf patches/@graphql-tools+batch-execute+9.0.2.patch patches/@graphql-tools+executor+1.2.0.patch patches/graphql+16.8.1.patch

