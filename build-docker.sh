# đoạn script này sẽ build ra docker image,
# với name là DOCKER_IMAGE và tag của docker image chính là git branch name
#-----------------------------------------------------------------------
REGISTRY=ilotusland.azurecr.io
DOCKER_IMAGE=ilotusland/enviro-web-gis
BRAND_NAME=$(git symbolic-ref --short HEAD)

#-----------------------------------------------------------------------
docker build . -t ${REGISTRY}/${DOCKER_IMAGE}:${BRAND_NAME}
docker push ${REGISTRY}/${DOCKER_IMAGE}:${BRAND_NAME}

echo -----------------------------------------------------------------------
echo Image sau khi build thành công sẽ có tên: ${REGISTRY}/${DOCKER_IMAGE}:${BRAND_NAME}