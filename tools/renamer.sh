#!/bin/bash

# just in case we need to rename things again
WD=$( dirname "${BASH_SOURCE[0]}" )

# all instances of Dataset in BQProject are from the Google package. I'm going to manually swap over BQPdao before this
for file in $(find {src,test} -type f -name '*.js*'); do
    sed -i '' -e 's/dataset/snapshot/g' $file
    sed -i '' -e 's/Dataset/Snapshot/g' $file
    sed -i '' -e 's/DATASET/SNAPSHOT/g' $file
done

for file in $(find {src,test} -type f -name '*.js*'); do
    sed -i '' -e 's/study/dataset/g' $file
    sed -i '' -e 's/studies/datasets/g' $file
    sed -i '' -e 's/Study/Dataset/g' $file
    sed -i '' -e 's/Studies/Datasets/g' $file
    sed -i '' -e 's/STUDY/DATASET/g' $file
    sed -i '' -e 's/STUDIES/DATASETS/g' $file
done

# rename dataset -> datasnapshot in files and filenames
for file in $(find ${WD}/../{src,test} -name '*dataset*'); do
    renamed=$(echo $file | sed 's/dataset/snapshot/g')
    git mv $file $renamed
done

for file in $(find ${WD}/../{src,test} -name '*Dataset*'); do
    renamed=$(echo $file | sed 's/Dataset/Snapshot/g')
    git mv $file $renamed
done

for file in $(find ${WD}/../{src,test} -name '*study*'); do
    renamed=$(echo $file | sed 's/study/dataset/g')
    git mv $file $renamed
done

for file in $(find ${WD}/../{src,test} -name '*Study*'); do
    renamed=$(echo $file | sed 's/Study/Dataset/g')
    git mv $file $renamed
done
