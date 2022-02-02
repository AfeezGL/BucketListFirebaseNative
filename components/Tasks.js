import React, {useState, useEffect} from 'react';
import Task from './Task';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

const Tasks = () => {
  const user = auth().currentUser;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [completed, setCompleted] = useState([]);

  // get users tasks from the backend when the component mounts

  useEffect(() => {
    let mounted = true;

    // get users tasks from the backend when the component mounts
    try {
      firestore()
        .collection('users')
        .doc(user.uid)
        .collection('targets')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
          }));

          const incomplete = docs.filter(doc => !doc.data.completed);

          const completed = docs.filter(doc => doc.data.completed);
          if (mounted) {
            setAllTasks(docs);
            setTasks(incomplete);
            setCompleted(completed);
            setLoading(false);
          }
        });
    } catch (error) {
      Alert.alert('Error', `${error.message}`, [{text: 'OK'}]);
    }

    return () => {
      mounted = false;
    };
  }, []);

  //function to set a task as completed
  const completeTask = id => {
    try {
      firestore()
        .collection('users')
        .doc(user.uid)
        .collection('targets')
        .doc(id)
        .update({completed: true});
    } catch (error) {
      Alert.alert('Error', `${error.message}`, [{text: 'OK'}]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.padding}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Targets</Text>
        </View>
        <FlatList
          data={tasks}
          renderItem={({item}) => (
            <Task task={item} clickFunction={completeTask} />
          )}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
        <FlatList
          data={completed}
          renderItem={({item}) => (
            <Text
              style={{
                textDecorationLine: 'line-through',
                fontSize: 18,
                color: 'black',
              }}>
              {item.data.task}
            </Text>
          )}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
        {!loading && allTasks < 1 && <Text style={styles.no}>No Tasks</Text>}
      </View>
      <View>
        <TouchableOpacity
          style={styles.footer}
          onPress={() => {
            navigation.navigate('AddTask');
          }}>
          <Icon
            name="plus"
            size={18}
            color={'white'}
            style={{paddingRight: 8}}
          />
          <Text style={styles.footerLink}>ADD NEW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

let ScreenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    height: ScreenHeight + 6,
    justifyContent: 'space-between',
  },
  padding: {
    paddingLeft: 18,
    paddingRight: 18,
  },
  header: {
    paddingTop: 18,
    paddingBottom: 18,
  },
  headerText: {
    fontSize: 30,
    color: 'black',
  },
  scroll: {
    height: ScreenHeight - 125,
  },
  footer: {
    backgroundColor: '#273049',
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 18,
  },
  footerLink: {
    color: 'white',
    fontSize: 18,
  },
  no: {
    fontSize: 18,
    color: 'black',
  },
});
export default Tasks;
