## Alfred Colorway Workflow

This is an [Alfred](https://www.alfredapp.com/) Workflow to quickly interact with HSDS colors, using colorway.

## Install

`$ npm install --global @helpscout/alfred-colorway`

## Usage

To trigger the workflow, type `cw`

### Options

- `cw _hue_`: returns a list of all color shades for the particular _*hue*_. Example: `cw whaletail`
- `cw _hsds.color_`: returns the color code (HEX, RGB) of the HSDS color. Example: `cw blue.500`
- `cw find _color_`: returns the closest color from the HSDS palette for any given color. Accepts rgb, hex and css named colors. Example: `cw find dodgerblue`

### Interactions

- Selecting an item from the list copies the HEX (eg #BADA55) to the clipboard and pastes on the most front application (this last bit can be configured inside Alfred preferences).
- Selecting while pressing `⌥ option` will copy the hex code without the #
- Selecting while pressing `⌘ cmd` will copy the rgb code
