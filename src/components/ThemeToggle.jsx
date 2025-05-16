import { IconButton, useColorMode } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { motion, AnimatePresence } from 'framer-motion'

const MotionIconButton = motion(IconButton)

export const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  return (
    <AnimatePresence mode="wait" initial={false}>
      <MotionIconButton
        key={colorMode}
        aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
        icon={isDark ? <SunIcon /> : <MoonIcon />}
        onClick={toggleColorMode}
        position="fixed"
        bottom={4}
        right={4}
        size="lg"
        colorScheme={isDark ? 'orange' : 'purple'}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
    </AnimatePresence>
  )
}