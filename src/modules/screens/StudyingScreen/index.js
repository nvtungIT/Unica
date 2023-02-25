import React, {Component, useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {styles} from './style';
import {PreferenceKeys} from '../../../general/constants/Global';
import {getPreference} from '../../../libs/storage/PreferenceStorage';
import AppHeader from '../../components/AppHeader';
import CourseBox from '../../components/CourseBox';
export default function StudyingScreen(navigation) {
  console.log('StudyingScreen is rendering !!!!');
  const [listCourseData, setListCourseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userId = await getPreference(PreferenceKeys.UserId);

      const promise1 = fetch(
        `https://unica-production-3451.up.railway.app/api/course/list-subcribe/${userId}`,
      )
        .then(response => response.json())
        .catch(error => console.error(error));

      const [result1] = await Promise.all([promise1]);
      setListCourseData(result1.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0975b5" />;
  }

  const renderItem = ({item}) => (
    <CourseBox
      key={item.id}
      title={item.name}
      rate={item.rate}
      image={item.photo}
      price={item.price}
      navigation={navigation}
    />
  );
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View style={styles.header}>
        <Text style={styles.header_text}>Khoá học trọn đời</Text>
      </View>
      <ScrollView horizontal={true} style={styles.courses_container}>
        <FlatList
          horizontal={false}
          data={listCourseData}
          renderItem={renderItem}
          keyExtractor={course => course.id}
          removeClippedSubviews={true}
          maxToRenderPerBatch={6}
          initialNumToRender={6}
          numColumns={2}
        />
      </ScrollView>
    </View>
  );
}
