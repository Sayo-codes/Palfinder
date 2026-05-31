'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface ScrollRevealProps extends Omit<HTMLMotionProps<'div'>, 'className'> {
  children: React.ReactNode
  variant?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleUp'
  duration?: number
  delay?: number
  threshold?: number
  once?: boolean
  className?: string
  distance?: number
  isChild?: boolean
}

export default function ScrollReveal({
  children,
  variant = 'slideUp',
  duration = 0.8,
  delay = 0,
  threshold = 0.1,
  once = true,
  className = '',
  distance = 30,
  isChild = false,
  ...props
}: ScrollRevealProps) {
  const getVariants = () => {
    const directionOffset = distance

    const baseTransition = {
      duration,
      ease: [0.16, 1, 0.3, 1], // easeOutQuint
    }

    switch (variant) {
      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: isChild ? baseTransition : { ...baseTransition, delay },
          },
        }
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: directionOffset },
          visible: {
            opacity: 1,
            y: 0,
            transition: isChild ? baseTransition : { ...baseTransition, delay },
          },
        }
      case 'slideDown':
        return {
          hidden: { opacity: 0, y: -directionOffset },
          visible: {
            opacity: 1,
            y: 0,
            transition: isChild ? baseTransition : { ...baseTransition, delay },
          },
        }
      case 'slideLeft':
        return {
          hidden: { opacity: 0, x: directionOffset },
          visible: {
            opacity: 1,
            x: 0,
            transition: isChild ? baseTransition : { ...baseTransition, delay },
          },
        }
      case 'slideRight':
        return {
          hidden: { opacity: 0, x: -directionOffset },
          visible: {
            opacity: 1,
            x: 0,
            transition: isChild ? baseTransition : { ...baseTransition, delay },
          },
        }
      case 'scaleUp':
        return {
          hidden: { opacity: 0, scale: 0.96 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: isChild ? baseTransition : { ...baseTransition, delay },
          },
        }
      default:
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: isChild ? baseTransition : { ...baseTransition, delay },
          },
        }
    }
  }

  const motionProps: HTMLMotionProps<'div'> = {
    variants: getVariants(),
    className,
    ...props,
  }

  // If it's a child in a staggered ScrollContainer, let the parent control initial/animate states
  if (!isChild) {
    motionProps.initial = "hidden"
    motionProps.whileInView = "visible"
    motionProps.viewport = { once, amount: threshold }
  }

  return (
    <motion.div {...motionProps}>
      {children}
    </motion.div>
  )
}

interface ScrollContainerProps extends Omit<HTMLMotionProps<'div'>, 'className'> {
  children: React.ReactNode
  staggerDelay?: number
  delay?: number
  once?: boolean
  threshold?: number
  className?: string
}

export function ScrollContainer({
  children,
  staggerDelay = 0.1,
  delay = 0,
  once = true,
  threshold = 0.05,
  className = '',
  ...props
}: ScrollContainerProps) {
  const variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
