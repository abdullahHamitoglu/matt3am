/**
 * Product Recipes Service
 */

import { BaseService } from './base.service'
import { COLLECTION_ENDPOINTS } from '@/lib/api/endpoints'
import type { ProductRecipe } from '@/payload-types'

export const productRecipesService = new BaseService<ProductRecipe>(
  COLLECTION_ENDPOINTS.PRODUCT_RECIPES,
)
