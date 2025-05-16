import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import pako from 'pako'

export const useQRCode = () => {
  const [singleText, setSingleText] = useState('')
  const [batchText, setBatchText] = useState('')
  const [singleQR, setSingleQR] = useState('')
  const [batchQRs, setBatchQRs] = useState([])
  const toast = useToast()

  const compressText = (text) => {
    const compressed = pako.deflate(text, { to: 'string' })
    return btoa(compressed)
  }

  const calculateQRSize = (textLength) => {
    if (textLength <= 100) return 200
    if (textLength <= 500) return 300
    return 400
  }

  const handleSingleGenerate = () => {
    if (!singleText.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingrese un texto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const text = singleText.trim()
    const compressedText = text.length > 500 ? compressText(text) : text
    setSingleQR(compressedText)
    toast({
      title: 'Éxito',
      description: 'Código QR generado exitosamente',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleBatchGenerate = () => {
    const texts = batchText
      .split('\n')
      .map(text => text.trim())
      .filter(text => text)

    if (!texts.length) {
      toast({
        title: 'Error',
        description: 'Por favor ingrese al menos un texto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    setBatchQRs(texts)
  }

  const downloadSingleQR = () => {
    const svg = document.getElementById('single-qr')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    const svgData = new XMLSerializer().serializeToString(svg)
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        saveAs(blob, `qr-${singleText.substring(0, 30)}.png`)
      })
    }
  }

  const downloadBatchQRs = async () => {
    const zip = new JSZip()
    const promises = batchQRs.map((text, index) => {
      return new Promise((resolve) => {
        const svg = document.getElementById(`batch-qr-${index}`)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        const svgData = new XMLSerializer().serializeToString(svg)
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData)

        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          canvas.toBlob((blob) => {
            resolve({ blob, text })
          })
        }
      })
    })

    const qrBlobs = await Promise.all(promises)
    qrBlobs.forEach(({ blob, text }, index) => {
      zip.file(`qr-${index + 1}-${text.substring(0, 30)}.png`, blob)
    })

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    saveAs(zipBlob, 'qrcodes.zip')
  }

  return {
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
  }
}