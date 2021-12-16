import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

const Login = () => {
  const [loginInProgress, setLoginInProgress] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '532634367518-taidr0mdmpigks7jsdanogo1mhjama59.apps.googleusercontent.com',
    });
  }, []);

  const login = async () => {
    // disable the signin button
    setLoginInProgress(true);

    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const credential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    auth().signInWithCredential(credential);
  };

  return (
    <View style={styles.loginContainer}>
      <GoogleSigninButton
        style={{width: 192, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={login}
        disabled={loginInProgress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;
