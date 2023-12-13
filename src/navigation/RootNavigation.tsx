import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    NewMeeting, Login, JoinMeeting, Initialize, Settings, MeetingRoom
} from '../screens'
import { useGlobalContext } from '../services';
import ParentListener from './ParentListener';
import { LiveStreaming } from '../screens/liveStreaming';


const Stack = createNativeStackNavigator();
const RootNavigation = () => {
    const { initialLoader, initialRoute } = useGlobalContext()
    return (
        <NavigationContainer>
            {
                initialLoader ?
                    <Initialize />
                    :
                    <Stack.Navigator
                        initialRouteName={initialRoute}
                        screenOptions={() => ({
                            presentation: 'card',
                            animation: 'slide_from_right',
                            headerShown: false,
                            gestureEnabled: true,
                            orientation: 'portrait'
                        })}
                    >
                        <Stack.Screen name="ParentListener" component={ParentListener} />
                        <Stack.Screen name="JoinMeeting" component={JoinMeeting} />
                        <Stack.Screen name="NewMeeting" component={NewMeeting} />
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Initialize" component={Initialize} />
                        <Stack.Screen name="Settings" component={Settings} />
                        <Stack.Screen name="MeetingRoom" component={MeetingRoom}
                            options={{ animation: 'slide_from_bottom' }}
                        />
                        <Stack.Screen name="LiveStreaming" component={LiveStreaming}
                            options={{ animation: 'slide_from_bottom' }}
                        />

                    </Stack.Navigator>
            }
            <ParentListener />
        </NavigationContainer>
    )
}

export default RootNavigation