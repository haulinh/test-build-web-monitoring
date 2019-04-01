BRAND_NAME=$(git symbolic-ref --short HEAD)
docker build . -t ilotusland/enviro-web-gis:${BRAND_NAME}
docker push ilotusland/enviro-web-gis:${BRAND_NAME}
echo "success deploy web gis"