import { QRCodeSVG } from 'qrcode.react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChakraProvider,
  Box,
  VStack,
  Input,
  Button,
  Heading,
  Textarea,
  SimpleGrid,
  Container,
  Text
} from '@chakra-ui/react'
import { DownloadIcon } from '@chakra-ui/icons'
import { useQRCode } from './hooks/useQRCode'
import { useTheme } from './hooks/useTheme'
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  const {
    singleText,
    setSingleText,
    batchText,
    setBatchText,
    singleQR,
    batchQRs,
    handleSingleGenerate,
    handleBatchGenerate,
    downloadSingleQR,
    downloadBatchQRs
  } = useQRCode()

  const { theme } = useTheme()

  return (
    <>
      <Box minH="100vh" py={10} bg={theme.bgColor}>
        <Container maxW={{ base: "container.sm", md: "container.lg" }}>
          <VStack spacing={8}>
            <Heading as="h1" size={{ base: "lg", md: "xl" }} textAlign="center" color={theme.textColor}>
              Generador de Códigos QR
            </Heading>

            {/* Generación Individual */}
            <Box w="full" bg={theme.cardBgColor} p={6} borderRadius="lg" boxShadow="md" borderColor={theme.borderColor} borderWidth="1px">
              <VStack spacing={4}>
                <Heading as="h2" size={{ base: "sm", md: "md" }}>
                  Generar QR Individual
                </Heading>
                <VStack w="full" align="start" spacing={2}>
                  <Input
                    placeholder="Ingrese el texto para el código QR"
                    value={singleText}
                    onChange={(e) => setSingleText(e.target.value)}
                  />
                  <Text fontSize="sm" color={theme.textColor}>
                    Caracteres: {singleText.length} {singleText.length > 500 && "(Se aplicará compresión)"}
                  </Text>
                </VStack>
                <Button
                  colorScheme="blue"
                  onClick={handleSingleGenerate}
                  isDisabled={!singleText.trim()}
                >
                  Generar QR
                </Button>

                <AnimatePresence>
                  {singleQR && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <VStack spacing={3}>
                        <QRCodeSVG
                          id="single-qr"
                          value={singleQR}
                          size={calculateQRSize(singleText.length)}
                          level="H"
                        />
                        <Text fontSize="sm" color={theme.textColor}>
                          {singleQR}
                        </Text>
                        <Button
                          leftIcon={<DownloadIcon />}
                          onClick={downloadSingleQR}
                          colorScheme="green"
                          size="sm"
                        >
                          Descargar QR
                        </Button>
                      </VStack>
                    </motion.div>
                  )}
                </AnimatePresence>
              </VStack>
            </Box>

            {/* Generación por Lotes */}
            <Box w="full" bg={theme.cardBgColor} p={6} borderRadius="lg" boxShadow="md" borderColor={theme.borderColor} borderWidth="1px">
              <VStack spacing={4}>
                <Heading as="h2" size={{ base: "sm", md: "md" }}>
                  Generar QRs por Lotes
                </Heading>
                <Textarea
                  placeholder="Ingrese cada texto en una línea diferente"
                  value={batchText}
                  onChange={(e) => setBatchText(e.target.value)}
                  rows={5}
                />
                <Button
                  colorScheme="blue"
                  onClick={handleBatchGenerate}
                  isDisabled={!batchText.trim()}
                >
                  Generar QRs
                </Button>

                <AnimatePresence>
                  {batchQRs.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      style={{ width: '100%' }}
                    >
                      <VStack spacing={4}>
                        <SimpleGrid
                          columns={{ base: 1, sm: 2, md: 3 }}
                          spacing={4}
                          w="full"
                        >
                          {batchQRs.map((text, index) => (
                            <VStack key={index} spacing={2}>
                              <QRCodeSVG
                                id={`batch-qr-${index}`}
                                value={text}
                                size={150}
                                level="H"
                              />
                              <Text
                                fontSize="sm"
                                color="gray.600"
                                noOfLines={2}
                                textAlign="center"
                              >
                                {text}
                              </Text>
                            </VStack>
                          ))}
                        </SimpleGrid>
                        <Button
                          leftIcon={<DownloadIcon />}
                          onClick={downloadBatchQRs}
                          colorScheme="green"
                          size="sm"
                        >
                          Descargar ZIP con QRs
                        </Button>
                      </VStack>
                    </motion.div>
                  )}
                </AnimatePresence>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>
      <ThemeToggle />
    </>
  )
}

export default App
