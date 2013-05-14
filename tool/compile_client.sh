#!/bin/bash

SOURCE_PATH=/home/ila/project/i/client/js/vendor/i/source
OUTPUT_PATH=/home/ila/project/i/client/js/vendor/i
java -jar ./compiler/compiler.jar \
    --js $SOURCE_PATH/Util.js \
    $SOURCE_PATH/Const.js \
    $SOURCE_PATH/Logger.js \
    $SOURCE_PATH/ex/Exception.js \
    $SOURCE_PATH/ex/ExceptionCodes.js \
    $SOURCE_PATH/idb/IndexedDB.js \
    $SOURCE_PATH/idb/PKIndexedDBStore.js \
    $SOURCE_PATH/idb/ModelIndexedDBStore.js \
    $SOURCE_PATH/idb/ListIndexedDBStore.js \
    $SOURCE_PATH/model/PK.js \
    $SOURCE_PATH/model/Model.js \
    $SOURCE_PATH/model/List.js \
    $SOURCE_PATH/model/Maker.js \
    $SOURCE_PATH/WebSocket.js \
    $SOURCE_PATH/DataPool.js \
    $SOURCE_PATH/LogicController.js \
    $SOURCE_PATH/Renderer.js \
    $SOURCE_PATH/FileSystem.js \
    $SOURCE_PATH/Loader.js \
    --js_output_file $OUTPUT_PATH/i.js \
    --language_in ECMASCRIPT5 \
    --compilation_level WHITESPACE_ONLY
    #--compilation_level SIMPLE_OPTIMIZATIONS
