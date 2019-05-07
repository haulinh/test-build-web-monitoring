# đoạn script này sẽ build ra docker image,
# với name là DOCKER_IMAGE và tag của docker image chính là git branch name
#-----------------------------------------------------------------------
DOCKER_IMAGE=ilotusland/enviro-web-gis
BRAND_NAME=$(git symbolic-ref --short HEAD)

docker build . -t ${DOCKER_IMAGE}:${BRAND_NAME}
docker push ${DOCKER_IMAGE}:${BRAND_NAME}
echo --------------------------------------------------
echo "success deploy with name ${DOCKER_IMAGE}:${BRAND_NAME}"