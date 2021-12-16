import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import Login from './components/Login';

export default function App() {
  const Stack = createNativeStackNavigator();
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    auth().onAuthStateChanged(response => {
      if (mounted) {
        setUser(response);
        setLoaded(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  // return a loading spinner when checking auth state
  if (!loaded)
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    );

  // return the login component when user is not logged in
  if (loaded && !user) return <Login />;

  // return the main app component when user is logged in
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="HomeScreen" component={Tasks} />
        <Stack.Screen name="AddTask" component={AddTask} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#E3E9F0',
    fontFamily: 'Montserrat, sans-serif',
    position: 'relative',
    lineHeight: 27,
  },
});
