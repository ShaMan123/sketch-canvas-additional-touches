'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    FlatList,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Linking,
    Dimensions,
    ViewPropTypes,
    ImageBackground,
    BackHandler,
    PanResponder,
    Alert
} from 'react-native';
import * as _ from 'lodash';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import addTouchDataToPath from './addTouchDataToPath';

const styles = StyleSheet.create({
    highlightContainer: {
        position: 'absolute',
        backgroundColor: 'transparent'
    },
    revolverContainer: {
        position: 'absolute',
        bottom: -100,
        alignSelf: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'green'
    },
    revolverIcon: {
        borderRadius: 50,
        padding: 5,
        backgroundColor: 'pink',
        zIndex: 1
    },
});

const eventTimingValues = {
    onPressMax: 400,
    onLongPressMin: 500
}

export default class CustomCanvas extends Component {
    static propTypes = {

    }
    static defaultProps = {

    };

    constructor(props) {
        super(props);

        this.pushPath = this.pushPath.bind(this);
        this.popPath = this.popPath.bind(this);
        this.testTouchData = this.testTouchData.bind(this);
        this.didTouchPaths = this.didTouchPaths.bind(this);
        this.didTouchPathGesture = this.didTouchPathGesture.bind(this);
        this.panResponderGrantFlow = this.panResponderGrantFlow.bind(this);
        

        this.loadPanResponder.call(this);

        this.paths = [];

        this.state = {
            width: null,
            height: null,
            canvasMode: true
        };
    }

    loadPanResponder() {
        this._didTriggerLongPress = false;
        this._longPressTimeout;
        this._panResponderGrant;

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gestureState) => !this.state.canvasMode && gestureState.numberActiveTouches === 1 ? true : false,
            onMoveShouldSetPanResponder: (e, gestureState) => !this.state.canvasMode && gestureState.numberActiveTouches === 1 ? true : false,

            onPanResponderGrant: ({ nativeEvent }, gestureState) => {
                this._offset = {
                    x: nativeEvent.pageX - nativeEvent.locationX,
                    y: nativeEvent.pageY - nativeEvent.locationY
                }

                this._didTriggerLongPress = false;
                this._panResponderGrant = new Date();

                const x = parseFloat((gestureState.x0 - this._offset.x).toFixed(2));
                const y = parseFloat((gestureState.y0 - this._offset.y).toFixed(2));

                this.panResponderGrantFlow(x, y);
            },
            onPanResponderRelease: (e, gestureState) => {
                this._panResponderGrant = null;
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
        });
    }

    pushPath(path) {
        _.assign(path.path, addTouchDataToPath(path))
        this.paths.push(path);
    }

    popPath(pathId) {
        const index = this.paths
            .findIndex((pathData) => {
                return pathId === pathData.path.id;
            })
        if (index > -1) {
            this.canvas.deletePath(pathId);
            //this.paths.splice(index, 1);
        }
    }

    testTouchData() {
        if (!__DEV__) return;
        this.paths
            .map((pathData) => {
                test.call(this, pathData);
            })

        function test(pathData) {
            const newPath = {};
            _.assign(newPath, pathData)
            const newPathId = parseInt(Math.random() * 100000000);
            _.assign(newPath.path, {
                id: newPathId,
                color: 'blue',
                //width: 5,
                data: pathData.path.rawTouchData.map(([x, y]) => {
                    return `${x},${y}`;
                })
            })

            this.canvas.addPath(newPath);
            const _t = setTimeout(() => {
                this.popPath(newPathId);
                clearTimeout(_t);
            }, 7000)
        }
    }

    didTouchPaths(x, y) {
        const base = 1;
        const touchedPaths = this.paths
            .map((pathData) => {
                return pathData.path.touchData.some((coords) => {
                    return Math.round(coords[0] / base) === Math.round(x / base) && Math.round(coords[1] / base) === Math.round(y / base);
                }) ? pathData.path.id : null;
            })
            .filter((val) => {
                return val ? true : false;
            });
        console.log('touchedPaths', touchedPaths)
        return touchedPaths;
    }

    didTouchPathGesture(pathId) {
        if (pathId) {
            const upperPath = this.paths
                .find(({ path }) => {
                    return path.id === pathId;
                });
            if (upperPath) {
                const newPath = {};
                Object.assign(newPath, upperPath);
                const newPathId = parseInt(Math.random() * 100000000);
                newPath.path.id = newPathId;
                //newPath.path.color = '#800080';
                newPath.path.width = 40;
                //this.canvas.deletePath(upperPath.path.id);
                this.canvas.addPath(newPath);

                return new Promise((resolve, reject) => {
                        const _t = setTimeout(() => {
                            this.popPath(newPathId);
                            clearTimeout(_t);
                            resolve(true);
                        }, 1000)
                    })
            }
        }

    }

    async panResponderGrantFlow(x, y) {
        const touchedPaths = this.didTouchPaths(x, y);
        const upperPathId = touchedPaths.length > 0 ? touchedPaths.pop() : null;
        if (upperPathId) {
            await this.didTouchPathGesture(upperPathId);
        }
        return upperPathId;
    }
    
    render() {
        const { canvasMode } = this.state;
        const { width, height } = Dimensions.get('window');
        const title = canvasMode ? 'switch to picking mode' : 'switch to painting mode';
        
        return (
            <View style={{ flex: 1, width, height }}>
                <View style={[styles.highlightContainer, { width, height }]}
                    {...this._panResponder.panHandlers}>
                    <SketchCanvas
                        style={{ flex: 1, width, height }}
                        strokeColor='pink'
                        strokeWidth={24}
                        ref={ref => this.canvas = ref}
                        touchEnabled={canvasMode}
                        onStrokeEnd={this.pushPath}
                    />
                </View>
                <Button title={title} onPress={() => {
                    this.setState((prevState) => {
                        return {
                            canvasMode: !prevState.canvasMode
                        }
                    })
                }} />
                <Button title='show touch Data' onPress={() => { this.testTouchData() }} />
            </View>
        );
    }
}
