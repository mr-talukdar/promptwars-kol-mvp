import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HiddenPatternCard from '@/components/ui/HiddenPatternCard';
import RecommendationCard from '@/components/ui/RecommendationCard';
import StressDNACard from '@/components/ui/StressDNACard';

describe('UI Cards', () => {
  describe('HiddenPatternCard', () => {
    it('should render pattern text when provided', () => {
      render(<HiddenPatternCard pattern="You tend to study late at night." />);
      expect(screen.getByText(/"You tend to study late at night."/i)).toBeInTheDocument();
    });

    it('should return null when pattern is not provided', () => {
      const { container } = render(<HiddenPatternCard pattern={null} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('RecommendationCard', () => {
    it('should render recommendation when provided', () => {
      render(<RecommendationCard recommendation="Try studying in the mornings." />);
      expect(screen.getByText(/Try studying in the mornings./i)).toBeInTheDocument();
    });

    it('should return null when recommendation is not provided', () => {
      const { container } = render(<RecommendationCard recommendation={null} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('StressDNACard', () => {
    it('should render stress drivers list', () => {
      const mockDrivers = [
        { driver: 'Exam Pressure', percentage: 60 },
        { driver: 'Mock Test Anxiety', percentage: 40 },
      ];
      render(<StressDNACard stressDNA={mockDrivers} />);
      expect(screen.getByText('Stress DNA')).toBeInTheDocument();
      expect(screen.getByText('Exam Pressure')).toBeInTheDocument();
      expect(screen.getByText('Mock Test Anxiety')).toBeInTheDocument();
    });

    it('should return null when stressDNA array is empty', () => {
      const { container } = render(<StressDNACard stressDNA={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });
});
