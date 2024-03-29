import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {ScrollView} from 'react-native-virtualized-view';
import {styles} from './style';
import {useEffect, useState} from 'react';
import DemoYouTubePlayerView from '../DemoYoutubePlayerView';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import {ScreenNames} from '../../../general/constants/ScreenNames';
import {PreferenceKeys} from '../../../general/constants/Global';
import {getPreference} from '../../../libs/storage/PreferenceStorage';
export default function CourseView({navigation, route, props}) {
  const {key, id, title, rate, image, price} = route.params;
  const [isFavourited, setIsFavourited] = useState(0);
  const [isRegistered, setIsRegistered] = useState(0);
  const [courseData, setCourseData] = useState({});
  const [sectionData, setSectionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  var registerCourseText = isRegistered ? 'Huỷ đăng ký' : 'Đăng ký học';
  var registerCourseColor = isRegistered ? '#FF0000' : '#38761d';
  function minuteToHour(minute) {
    var duration = '';
    if (minute < 0) return (duration = 0);
    else if (minute < 60) return (duration = minute + 'phút');
    else if (minute >= 60)
      return minute / 60 + ' ' + 'giờ' + ' ' + (minute % 60) + ' ' + 'phút';
  }

  function getVideoId(url) {
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[1]) {
      const videoId = match[1];
      return videoId;
    } else return null;
  }

  useEffect(() => {
    const fetchData = async () => {
      const userId = await getPreference(PreferenceKeys.UserId);
      console.log(userId);
      const promise1 = fetch(
        `https://unica-production-3451.up.railway.app/api/course/${id}`,
      )
        .then(response => response.json())
        .catch(error => console.error(error));

      const promise2 = fetch(
        'https://unica-production-3451.up.railway.app/api/course/view',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            course_id: id,
          }),
        },
      )
        .then(() => {
          response => response.json();
          return promise3;
        })

        .catch(error => console.error(error));

      const promise3 = fetch(
        `https://unica-production-3451.up.railway.app/api/course/list-view/${userId}`,
      )
        .then(response => response.json())
        .catch(error => console.error(error));

      const [result1, result2, result3] = await Promise.all([
        promise1,
        promise2,
        promise3,
      ]);
      setCourseData(result1.data);
      setSectionData(result1.data.parts);
      const findCourse = result3.data.find(course => course.id === id);
      setIsFavourited(findCourse.pivot.is_favo);
      setIsRegistered(findCourse.pivot.is_subcribe);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // console.log(sectionData[0].videos[0].path);

  const sections = sectionData.map(section => ({
    title: section.name,
    data: section.videos,
    part: section.part,
    length: section.videos.length,
  }));

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <View style={[styles.item_text_container, {width: '80%'}]}>
        <Text style={styles.item_text}>
          {item.name} : {item.description}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(ScreenNames.videoView, {
            videoId: getVideoId(item.path),
            title: item.name + ':' + ' ' + item.description,
          });
        }}
        style={styles.learn_button}
      >
        <Text style={styles.button_text}>Vào học</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = ({section}) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionHeader_text, {width: '80%'}]}>
        Phần {section.part} : {section.title}
      </Text>
      <Text style={[styles.sectionHeader_text, {fontSize: 16}]}>
        {section.length} bài
      </Text>
    </View>
  );

  const handleFavouritedPress = async () => {
    const userId = await getPreference(PreferenceKeys.UserId);
    try {
      const response = await fetch(
        'https://unica-production-3451.up.railway.app/api/course/favo',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            course_id: id,
            is_favo: isFavourited ? 0 : 1,
          }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data);

        setIsFavourited(data.data.is_favo);
      } else {
        // Handle error response from API
      }
    } catch (error) {
      console.error(error);
      // Handle error while making API call
    }
  };

  const handleRegisteredPress = async () => {
    const userId = await getPreference(PreferenceKeys.UserId);
    try {
      const response = await fetch(
        'https://unica-production-3451.up.railway.app/api/course/subcribe',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            course_id: id,
            is_subcribe: isRegistered ? 0 : 1,
          }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data);

        setIsRegistered(data.data.is_subcribe);
      } else {
        // Handle error response from API
      }
    } catch (error) {
      console.error(error);
      // Handle error while making API call
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0975b5" />;
  }

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          <Icon style={styles.icon} size={25} name="arrow-back-outline" />
        </TouchableOpacity>
        <View style={styles.textView}>
          <Text numberOfLines={1} style={styles.header_text}>
            {JSON.stringify(title).replace(/\"/g, '')}
          </Text>
        </View>
        <View style={styles.right_icon_container}></View>
      </View>
      <View style={{height: '100%', width: '100%'}}>
        <Image source={{uri: courseData.photo}} style={styles.course_image} />
        <View style={styles.course_info}>
          <ScrollView style={{height: '100%', width: '100%'}}>
            <View style={styles.first_container}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={styles.price_container}>
                  <Text style={styles.price}>{price}</Text>
                  <Text style={[styles.price, {fontSize: 24}]}>$</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleFavouritedPress()}
                  style={styles.heart_button}
                >
                  <Icon
                    name="heart"
                    size={26}
                    color={isFavourited === 1 ? 'red' : 'white'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{width: '100%', height: 50, marginTop: 20}}>
              <TouchableOpacity
                style={{
                  marginHorizontal: 20,
                  backgroundColor: registerCourseColor,
                  borderRadius: 5,
                  height: ' 100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  handleRegisteredPress();
                }}
              >
                <Text
                  style={{fontSize: 18, color: 'white', fontWeight: 'bold'}}
                >
                  {registerCourseText}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '100%',
                marginTop: 30,
                marginHorizontal: 20,
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}
              >
                <FontAwesome
                  name="clock-o"
                  color="#000000"
                  size={20}
                  style={{width: 25}}
                />
                <Text style={{fontSize: 16, color: '#000000'}}>
                  Thời lượng : {minuteToHour(courseData.duration)}
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}
              >
                <FontAwesome
                  name="play-circle-o"
                  color="#000000"
                  size={20}
                  style={{width: 25}}
                />
                <Text style={{fontSize: 16, color: '#000000'}}>Giáo trình</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}
              >
                <Foundation
                  name="loop"
                  color="#000000"
                  size={20}
                  style={{width: 25}}
                />
                <Text style={{fontSize: 16, color: '#000000'}}>
                  Sở hữu trọn đời
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}
              >
                <FontAwesome
                  name="certificate"
                  color="#000000"
                  size={20}
                  style={{width: 25}}
                />
                <Text style={{fontSize: 16, color: '#000000'}}>
                  Cấp chứng nhận hoàn thành
                </Text>
              </View>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                height: 40,
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#000000',
                  marginLeft: 20,
                }}
              >
                Giới thiệu khoá học
              </Text>
            </View>
            <Text
              style={{marginHorizontal: 20, color: '#000000', marginTop: 5}}
            >
              {courseData.description}
            </Text>
            {isRegistered ? (
              <SectionList
                scrollEnabled={false}
                sections={sections}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                removeClippedSubviews={true}
                ListFooterComponent={
                  <View
                    style={{
                      // backgroundColor: 'yellow',
                      height: 50,
                      width: '100%',
                    }}
                  ></View>
                }
                ListHeaderComponent={
                  <View
                    style={{
                      // backgroundColor: 'yellow',
                      height: 50,
                      width: '100%',
                    }}
                  ></View>
                }
              />
            ) : (
              <></>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
