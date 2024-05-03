import React, { useState, useRef, useEffect } from 'react'

type CaptchaCharType = 'numbers' | 'letters' | 'alphanumeric'
type CaptchaCaseType = 'lower' | 'upper' | 'mixed'

const generateCaptchaText = ({
  length = 6,
  charType = 'alphanumeric',
  caseType = 'mixed',
}: {
  length?: number
  charType?: CaptchaCharType
  caseType?: CaptchaCaseType
} = {}) => {
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  if (charType === 'numbers') chars = '0123456789'
  if (charType === 'letters')
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (charType === 'alphanumeric')
    chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  if (caseType === 'lower') chars = chars.toLowerCase()
  if (caseType === 'upper') chars = chars.toUpperCase()

  let captcha = ''
  for (let i = 0; i < length; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return captcha
}

type Props = {
  captchaCode?: (text: string) => void
  reloadButton?: React.ReactNode
  configCaptcha?: {
    captchaLength?: number
    captchaCharsType?: CaptchaCharType
    captchaCaseType?: CaptchaCaseType
    captchaWidth?: number
    captchaHeight?: number
  }
}
const Captcha = ({
  captchaCode,
  configCaptcha: {
    captchaLength = 6,
    captchaWidth = 100,
    captchaHeight = 40,
    captchaCharsType = 'alphanumeric',
    captchaCaseType = 'mixed',
  } = {},
}: Props) => {
  const canvasRef = useRef(null)

  const loadCaptcha = () => {
    const canvas = canvasRef.current as any as HTMLCanvasElement

    const ctx = canvas.getContext('2d')

    if (!ctx) throw new Error('Canvas context is null')

    const captchaText = generateCaptchaText({
      length: captchaLength,
      caseType: captchaCaseType,
      charType: captchaCharsType,
    })

    console.log({
      captchaText,
    })

    if (captchaCode) captchaCode(captchaText)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw text on canvas
    ctx.font = '30px Arial'

    for (let i = 0; i < captchaText.length; i++) {
      const randomColor = '#' + ((Math.random() * 0xffffff) << 0).toString(16) // Random color for each character
      ctx.fillStyle = randomColor
      ctx.fillText(captchaText[i], 10 + i * 20, 30) // Adjust the x position for each character
    }

    // Draw random lines on canvas
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = '#' + ((Math.random() * 0xffffff) << 0).toString(16) // Random color
      ctx.beginPath()
      ctx.moveTo(Math.random() * captchaWidth, Math.random() * captchaHeight)
      ctx.lineTo(Math.random() * captchaWidth, Math.random() * captchaHeight)
      ctx.stroke()
    }
  }

  useEffect(() => {
    loadCaptcha()
  }, [])

  const reloadCaptcha = () => {
    loadCaptcha()
  }

  return (
    <React.Fragment>
      <canvas
        ref={canvasRef}
        width={captchaWidth}
        height={captchaHeight}
      ></canvas>
      <button type='button' onClick={reloadCaptcha}>
        Reload
      </button>
    </React.Fragment>
  )
}

export default Captcha
