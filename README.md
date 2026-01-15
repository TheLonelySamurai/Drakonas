# Drakonas
# Project Overview

*Drakonas* is an animation and digital art software built to be convenient for multiple user types.
# Problem Statement

Animators have a lot of options for software, but ours will be easy to create different kinds of projects quickly due to our introduction of two templates
# Core Features

## Digital Art

*Drakonas* will house the ability for users to create digital art with different pen types and the ability to edit the image as well. This will also use layers for the convenience of the user. In all, the digital art will include the following features:

- Canvas Settings
	- Canvas Size
	- Transparent Background
- Pen Tool
- Pixel Perfect Tool
- Fill Tool
- Air Brush
- Shape Tool
- Line tool
- Curve Tool
- RGBA colors and color picker
- Square Select
- Lasso Select
- Eraser
- Rotate
- Layers
## Animation

*Drakonas* will utilize the digital art tools for the purpose of creating a frame by frame animation. The tools for the animation will include:

- Animation Settings
	- Frame rate
- Frame viewer
- Frame reorder
- Frame duplication
- Onion view
- Animation Preview

Exporting the file as an animation is the end goal for Drakonas. As such the following export settings will be included:

- Export as PNG (Current Frame)
- Export as PNG (Spritesheet)
- Export as ZIP (Individual Frames)
- Export as GIF
	- Looping or non looping
- Export as MP4
## Storyboard Template Generator

The first **distinct feature** of *Drakonas* seeks to make it easier to streamline longform animation. 

1. After inputting a expected duration, or inputting a number of storyboard frames, the user will be given a storyboard project with a number of frames matching those inputs. 
2. Then, the default sketch based tools, which would be Pen Tool on low opacity, or the text tool will be used to storyboard the parts of the animation. 
3. Finally, when the user is finished storyboarding the rest of the animation, they will create a new project with the storyboard as a default background layer that is on low opacity using a **single button.**

## Character Action Template Generator

The second **distinct feature** of *Drakonas* will allow game developers and animators to create multiple animations from the same starting frame or few frames seamlessly.

1. The user would begin by being prompted to either:

	1. Create a starting frame or frames
	2. Import starting frame or frames
	
3. The user will then be prompted to include how many animations for the character/item they want to create.
4. The user will be able to animate in the same manner as the blank project version of *Drakonas*, but they will also be able to easily switch between animations, onion between animations of different actions, not just within the same animation, and view all animations vertically.	
5. When the user needs to export an animation, they may choose to export one animation of the character/item individually, or all of the animations within a ZIP.
## Audio

The audio features that will be included in *Drakonas* are for when exporting to video specifically. A user will be able to import an audio file and then do the following with it:

- Crop audio length
- Match audio start/end to frames in animation
- Edit volume of audio
# Technology Stack

*Drakonas*'s frontend will be shown using React.js while it's backend handled by Java. Finally, the database we will be using is MySQL.
