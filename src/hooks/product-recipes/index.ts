'use client'

import { createCollectionHooks } from '@/hooks/useCollectionHooks'
import { productRecipesService } from '@/services/product-recipes.service'

export const {
  useCollection: useProductRecipes,
  useDetail: useProductRecipeDetail,
  useCreate: useCreateProductRecipe,
  useUpdate: useUpdateProductRecipe,
  useDelete: useDeleteProductRecipe,
  queryKeys: productRecipeQueryKeys,
} = createCollectionHooks(productRecipesService, { collectionKey: 'product-recipes' })
