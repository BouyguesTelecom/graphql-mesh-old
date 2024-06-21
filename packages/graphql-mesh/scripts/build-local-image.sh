#!/bin/sh

set -e

# Copy parent patches to the docker context
cp -r ../../patches/* ./patches
# build the docker image
docker build -t graphql-mesh .
# Remove the patches from the docker context
rm -rf patches/@graphql-tools+batch-execute+*.patch patches/@graphql-tools+executor+*.patch patches/graphql+*.patch patches/@graphql-tools+merge+*.patch

