# sketch-canvas-additional-touches
### trying to add support for a pathOnPress event

I'm using `SketchCanvas` from [@terrylinla/react-native-sketch-canvas](https://github.com/terrylinla/react-native-sketch-canvas) in 2 ways:
```

<SketchCanvas touchEnabled={this.state.mode}  />

changeMode(shouldPaint){
  this.setState({ mode: shouldPaint });
}
```

if `touchEnabled === true` => the user paints

if `touchEnabled === false` => the user touches `SketchCanvas` in order to pick an existing path.
 
This is why I'm trying to detect if a user touches a path while `touchEnabled` prop is set to `false`.

Is there a way?

I've Managed to write a function that returns the `pathId` of a touched path (pure js).

However it doesn't work properly mainly because of the `width` of the path.

Any idea how to detect a touch made on a path that isn't on one of it's defined points?

I'm clueless regarding native code :(

### dependecies:
    - react
    - react-native
    - lodash
    - @terrylinla/react-native-sketch-canvas
