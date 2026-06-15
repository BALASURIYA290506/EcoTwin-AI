import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EcoCoachWidget from '../components/chat/EcoCoachWidget'

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

describe('EcoCoachWidget', () => {
  it('renders chat widget button', () => {
    render(<EcoCoachWidget score={50} level={2} stage="Eco Seed" />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('🌱')
  })

  it('opens chat window when button clicked', () => {
    render(<EcoCoachWidget score={50} level={2} stage="Eco Seed" />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(screen.getByText('EcoCoach 🌱')).toBeInTheDocument()
    expect(screen.getByText('AI Sustainability Mentor')).toBeInTheDocument()
  })

  it('closes chat window when close button clicked', () => {
    render(<EcoCoachWidget score={50} level={2} stage="Eco Seed" />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    const closeButton = screen.getByText('✕')
    fireEvent.click(closeButton)
    
    expect(screen.queryByText('EcoCoach 🌱')).not.toBeInTheDocument()
  })

  it('displays initial greeting with user score', () => {
    render(<EcoCoachWidget score={75} level={3} stage="Growing Sprout" />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(screen.getByText(/Current EcoTwin Score: 75/)).toBeInTheDocument()
  })

  it('shows online status indicator', () => {
    render(<EcoCoachWidget score={50} level={2} stage="Eco Seed" />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(screen.getByText('Online')).toBeInTheDocument()
  })
})
