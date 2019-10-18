const alfy = require('alfy')
const csscolors = require('css-color-names');
const colorwayData = require('@helpscout/colorway/data/colors.json')
const { initialize, hexToRGB, flattenColors } = require('./utils')
const { ICONS_DIR, SHADES } = require('./constants')

initialize()

const HUES = Object.keys(colorwayData)
const { input } = alfy
let items = []

if (input) {
  if (input.startsWith('find')) {
    let [command, colorCode] = input.split(' ')

    if (colorCode) {
      try {
        const flattenedColors = flattenColors(colorwayData)
        const nearestColor = require('nearest-color').from(flattenedColors)
        
        colorCode = csscolors[colorCode] ? csscolors[colorCode] : colorCode
        
        const nearest = nearestColor(colorCode)
        const rgb = hexToRGB(nearest.value)

        items.push({
          title: `Closest color is ${nearest.name}`,
          subtitle: nearest.value,
          arg: nearest.value,
          icon: {
            path: `${ICONS_DIR}/${nearest.name}.png`,
          },
          mods: {
            alt: {
              valid: true,
              arg: nearest.value.replace('#', ''),
              subtitle: nearest.value.replace('#', ''),
            },
            cmd: {
              valid: true,
              arg: rgb,
              subtitle: rgb,
            },
          },
        })
      } catch (err) {
        items.push({
          title: 'Color cannot be converted',
          subtitle: err.message,
          valid: false,
        })
      }
    }
  } else {
    const [inputHue, inputShade] = input.split('.')
    const matchedHue = HUES.filter(hue => inputHue.startsWith(hue))[0]

    if (matchedHue && !inputShade) {
      const group = colorwayData[matchedHue]
      const shades = Object.keys(group)

      items = shades
        .map(shade => {
          if (shade != 'default') {
            const color = group[shade]
            const rgb = hexToRGB(color)

            return {
              title: `${matchedHue}.${shade}`,
              subtitle: color,
              arg: color,
              icon: {
                path: `${ICONS_DIR}/${matchedHue}.${shade}.png`,
              },
              mods: {
                alt: {
                  valid: true,
                  arg: color.replace('#', ''),
                  subtitle: color.replace('#', ''),
                },
                cmd: {
                  valid: true,
                  arg: rgb,
                  subtitle: rgb,
                },
              },
            }
          }
          return null
        })
        .filter(Boolean)
    } else if (matchedHue && inputShade) {
      const group = colorwayData[matchedHue]
      const matchedShade = SHADES.filter(shade =>
        inputShade.startsWith(shade)
      )[0]

      if (matchedShade) {
        const color = group[matchedShade]
        const rgb = hexToRGB(color)

        items.push({
          title: color,
          arg: color,
          icon: {
            path: `${ICONS_DIR}/${matchedHue}.${matchedShade}.png`,
          },
          mods: {
            alt: {
              valid: true,
              arg: color.replace('#', ''),
              subtitle: color.replace('#', ''),
            },
            cmd: {
              valid: true,
              arg: rgb,
              subtitle: rgb,
            },
          },
        })
      }
    } else {
      items.push({
        title: 'No matches',
        subtitle: `Available hues: ${HUES.join(', ')}`,
        valid: false,
      })
    }
  }
}

alfy.output(items)
