import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'
import RoomItem from './RoomItem';

const RoomDetailComponent = ({roomInfo}) => {

  return (
   <FlatList 
   data={roomInfo}
   renderItem={({item}) => <RoomItem item={item} />}
   />
  )
}

export default RoomDetailComponent