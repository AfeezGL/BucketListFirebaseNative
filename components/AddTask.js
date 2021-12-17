import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddTask = () => {
  const user = auth().currentUser;
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  //update the text state when tnput changes
  const updateText = textValue => {
    setText(textValue);
  };

  //function for creating new task
  const submitForm = () => {
    if (!text) {
      Alert.alert('Error', "Task can't be empty", [{text: 'Ok'}]);
      return;
    }
    try {
      firestore()
        .collection('users')
        .doc(user.uid)
        .collection('targets')
        .add({
          task: text,
          completed: false,
          timestamp: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          setText('');
          setShowAlert(!showAlert);
          setTimeout(() => {
            setShowAlert(false);
          }, 1000);
        });
    } catch (error) {
      Alert.alert('Error', `${error.message}`, [{text: 'Ok'}]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name="arrow-left" size={27} color="black" />
        </TouchableOpacity>
        <Text style={styles.text}> Add New</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.text}>Target</Text>
        <TextInput
          value={text}
          onChangeText={updateText}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => submitForm()} style={styles.btn}>
          <Text style={styles.btnText}>ADD</Text>
        </TouchableOpacity>
        {showAlert && <Text style={styles.text}>Task Added</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
  },
  header: {
    flexDirection: 'row',
  },
  backBtn: {
    width: 30,
  },
  text: {
    fontSize: 27,
  },
  input: {
    fontSize: 21.6,
    padding: 10,
    backgroundColor: 'white',
    marginTop: 18,
    borderRadius: 6,
    borderColor: 'black',
    borderWidth: 1,
  },
  form: {
    height: 500,
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: '#273049',
    color: 'white',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    borderRadius: 6,
    marginTop: 18,
  },
  btnText: {
    fontSize: 18,
    color: 'white',
    width: 108,
    padding: 9,
    textAlign: 'center',
  },
});

export default AddTask;
