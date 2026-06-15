import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders landing page initially', () => {
    render(<App />)
    expect(screen.getByText('Meet Your Future Sustainable Self.')).toBeInTheDocument()
  })

  it('starts assessment when button clicked', () => {
    render(<App />)
    const startButton = screen.getAllByText('Start Assessment')[0]
    fireEvent.click(startButton)
    expect(screen.getByText('Question 1 of 5')).toBeInTheDocument()
  })

  it('navigates through assessment wizard', () => {
    render(<App />)
    const startButton = screen.getAllByText('Start Assessment')[0]
    fireEvent.click(startButton)
    
    // Select first option
    const firstOption = screen.getByText(/Drive alone/)
    fireEvent.click(firstOption)
    
    // Click continue
    const continueButton = screen.getByText('Continue')
    fireEvent.click(continueButton)
    
    expect(screen.getByText('Question 2 of 5')).toBeInTheDocument()
  })

  it('shows loading screen after assessment completion', () => {
    render(<App />)
    const startButton = screen.getAllByText('Start Assessment')[0]
    fireEvent.click(startButton)
    
    // Complete all questions
    const patterns = [/Drive alone/, /Not conscious/, /Meat with/, /Rarely/, /Very frequently/]
    
    patterns.forEach(pattern => {
      const option = screen.getByText(pattern)
      fireEvent.click(option)
      const continueBtn = screen.getByText(/Continue|Calculate Footprint/)
      if (!(continueBtn as HTMLButtonElement).disabled) fireEvent.click(continueBtn)
    })
    
    // Should show loading
    expect(screen.getByText('Eco Calculations')).toBeInTheDocument()
  })

  it('displays dashboard after loading', async () => {
    render(<App />)
    const startButton = screen.getAllByText('Start Assessment')[0]
    fireEvent.click(startButton)
    
    // Complete assessment with regex patterns
    const patterns = [/Drive alone/, /Not conscious/, /Meat with/, /Rarely/, /Very frequently/]
    
    for (const pattern of patterns) {
      const option = screen.getByText(pattern)
      fireEvent.click(option)
      const continueBtn = screen.getByText(/Continue|Calculate Footprint/)
      if (!(continueBtn as HTMLButtonElement).disabled) fireEvent.click(continueBtn)
    }
    
    // Wait for loading to complete
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    expect(screen.getByText(/Good Morning|Good Afternoon|Good Evening/)).toBeInTheDocument()
  })

  it('resets to landing page', () => {
    render(<App />)
    const startButton = screen.getAllByText('Start Assessment')[0]
    fireEvent.click(startButton)
    
    const backButton = screen.getByText('Home')
    fireEvent.click(backButton)
    
    expect(screen.getByText('Meet Your Future Sustainable Self.')).toBeInTheDocument()
  })
})
