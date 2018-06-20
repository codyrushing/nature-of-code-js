# Forces

Newton's third law is important.  Forces occur in pairs.  If you push on a parked truck, it will push back on you with the same force.  But forces don't always cancel eachother out, because they can act on different objects in a system.  For example, pushing that same truck on an icy slope means that you could actually push it and it won't push back so much on you.  Sometimes, it's not worth simulating all the forces in a system.  For example, with wind, you usually don't simulate the force that the objects exert back on the air.  

When working with forces, remember that forces are directly proportional to accelerations, and inversely proportional to mass.  When making a forces-based simulation,  __acceleration has no memory__.  If the force stops, the acceleration instantly stops.

### Friction
```
->Friction = μN * -Vunit
(
  μ = coefficient of friction
  N = normal force
  Vunit = Velocity unit vector
)
```
