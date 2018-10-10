# Oscillations

[https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Transformations](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Transformations)

### Managing drawing states

You can store the current drawing state by calling `ctx.save()`.  This stores the current:

* The transformations that have been applied (i.e. translate, rotate and scale – see below).
* The current values of the following attributes: strokeStyle, fillStyle, globalAlpha, lineWidth, lineCap, lineJoin, miterLimit, lineDashOffset, shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, globalCompositeOperation, font, textAlign, textBaseline, direction, imageSmoothingEnabled.
* The current clipping path, which we'll see in the next section.

For example, if you set `fillStyle = 'red'`, it will stay red for anything you fill.  If you call `ctx.restore()` it goes back to the previous saved state, or the default state if there are no more states on the stack.  You will want to do this unless you want everything to stay red.

From the mozdev docs:

> It's a good idea to save the canvas state before doing any transformations. In most cases, it is just easier to call the restore method than having to do a reverse translation to return to the original state.

Forgetting to `save()` before translating and `restore()` will cause subsequent transforms to sum from the previous one, usually causing your drawing to extend way out of bounds of where you expect it to be, usually off screen.

### Rotations
Rotational transformation are kind of simpler than 2d vector transformations because rotations are simple scalars (a unitless value).

You will usually want to `translate()` before you `rotate()` when drawing an object.  Rotating first changes the entire coordinate system, and they your translate is not where you expect it to be.

### Basic trig
* __sin, cos, tan__ - get an x or y value for a given angle
* There are inverse methods for doing the opposite, deriving an angle from an x and y (a vector).

Eg. rotating an object in the direction that it is facing.  In that case, use `atan2(y, x)`.

```js
// derive a vector from a known angle
tan(a) = y/x
// derive an angle from a known vector
atan2(y/x) = a;
```

__Polar coordinates__ - you can use angle and radius to define a point in 2D space.

```
y = sin(angle) * r
x = cos(angle) * r
```

`r` is they hypotenuse, or the magnitude of the vector in question.
