import React, { Component } from 'react'
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity, Animated, ActivityIndicator, Easing, FlatList, Platform} from 'react-native'
import { API_KEY, BASE_URL } from './../refs/BaseURL'
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window')
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.74;
const SPACING = 10

export default class DetailMovie extends Component {
    state = { 
        data: [],
        scaleBack: new Animated.Value(0),
        similarMovies: [],
        idMovie: this.props.route.params['idMovie'],
        changeMovieLoading: false,
        scaleTitle: new Animated.Value(0),
        scrollEnabled: true
    }
    componentDidMount() {
        this.getDataMovie()       
        this.getSimilarMovies() 
    }
    getDataMovie = async() => {
        await fetch(`${BASE_URL}${this.state.idMovie}${API_KEY}`)
                .then(res => res.json())
                .then(resJSON => {                    
                    this.setState({
                        data: resJSON
                    })
                })
    }
    getSimilarMovies = async() => {
        await fetch(`${BASE_URL}${this.state.idMovie}/recommendations${API_KEY}${API_KEY}`)
                .then(res => res.json())
                .then(resJSON => {
                    this.setState({
                        similarMovies: resJSON.results,
                        changeMovieLoading: false
                    })
                })
    }
    render() {
        const { state, props } = this
        return (
            <ScrollView style = {{ backgroundColor: 'black', flex: 1 }} scrollEnabled = {state.scrollEnabled} >
                {
                    state.data.length == 0 ?
                    <View
                        style = {{
                            flex: 1,
                            backgroundColor: 'black',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >   
                        <ActivityIndicator size = 'small' color = 'white' style = {{ margin: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }} />
                    </View>
                    :
                    <View
                        style = {{
                            flex: 1,
                            backgroundColor: 'black'
                        }}
                    >
                        <View
                            style = {{
                                width,
                                height: 540,
                                position: 'absolute'
                            }}
                        >
                            <Image
                                blurRadius = {0.5}
                                source = {{ uri: `https://image.tmdb.org/t/p/w370_and_h556_multi_faces${state.data.backdrop_path}` }}
                                style = {{
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                            <LinearGradient
                                colors={['rgba(0,0,0,0.5)', 'rgba(0, 0, 0, 0)', 'black',]}
                                style = {{
                                    height: '100%',
                                    width: '100%',
                                    position: 'absolute'
                                }}
                            />
                            <TouchableOpacity
                                onPress = {() => {
                                    props.navigation.navigate(props.route.params['fromScreen'])
                                }}
                                onLongPress = {() => {
                                    Animated.timing(state.scaleBack, {
                                        toValue: 1,
                                        duration: 100,
                                        easing: Easing.ease,
                                        useNativeDriver: true
                                    }).start()
                                }}
                                onPressOut = {() => {
                                    Animated.timing(state.scaleBack, {
                                        toValue: 0,
                                        duration: 100,
                                        easing: Easing.ease,
                                        useNativeDriver: true
                                    }).start()
                                }}
                                style = {{
                                    position: 'absolute',
                                    top: 20, left: 20
                                }}
                            >
                                <Image
                                    source = {require('../images/ic_arrow_back_white.png')}
                                    style = {{
                                        width: 24,
                                        height: 24,
                                    }}
                                />
                            </TouchableOpacity>
                            <Animated.View
                                style = {{
                                    position: 'absolute',
                                    top: 50, left: 20,
                                    transform: [{
                                        scale: state.scaleBack
                                    }]
                                }}
                            >
                                <Text style = {{ color: 'white', padding: 5, backgroundColor: 'rgba(0,0,0,0.2)' }} >
                                    Back
                                </Text>
                            </Animated.View>                            
                        </View>
                        <View
                            style = {{
                                flex: 1,
                                alignItems: 'center'
                            }}
                        >
                            <TouchableOpacity
                                activeOpacity = {0.7}
                                onLongPress = {() => {
                                    this.setState({ scrollEnabled: false })
                                    Animated.timing(state.scaleTitle, {
                                        toValue: 1,
                                        duration: 100,
                                        easing: Easing.ease,
                                        useNativeDriver: true
                                    }).start()
                                }}
                                onPressOut = {() => {
                                    this.setState({ scrollEnabled: true })
                                    Animated.timing(state.scaleTitle, {
                                        toValue: 0,
                                        duration: 100,
                                        easing: Easing.ease,
                                        useNativeDriver: true
                                    }).start()
                                }}
                            >
                                <Image
                                    source = {{ uri: `https://image.tmdb.org/t/p/w370_and_h556_multi_faces${state.data.poster_path}` }}
                                    resizeMode = 'contain'
                                    style = {{
                                        width: 300,
                                        height: 300,
                                        marginTop: 150,
                                        borderRadius: 20
                                    }}
                                />
                            </TouchableOpacity>
                            <Animated.Text
                                style = {{
                                    alignSelf: 'center',
                                    position: 'absolute',
                                    color: 'white',
                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                    padding: 10,
                                    fontSize: 20,
                                    borderRadius: 10,
                                    top: 10,
                                    transform: [{
                                        scale: state.scaleTitle
                                    }]
                                }}
                            >
                                {state.data.title}
                            </Animated.Text>

                            <Text
                                style = {{
                                    color: 'white',
                                    textAlign: 'center',
                                    fontSize: 34,
                                    letterSpacing: 1,
                                    marginTop: 10
                                }}
                            >
                                {state.data.title}
                            </Text>
                            <View
                                style = {{
                                    flexDirection: 'row'
                                }}
                            >
                                <Text
                                    style = {{
                                        color: 'white',
                                        fontSize: 20,
                                        fontWeight: '600',
                                        textAlign: 'center',
                                        marginTop: 20,
                                    }}
                                >
                                    {state.data.vote_average}<Text style = {{fontSize: 15}}>/10</Text>
                                    <Text style = {{fontSize: 17}}>{`\n${state.data.popularity} Popularity`}</Text>
                                </Text>
                            </View>
                            <Text
                                style = {{
                                    color: 'white',
                                    padding: 20
                                }}
                            >
                                {
                                    state.data.genres.map(item => {
                                        return `${item.name}  `
                                    })
                                }
                            </Text>
                        </View>
                        
                        {
                            state.changeMovieLoading ?
                            <ActivityIndicator size = 'small' color = 'white'  style = {{ alignSelf: 'center' }} />
                            :
                            <FlatList
                                data = {state.similarMovies}
                                keyExtractor = {(item) => String(item.id)}
                                horizontal
                                bounces = {false}
                                decelerationRate = {Platform.OS == 'ios' ? 0 : 0.98}
                                renderToHardwareTextureAndroid
                                contentContainerStyle = {{ alignItems: 'center' }}
                                snapToInterval = {ITEM_SIZE}
                                snapToAlignment = 'start'
                                scrollEventThrottle = {16}
                                renderItem = {({item, index}) => {
                                    return (
                                        <TouchableOpacity 
                                            style = {{ width: ITEM_SIZE }}
                                            onPress = {() => {
                                                this.setState({
                                                    data: [],
                                                    idMovie: item.id,
                                                    changeMovieLoading: true
                                                }, () => {
                                                    this.getDataMovie()
                                                    this.getSimilarMovies()
                                                })
                                            }} 
                                        >
                                            <View
                                                style = {{
                                                    marginHorizontal: SPACING,
                                                    padding: SPACING * 2,
                                                    alignItems: 'center',
                                                    backgroundColor: '#2d3436',
                                                    borderRadius: 34,
                                                    overflow: 'hidden',
                                                    marginBottom: 20
                                                }}
                                            >
                                                <Image
                                                    source = {{ uri: `https://image.tmdb.org/t/p/w370_and_h556_multi_faces${item.poster_path}` }}
                                                    style = {{
                                                        width: '100%',
                                                        height: ITEM_SIZE,
                                                        resizeMode: 'cover',
                                                        borderRadius: 24,
                                                        margin: 0,
                                                        marginBottom: 10,
                                                    }}
                                                />
                                                <Text style = {{fontSize: 20, color: 'white', fontWeight: '600', letterSpacing: 0.6}} numberOfLines = {1} >
                                                    {item.title}
                                                </Text>
                                                <Text style = {{fontSize: 14, color: '#b2bec3', fontStyle: 'italic', textAlign: 'center'}} numberOfLines = {3} >
                                                    {item.overview}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        }
                    </View>
                }
                
            </ScrollView>
        );
    }
}