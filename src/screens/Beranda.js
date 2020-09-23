import React, { Component } from 'react'
import { View, TouchableOpacity, Text, FlatList, Dimensions, Animated, Image, ActivityIndicator, StatusBar } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { API_KEY } from '../refs/BaseURL';
import { BASE_URL } from '../refs/BaseURL';

const { width, height } = Dimensions.get('window')

const SPACING = 10;
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;

const Loading = () => {
  return (
    <View
      style = {{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text>Loading...</Text>
    </View>
  )
}


const menu = [
  {
    title: 'Popular'
  },
  {
    title: 'Upcoming'
  },
  {
    title: 'Top Rated'
  }
]

export default class Beranda extends Component {
  state = { 
    movies: [],
    scrollX: new Animated.Value(0),
  }
  componentDidMount() {
    this.getMovies()    
    console.log(this.state.movies)
    StatusBar.setHidden(true)
  }
  getMovies = async() => {
      await fetch(`${BASE_URL}popular${API_KEY}`)
      .then(res => res.json())
      .then(resJSON => {
          this.setState({
            movies: resJSON.results
          })
          // console.log(JSON.stringify(resJSON, null, 4))
      })
      .catch(error => {
          console.warn(error)
      })
  }

  render() {
    const {state} = this
    if (state.movies.length == 0) {
      <Loading />
    }
    return (
      <View style = {{flex: 1, backgroundColor: 'black'}} >
        
        <View style={{ height: BACKDROP_HEIGHT, width, position: 'absolute' }}>
          <LinearGradient
            colors={['#b2bec3', 'black']}
            style={{
              height: BACKDROP_HEIGHT,
              width,
              position: 'absolute',
              bottom: 0,
            }}
          />
        </View>
        <View style = {{ flexDirection: 'row', padding: 15, alignItems: 'center' }} >
            <Text style = {{ color: 'white', fontSize: 18, fontWeight: 'bold', fontStyle: 'italic', justifyContent: 'center', flex: 1 }} >
              {`SKUY\nNOBAR`}
            </Text>
            {
              menu.map((item, index) => {
                return (
                  <TouchableOpacity
                    key = {index}
                    activeOpacity = {0.6}
                  >
                    <Text
                      style = {{
                        color: 'white',
                        fontSize: 16,
                        letterSpacing: 0.5,
                        marginLeft: 10
                      }}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                )
              })
            }
        </View>


        <Animated.FlatList
          showsVerticalScrollIndicator = {false}
          data = {state.movies}
          keyExtractor = {(item) => String(item.id)}
          horizontal
          bounces = {false}
          decelerationRate = {Platform.OS == 'ios' ? 0 : 0.98}
          renderToHardwareTextureAndroid
          contentContainerStyle = {{ alignItems: 'center' }}
          snapToInterval = {ITEM_SIZE}
          snapToAlignment = 'start'
          onScroll = {Animated.event(
            [{ nativeEvent: { contentOffset: { x: state.scrollX } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle = {16}
          renderItem = {({ item, index }) => {
            if (!item.poster_path) {
              return ( <View style = {{ width: EMPTY_ITEM_SIZE }} /> )
            }

            const inputRange = [
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
              (index + 1) * ITEM_SIZE
            ]

            const translateY = state.scrollX.interpolate({
              inputRange,
              outputRange: [0, -40, 0],
              extrapolate: 'clamp'
            })

            return (
              <View style = {{width: ITEM_SIZE}} >
                <TouchableOpacity
                  activeOpacity = {0.5}
                  onPress = {() => {
                    this.props.navigation.navigate('DetailMovie', {
                        fromScreen: 'Beranda',
                        idMovie: item.id
                    })
                  }}
                >
                  <Animated.View
                    style = {{
                      marginHorizontal: SPACING,
                      padding: SPACING * 2,
                      alignItems: 'center',
                      transform: [{translateY}],
                      backgroundColor: '#2d3436',
                      borderRadius: 34,
                      overflow: 'hidden'
                    }}
                  >
                    <Image
                      source = {{ uri: `https://image.tmdb.org/t/p/w370_and_h556_multi_faces${item.poster_path}` }}
                      style = {{
                        width: '100%',
                        height: ITEM_SIZE * 1.2,
                        resizeMode: 'cover',
                        borderRadius: 24,
                        margin: 0,
                        marginBottom: 10,
                      }}
                    />
                    
                    <Text style = {{fontSize: 20, color: 'white', fontWeight: '600', letterSpacing: 0.6}} numberOfLines = {1} >
                      {item.title}
                    </Text>
                    <Text style = {{fontSize: 14, color: '#b2bec3', fontStyle: 'italic', textAlign: 'center' }} numberOfLines = {3} >
                      {item.overview}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              </View>
            )
          }}
        />
      </View>
    );
  }
}