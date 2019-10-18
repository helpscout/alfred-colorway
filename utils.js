const fs = require('fs')
const Jimp = require('jimp')
const colorwayVersion = require('@helpscout/colorway/package.json').version
const colorwayData = require('@helpscout/colorway/data/colors.json')
const { ICONS_DIR, ICONS_GENERATED } = require('./constants')

function initialize() {
  let generatedFile

  try {
    generatedFile = fs.readFileSync(ICONS_GENERATED)
  } catch (e) {
    generatedFile = null
  }

  if (
    !generatedFile ||
    colorwayVersion !== JSON.parse(generatedFile).colorwayVersion
  ) {
    clearDir(ICONS_DIR)
    createGenerationFile(colorwayVersion)
    generateIcons(colorwayData)

    return true
  }

  return false
}

function clearDir(directory) {
  try {
    const files = fs.readdirSync(directory)

    for (const file of files) {
      if (file !== '.gitkeep') {
        fs.unlink(path.join(directory, file), err => {
          if (err) throw err
        })
      }
    }
  } catch (error) {
    throw error
  }
}

function createGenerationFile(colorwayVersion) {
  try {
    const data = JSON.stringify({
      timestamp: Date.now(),
      colorwayVersion,
    })
    fs.writeFileSync(ICONS_GENERATED, data)
  } catch (error) {
    throw error
  }
}

function generateIcons(colors) {
  const hues = Object.keys(colors)

  hues.forEach(hue => {
    const group = colors[hue]
    const shades = Object.keys(group)

    shades.forEach(shade => {
      if (shade != 'default') {
        const color = group[shade]

        new Jimp(30, 30, color, (err, image) => {
          if (err) throw err

          image.write(`${ICONS_DIR}/${hue}.${shade}.png`, err => {
            if (err) throw err
          })
        })
      }
    })
  })
}

function hexToRGB(hex) {
  let r = 0
  let g = 0
  let b = 0

  // 3 digits
  if (hex.length == 4) {
    r = '0x' + hex[1] + hex[1]
    g = '0x' + hex[2] + hex[2]
    b = '0x' + hex[3] + hex[3]

    // 6 digits
  } else if (hex.length == 7) {
    r = '0x' + hex[1] + hex[2]
    g = '0x' + hex[3] + hex[4]
    b = '0x' + hex[5] + hex[6]
  }

  return `rgb(${+r}, ${+g}, ${+b})`
}

function flattenColors(colorwayData) {
  const flattenColors = {}

  Object.keys(colorwayData).forEach(group => {
    Object.keys(colorwayData[group]).forEach(shade => {
      if (shade !== 'default') {
        const shadeColor = colorwayData[group][shade]
        flattenColors[`${group}.${shade}`] = shadeColor
      }
    })
  })

  return flattenColors
}

module.exports = {
  clearDir,
  createGenerationFile,
  flattenColors,
  generateIcons,
  initialize,
  hexToRGB,
}
