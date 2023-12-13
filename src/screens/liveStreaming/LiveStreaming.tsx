import {
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import SIcons from 'react-native-vector-icons/SimpleLineIcons';
import {hp, wp} from '../../global';
import Header from './Header';
import {Button} from '../../components';
import { Fonts } from '../../res';

const LiveStreaming = () => {
  const twilioRef = useRef(null);
  const [status, setStatus] = useState('connecting');
  const [isIndex, setIsIndex] = useState(null);

  useEffect(() => {
    twilioRef.current.connect({
      roomName: '',
      accessToken: '',
      enableVideo: true,
    });
    return () => {
      twilioRef?.current?.disconnect();
    };
  }, []);

  const _onEndButtonPress = () => {};
  const _onFlipButtonPress = () => {
    twilioRef.current.flipCamera();
  };
  const _onRoomDidConnect = ({roomName, error}: any) => {
    console.log('onRoomDidConnect: ', roomName);
  };
  const _onRoomDidDisconnect = ({roomName, error}: any) => {
    console.log('[Disconnect]ERROR: ', error);
  };
  const _onRoomDidFailToConnect = (error: any) => {
    console.log('RoomDidFailToConnect:', error);
  };
  const _onParticipantAddedVideoTrack = ({participant, track}: any) => {
    // setVideoTracks(
    //   new Map([
    //     ...videoTracks,
    //     [
    //       track.trackSid,
    //       {participantSid: participant.sid, videoTrackSid: track.trackSid},
    //     ],
    //   ]),
    // );
  };
  const _onParticipantRemovedVideoTrack = ({participant, track}: any) => {
    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);
  };
  const _onNetworkLevelChanged = ({participant, isLocalUser, quality}: any) => {
    // console.log(
    //   'Participant',
    //   participant,
    //   'isLocalUser',
    //   isLocalUser,
    //   'quality',
    //   quality,
    // );
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: 'red'}]}>
      {/* <StatusBar translucent={true} /> */}
      <View style={styles.contentContainer}>
        <View style={styles.callCon}>
          {['OverView', 'Live Chat', 'Explore'].map((i: any, index: number) => {
            return (
              <Button
                text={i}
                buttonStyle={{backgroundColor: 'transparent'}}
                onPress={() => setIsIndex(index)}
                textStyle={{fontFamily:isIndex==index?Fonts.APPFONT_B:Fonts.APPFONT_L}}
              />
            );
          })}
        </View>
      </View>

      {status === 'connected' || status === 'connecting' ? (
        <View style={styles.callContainer}>
          {status === 'connected' && (
            <TwilioVideoParticipantView
              style={[
                styles.remoteVideo,
                {
                  height: hp(100),
                  width: wp(100),
                },
              ]}
              key={'key1'}
              // trackIdentifier={trackIdentifier}
            />
          )}
          <View
            style={[
              styles.optionsContainer,
              {
                height: hp(100),
              },
            ]}>
            <TwilioVideoLocalView enabled={true} style={styles.localVideo} />
            <View />
          </View>
        </View>
      ) : null}

      <Header />

      <TwilioVideo
        ref={twilioRef}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
        onNetworkQualityLevelsChanged={_onNetworkLevelChanged}
      />
    </SafeAreaView>
  );
};

export default LiveStreaming;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    width: wp(100),
    height: hp(7),
    backgroundColor: 'green',
  },
  callCon: {
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  callContainer: {
    flex: 0.93,
  },

  localVideo: {
    width: wp(100),
    height: hp(100),
  },

  optionsContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
  },
});
