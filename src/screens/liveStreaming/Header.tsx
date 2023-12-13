import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import {hp, wp} from '../../global';
import Icons from 'react-native-vector-icons/Ionicons';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import SIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Colors, Fonts} from '../../res';
import {Button} from '../../components';

const Header = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.leftIconView}>
        <Icons
          name="chevron-back"
          size={25}
          color={'white'}
          style={{alignSelf: 'center'}}
        />
      </TouchableOpacity>

      <Image
        source={{
          uri: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg',
        }}
        style={styles.imageStyle}
      />

      <TouchableOpacity style={styles.nameView}>
        <Text style={styles.nameStyle} numberOfLines={1}>
          userName
        </Text>
        <MIcons
          name="arrow-drop-down"
          size={28}
          color={'white'}
          style={{alignSelf: 'center'}}
        />
      </TouchableOpacity>
      <View style={styles.rightContainer}>
        <Button
          text="Live"
          buttonOuterStyle={styles.liveOuterBtn}
          buttonStyle={[styles.liveInnerBtn, {backgroundColor: 'red'}]}
          textStyle={styles.liveTextStyle}
        />
        <Button
          text="1.2K"
          buttonOuterStyle={[styles.liveOuterBtn, {width: wp(17)}]}
          buttonStyle={[styles.liveInnerBtn]}
          textStyle={styles.liveTextStyle}
          leftChild={
            <Icons
              name="eye"
              size={15}
              color={'white'}
              style={{alignSelf: 'center', marginRight: wp(1)}}
            />
          }
        />

        <Button
          buttonOuterStyle={[styles.liveOuterBtn, {width: wp(15)}]}
          buttonStyle={[styles.liveInnerBtn, {backgroundColor: 'transparent'}]}
          leftChild={
            <SIcons
              name="frame"
              size={25}
              color={'white'}
              style={{alignSelf: 'center', marginRight: wp(1)}}
            />
          }
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
   
    width: wp(100),
    height: hp(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIconView: {justifyContent: 'center', width: wp(10), height: '100%'},
  imageStyle: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(8),
    alignSelf: 'center',
  },
  nameView: {
    marginLeft: wp(2),
    width: wp(22),
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameStyle: {
    color: 'white',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: wp(8),
    width: wp(50),
  },
  liveOuterBtn: {width: wp(15), height: hp(3.5)},
  liveInnerBtn: {
    paddingHorizontal: 0,
    minWidth: 0,
    height: hp(4),
  },
  liveTextStyle: {color: 'white', fontSize: wp(3.6)},
});
