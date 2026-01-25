'use client'

/**
 * Example Component: Restaurant Dashboard
 * Demonstrates complete API integration with React Query hooks
 */

import { useState } from 'react'
import {
  useRestaurants,
  useRestaurantDetail,
  useCreateRestaurant,
  useUpdateRestaurant,
  useDeleteRestaurant,
  useCurrentUser,
} from '@/hooks'

export function RestaurantDashboard() {
  const [selectedId, setSelectedId] = useState<string>()
  const { data: currentUser } = useCurrentUser()

  // List all restaurants with pagination
  const {
    data: restaurants,
    isLoading: isLoadingList,
    error: listError,
  } = useRestaurants({
    page: 1,
    limit: 10,
    sort: '-createdAt',
  })

  // Get detailed restaurant info
  const { data: restaurant, isLoading: isLoadingDetail } = useRestaurantDetail(
    selectedId || '',
    undefined,
    { enabled: !!selectedId },
  )

  // Mutations
  const createRestaurant = useCreateRestaurant()
  const updateRestaurant = useUpdateRestaurant(selectedId || '')
  const deleteRestaurant = useDeleteRestaurant(selectedId || '')

  const handleCreate = async () => {
    try {
      const newRestaurant = await createRestaurant.mutateAsync({
        name: 'New Restaurant',
        address: '123 Main Street',
        city: 'New York',
        phone: '555-0100',
        email: 'info@restaurant.com',
      })
      setSelectedId(newRestaurant.id)
    } catch (error) {
      console.error('Create failed:', error)
    }
  }

  const handleUpdate = async () => {
    try {
      await updateRestaurant.mutateAsync({
        name: 'Updated Restaurant Name',
      })
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this restaurant?')) return

    try {
      await deleteRestaurant.mutateAsync()
      setSelectedId(undefined)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  if (!currentUser) {
    return <div>Please log in to view restaurants</div>
  }

  if (isLoadingList) {
    return <div>Loading restaurants...</div>
  }

  if (listError) {
    return <div>Error: {listError.message}</div>
  }

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      {/* Restaurant List */}
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={handleCreate} disabled={createRestaurant.isPending}>
            {createRestaurant.isPending ? 'Creating...' : 'Create Restaurant'}
          </button>
        </div>

        <h2>Restaurants ({restaurants?.totalDocs || 0})</h2>
        <ul>
          {restaurants?.docs.map((r) => (
            <li
              key={r.id}
              onClick={() => setSelectedId(r.id)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedId === r.id ? '#e0e0e0' : 'transparent',
                padding: '0.5rem',
              }}
            >
              {r.name}
            </li>
          ))}
        </ul>

        {restaurants && restaurants.totalPages > 1 && (
          <div>
            Page {restaurants.page} of {restaurants.totalPages}
          </div>
        )}
      </div>

      {/* Restaurant Detail */}
      <div style={{ flex: 1 }}>
        {selectedId && (
          <>
            <h2>Restaurant Details</h2>
            {isLoadingDetail ? (
              <div>Loading details...</div>
            ) : restaurant ? (
              <div>
                <p>
                  <strong>Name:</strong> {restaurant.name}
                </p>
                <p>
                  <strong>Address:</strong> {restaurant.address}
                </p>
                <p>
                  <strong>Phone:</strong> {restaurant.phone}
                </p>
                <p>
                  <strong>Email:</strong> {restaurant.email}
                </p>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleUpdate} disabled={updateRestaurant.isPending}>
                    {updateRestaurant.isPending ? 'Updating...' : 'Update Name'}
                  </button>
                  <button onClick={handleDelete} disabled={deleteRestaurant.isPending}>
                    {deleteRestaurant.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ) : (
              <div>Restaurant not found</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
