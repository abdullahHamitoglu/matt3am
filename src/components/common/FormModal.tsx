'use client'

import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react'

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSubmit?: () => void
  isLoading?: boolean
  submitLabel?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
}

export const FormModal = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  isLoading = false,
  submitLabel = 'Save',
  size = 'lg',
}: FormModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          {onSubmit && (
            <Button color="primary" onPress={onSubmit} type="submit" isLoading={isLoading}>
              {submitLabel}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
