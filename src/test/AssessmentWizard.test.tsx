import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AssessmentWizard from '../components/AssessmentWizard'

describe('AssessmentWizard', () => {
  const mockOnComplete = vi.fn()
  const mockOnBackToHome = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders first question', () => {
    render(<AssessmentWizard onComplete={mockOnComplete} onBackToHome={mockOnBackToHome} />)
    expect(screen.getByText('How do you travel most days?')).toBeInTheDocument()
    expect(screen.getByText('Question 1 of 5')).toBeInTheDocument()
  })

  it('displays all options for current question', () => {
    render(<AssessmentWizard onComplete={mockOnComplete} onBackToHome={mockOnBackToHome} />)
    expect(screen.getByText(/Drive alone/)).toBeInTheDocument()
    expect(screen.getByText(/electric or hybrid/)).toBeInTheDocument()
    expect(screen.getByText(/Carpool/)).toBeInTheDocument()
    expect(screen.getByText(/Public transportation/)).toBeInTheDocument()
    expect(screen.getByText(/Walk, bicycle/)).toBeInTheDocument()
  })

  it('selects an option when clicked', () => {
    render(<AssessmentWizard onComplete={mockOnComplete} onBackToHome={mockOnBackToHome} />)
    const option = screen.getByText(/Drive alone/)
    const button = option.closest('button')
    fireEvent.click(button!)
    expect(button).toHaveClass('border-brand-primary')
  })

  it('enables continue button after selection', () => {
    render(<AssessmentWizard onComplete={mockOnComplete} onBackToHome={mockOnBackToHome} />)
    const continueButton = screen.getByText('Continue')
    expect(continueButton).toBeDisabled()
    
    const option = screen.getByText(/Drive alone/)
    fireEvent.click(option)
    expect(continueButton).not.toBeDisabled()
  })

  it('navigates to next question on continue', () => {
    render(<AssessmentWizard onComplete={mockOnComplete} onBackToHome={mockOnBackToHome} />)
    const option = screen.getByText(/Drive alone/)
    fireEvent.click(option)
    
    const continueButton = screen.getByText('Continue')
    fireEvent.click(continueButton)
    
    expect(screen.getByText('Question 2 of 5')).toBeInTheDocument()
    expect(screen.getByText(/electricity consumption/)).toBeInTheDocument()
  })

  it('calls onComplete when all questions answered', () => {
    render(<AssessmentWizard onComplete={mockOnComplete} onBackToHome={mockOnBackToHome} />)
    
    const patterns = [/Drive alone/, /Not conscious/, /Meat with/, /Rarely/, /Very frequently/]
    
    patterns.forEach(pattern => {
      const option = screen.getByText(pattern)
      fireEvent.click(option)
      const continueBtn = screen.getByText(/Continue|Calculate Footprint/)
      fireEvent.click(continueBtn)
    })
    
    expect(mockOnComplete).toHaveBeenCalled()
  })

  it('calls onBackToHome when back button clicked on first question', () => {
    render(<AssessmentWizard onComplete={mockOnComplete} onBackToHome={mockOnBackToHome} />)
    const backButton = screen.getByText('Home')
    fireEvent.click(backButton)
    expect(mockOnBackToHome).toHaveBeenCalled()
  })

  it('navigates to previous question when back clicked', () => {
    render(<AssessmentWizard onComplete={mockOnComplete} onBackToHome={mockOnBackToHome} />)
    
    // Go to second question
    const option = screen.getByText('Drive alone in a gas car')
    fireEvent.click(option)
    const continueButton = screen.getByText('Continue')
    fireEvent.click(continueButton)
    
    // Go back
    const backButton = screen.getByText('Back')
    fireEvent.click(backButton)
    
    expect(screen.getByText('Question 1 of 5')).toBeInTheDocument()
  })

  it('updates progress bar', () => {
    render(<AssessmentWizard onComplete={mockOnComplete} onBackToHome={mockOnBackToHome} />)
    const progressBar = document.querySelector('.bg-brand-primary.rounded-full')
    expect(progressBar).toBeInTheDocument()
  })

  it('displays category icons', () => {
    render(<AssessmentWizard onComplete={mockOnComplete} onBackToHome={mockOnBackToHome} />)
    expect(screen.getByText('transport')).toBeInTheDocument()
  })
})
