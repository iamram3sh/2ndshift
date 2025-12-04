'use client'

import { Button } from './Button'
import { ArrowRight, Download, CheckCircle, X } from 'lucide-react'

/**
 * Button Showcase Component
 * Displays all button variants and sizes for reference
 */
export function ButtonShowcase() {
  return (
    <div className="p-8 space-y-12 bg-white">
      <div>
        <h2 className="text-2xl font-bold text-[#111] mb-6">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
            Primary Button
          </Button>
          <Button variant="secondary" icon={<CheckCircle className="w-4 h-4" />}>
            Secondary Button
          </Button>
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Outline Button
          </Button>
          <Button variant="ghost">
            Ghost Button
          </Button>
          <Button variant="link">
            Link Button
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#111] mb-6">Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="md">
            Medium
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#111] mb-6">Icon Positions</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />} iconPosition="left">
            Icon Left
          </Button>
          <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
            Icon Right
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#111] mb-6">States</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">
            Normal
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#111] mb-6">Real Examples (Homepage Style)</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
            I want to work
          </Button>
          <Button variant="outline" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
            I want to hire
          </Button>
          <Button variant="secondary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
            Get Started Free
          </Button>
          <Button variant="link" icon={<ArrowRight className="w-4 h-4" />}>
            View All Experts
          </Button>
        </div>
      </div>
    </div>
  )
}
