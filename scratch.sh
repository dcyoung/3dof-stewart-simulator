BASE_PATH=/home/dcyoung/github/coffee-table/viz-app/src/components/coasters

for MODEL_NAME in catalina lake-tahoe monterey san-francisco-bay; do
    for SUB in coaster water water_0 water_1; do
        SRC=$BASE_PATH/$MODEL_NAME/$SUB.glb
        DST=$BASE_PATH/$MODEL_NAME/$SUB-draco.glb
        if test -f "$SRC"; then
            /home/dcyoung/github/coffee-table/viz-app/node_modules/gltf-pipeline/bin/gltf-pipeline.js -i $SRC -o $DST -d
            rm $SRC
        fi
    done
done
