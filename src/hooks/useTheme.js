import { useColorMode } from '@chakra-ui/react'

export const useTheme = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  const isDark = colorMode === 'dark'
  const bgColor = isDark ? 'gray.800' : 'gray.50'
  const cardBgColor = isDark ? 'gray.700' : 'white'
  const textColor = isDark ? 'white' : 'gray.800'
  const borderColor = isDark ? 'gray.600' : 'gray.200'

  return {
    isDark,
    toggleColorMode,
    theme: {
      bgColor,
      cardBgColor,
      textColor,
      borderColor
    }
  }
}