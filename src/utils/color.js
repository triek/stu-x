export const withAlpha = (color, alphaHex) => {
  if (!color) return color

  if (color.startsWith('#')) {
    if (color.length === 4) {
      const [r, g, b] = color.slice(1)
      return `#${r}${r}${g}${g}${b}${b}${alphaHex}`
    }

    if (color.length === 7) {
      return `${color}${alphaHex}`
    }

    if (color.length === 9) {
      return `${color.slice(0, 7)}${alphaHex}`
    }
  }

  if (color.startsWith('rgb(')) {
    const values = color
      .replace(/rgba?\(/, '')
      .replace(/\)/, '')
      .split(',')
      .map((value) => Number(value.trim()))

    if (values.length >= 3) {
      const [r, g, b] = values
      const alpha = parseInt(alphaHex, 16) / 255
      return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`
    }
  }

  return color
}
