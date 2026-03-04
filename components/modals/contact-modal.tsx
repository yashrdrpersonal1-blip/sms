"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sparkles } from "lucide-react"

interface ContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onOpenChange(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/50 bg-card sm:max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">
              Initialize Enterprise Onboarding
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Fill in your details and our team will reach out within 24 hours to
            schedule your personalized demo.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <p className="text-center text-lg font-semibold text-foreground">
              Request Submitted
            </p>
            <p className="text-center text-sm text-muted-foreground">
              We will get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="schoolName" className="text-sm font-medium text-foreground">
                School / Trust Name
              </Label>
              <Input
                id="schoolName"
                placeholder="e.g., Delhi Public School"
                required
                className="border-border/50 bg-secondary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="branches" className="text-sm font-medium text-foreground">
                Number of Branches
              </Label>
              <Input
                id="branches"
                placeholder={'e.g., 3 (Main + Pre-schools)'}
                required
                className="border-border/50 bg-secondary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="contactName" className="text-sm font-medium text-foreground">
                Contact Person Name
              </Label>
              <Input
                id="contactName"
                placeholder="Full name"
                required
                className="border-border/50 bg-secondary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="emailPhone" className="text-sm font-medium text-foreground">
                Official Email / Phone Number
              </Label>
              <Input
                id="emailPhone"
                placeholder="email@school.edu or +91 98765 43210"
                required
                className="border-border/50 bg-secondary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="designation" className="text-sm font-medium text-foreground">
                Designation
              </Label>
              <Select required>
                <SelectTrigger className="border-border/50 bg-secondary text-foreground">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="border-border/50 bg-card">
                  <SelectItem value="principal">Principal</SelectItem>
                  <SelectItem value="it-director">IT Director</SelectItem>
                  <SelectItem value="administrator">Administrator</SelectItem>
                  <SelectItem value="trust-member">Trust Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Request Enterprise Demo
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
