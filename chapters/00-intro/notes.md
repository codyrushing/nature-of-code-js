### Randomness

__Gaussian__ - normal distributions.  Distribution is defined by the mean and standard deviation

### Noise

__Perlin (or simplex) noise__ - more natural.  Perlin noise functions are used to determine a value for a given x, y (and maybe z) point.  Usually for drawing some kind of landscape or texture in up to 3 dimensions. Nearby points have similar but slightly varying values that follow natural curves.  For a noise generator, you typically seed it with a random value to ensure that no two noise generators give the same output for the same input.

Another common strategy is to pass it an incremented frame count, which will produce different output for each frame.
