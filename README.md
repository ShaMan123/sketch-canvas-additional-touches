# sketch-canvas-additional-touches
### trying to add support for a pathOnPress event

I'm using `SketchCanvas` in 2 ways:
```

<SketchCanvas touchEnabled={this.state.mode}  />

changeMode(shouldPaint){
  this.setState({ mode: shouldPaint });
}
```
if `touchEnabled === true` => the user paints
if `touchEnabled === false` => the user touches `SketchCanvas` in order to pick a path.
 
This is why I'm trying to detect if a user touches a path while `touchEnabled` prop is set to `false`.
Is there a way?

Managed to write a function that returns the `pathId` of a touched path.
However it doesn't work properly because of the inaccuracy of the touch and because of the `width` of the path.
Any idea how to detect a touch made on a path that is not exactly on a given point of the path.

I'm clueless regarding native code :(

### dependecies:
    - react
    - react-native
    - lodash
    - @terrylinla/react-native-sketch-canvas
