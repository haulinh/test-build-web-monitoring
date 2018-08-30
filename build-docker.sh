docker build -t envisoft-web-gis .
docker tag envisoft-web-gis today108/envisoft-web-gis
docker push today108/envisoft-web-gis
echo "success deploy web gis"
