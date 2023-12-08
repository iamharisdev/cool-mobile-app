import React, { memo, useRef, useMemo } from 'react';
import { ImageStyle } from 'react-native';
import { View, Image } from 'react-native';
import { ImageWrapper, ImageViewer } from 'react-native-reanimated-viewer';

interface ImageViewerFuncProps {
    images: any,
    style: ImageStyle,
    resizeMode: any
}

const ImageViewerFunc = (props: ImageViewerFuncProps) => {
    const {
        images = [],
        style = { width: 100, height: 100 },
        resizeMode = 'cover'
    } = props
    const imageRef = useRef(null);
    // const mockData: any = useMemo(
    //     () => images,
    //     [],
    // );
    return (
        <>
            <ImageViewer
                ref={imageRef}
                data={images.map((el: any) => ({ key: `key-${el}`, source: { uri: el } }))}
            />
            <View style={{ flex: 1 }}>
                {images.map((el: any, index: any) => (
                    <ImageWrapper
                        key={el}
                        viewerRef={imageRef}
                        index={index}
                        source={{
                            uri: el,
                        }}
                    >
                        <Image
                            source={{
                                uri: el
                            }}
                            style={style}
                            resizeMode={resizeMode}
                        />
                    </ImageWrapper>
                ))}
            </View>
        </>
    );
};
export default memo(ImageViewerFunc);