'use client'
import { Button, Image } from '@heroui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslations } from 'next-intl'
import type { Currency } from '@/payload-types'
import { formatCurrency } from '@/lib/currency'

type Props = {
  name?: string
  description?: string
  price?: number
  currency?: Currency | string
  image?: string
  discountPrice?: number
  onAddToCart?: (quantity: number) => void
}

const ProductCard = ({
  name = 'معكرونة مع الخضار',
  description = 'معكرونة - جبنة',
  price = 9.0,
  currency = 'SAR',
  image = 'https://placehold.co/197x144/png',
  discountPrice,
  onAddToCart,
}: Props) => {
  const t = useTranslations()
  const [count, setCount] = React.useState(0)

  const formattedPrice = React.useMemo(() => {
    if (typeof currency === 'string') {
      return `${price.toFixed(3)} ${currency}`
    }
    return formatCurrency(price, { currency })
  }, [price, currency])

  const formattedDiscountPrice = React.useMemo(() => {
    if (!discountPrice) return null
    if (typeof currency === 'string') {
      return `${discountPrice.toFixed(3)} ${currency}`
    }
    return formatCurrency(discountPrice, { currency })
  }, [discountPrice, currency])

  React.useEffect(() => {
    if (count > 0 && onAddToCart) {
      onAddToCart(count)
    }
  }, [count, onAddToCart])

  return (
    <div className="inline-flex flex-col justify-start items-start gap-2.5 bg-white dark:bg-gray-800 p-3 rounded-2xl outline-2 outline-primary-500 dark:outline-primary-400 outline-offset-[-2px] w-fit min-w-56 min-h-72 overflow-hidden">
      <div className="flex flex-col flex-1 justify-start items-start self-stretch gap-5 rounded-xl overflow-hidden">
        <Image
          width={197}
          height={144}
          isBlurred
          isZoomed
          className="flex-1 self-stretch w-full object-cover"
          src={image}
          alt={name}
        />
      </div>
      <div className="flex flex-col justify-start items-end self-stretch gap-2">
        <div className="justify-center self-stretch h-7 font-bold text-slate-950 dark:text-white text-base leading-7">
          {name}
        </div>
        <div className="justify-center self-stretch h-4 font-normal text-neutral-400 dark:text-neutral-500 text-xs leading-snug">
          {description}
        </div>
        <div className="flex items-center gap-2">
          {discountPrice && (
            <div className="font-normal text-neutral-400 dark:text-neutral-500 text-xs line-through">
              {formattedPrice}
            </div>
          )}
          <div className="font-bold text-primary-500 dark:text-primary-400 text-base leading-normal">
            {discountPrice ? formattedDiscountPrice : formattedPrice}
          </div>
        </div>
      </div>
      <div className="flex justify-stretch w-full">
        {count > 0 && (
          <Button
            isIconOnly
            className="bg-primary-50 dark:bg-primary-900 rounded-e-none"
            onPress={(e) => {
              setCount(count - 1)
            }}
          >
            {count > 1 ? (
              <Icon
                icon="mdi:minus-circle"
                className="text-primary-500 dark:text-primary-400"
                width="20"
                height="20"
              />
            ) : (
              <Icon
                icon="mdi:trash-can-outline"
                className="text-primary-500 dark:text-primary-400"
                width="20"
                height="20"
              />
            )}
          </Button>
        )}
        <Button
          endContent={
            count === 0 ? (
              <Icon
                icon="solar:cart-plus-linear"
                className="text-primary-500 dark:text-primary-400"
                width="20"
                height="20"
              />
            ) : null
          }
          className={`bg-primary-50 dark:bg-primary-900 dark:text-white text-medium leading-tight w-full ${count > 0 ? 'rounded-none' : ''} `}
          onPress={() => (count > 0 ? null : setCount(count + 1))}
        >
          {count > 0 ? count : t('addToCart')}
        </Button>
        {count > 0 && (
          <Button
            isIconOnly
            className="bg-primary-50 dark:bg-primary-900 rounded-s-none"
            onPress={() => setCount(count + 1)}
          >
            <Icon
              icon="mdi:plus-circle"
              className="text-primary-500 dark:text-primary-400"
              width="20"
              height="20"
            />
          </Button>
        )}
      </div>
    </div>
  )
}

export default ProductCard
