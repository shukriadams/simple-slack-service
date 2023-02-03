# fail on all errors
set -e

# when running on a CI system like travis, use switch "--ci"
# when running locally, force clean jspm build with "--jspm"
CI=0
JSPM=0
DOCKERPUSH=0
TESTMOUNT=0
while [ -n "$1" ]; do 
    case "$1" in
    --ci) CI=1 ;;
    --dockerpush) DOCKERPUSH=1 ;;
    --testmount) TESTMOUNT=1 ;;
    esac 
    shift
done

# Setup work folder to build from. This is needed on dev systems where we want to be able to bypass local node modules etc
# We use cp on CI systems because we can't be sure rsync is available there
# NOTE : jspm hits github each time you run a local build. If you do this enough times you'll hit your github rate limit

mkdir -p .clone 
    
if [ $CI -eq 1 ]; then
    # if running on CI system, copy everything from src to .clone folder
    cp -R ./../src .clone/ 
else
    echo "Copying a bunch of stuff, this will likely take a while ...."

    rsync -v -r --exclude=node_modules --exclude=data --exclude=.* ./../src .clone 
fi

docker run -v $(pwd)/.clone:/tmp/build shukriadams/node12build:0.0.1 sh -c "cd /tmp/build/src && yarn --no-bin-links --ignore-engines --production" 

# combine artifacts from steps 1 and 2 and zip them
rm -rf .stage 
mkdir -p .stage

cp -R .clone/src/node_modules .stage 
cp -R .clone/src/lib .stage 
cp -R .clone/src/routes .stage 

cp .clone/src/index.js .stage
cp .clone/src/package.json .stage 


rm -f .stage.tar.gz 
tar -czvf .stage.tar.gz .stage 

# build 3: Build the base container, using the zip. We do this in a subfolder so we can limit the size of the docker build context,
# else docker will pass in everything in current folder 
docker build -t shukriadams/simple-slack-service .

if [ $TESTMOUNT -eq 1 ]; then
    # test build
    docker-compose -f docker-compose-testmount.yml down 
    docker-compose -f docker-compose-testmount.yml up -d 
    # give container a chance to start
    sleep 1 
    # confirm app has started
    LOOKUP=$(curl --silent localhost:4311) 
    reqsubstr="simple-slack-service"
    if test "${LOOKUP#*$reqsubstr}" != "$LOOKUP"
    then
        echo "Smoke test passed"
    else
        echo "ERROR : container smoke test failed, got ${LOOKUP}"
        exit 1
    fi
fi


if [ $DOCKERPUSH -eq 1 ]; then
    TAG=$(git describe --tags --abbrev=0) 
    docker login -u $DOCKER_USER -p $DOCKER_PASS 
    docker tag shukriadams/simple-slack-service:latest shukriadams/simple-slack-service:$TAG 
    docker push shukriadams/simple-slack-service:$TAG 
fi


echo "Build complete"