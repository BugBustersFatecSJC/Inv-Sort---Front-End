import { useState, useEffect } from 'react'
import api from "../../services/api"
import MainPage from '../MainPage/MainPage'
import ProductCategory from '../../components/ProductCategory/ProductCategory'
import Category from '../../components/Category/Category'
import Loading from '../../components/Loading/Loading'
import SearchBar from '../../components/SearchBarAlt/SearchBarAlt'
import FilterButton from '../../components/FilterButton/FilterButton'
import { motion } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'; // Icones da Filtragem

function MainPageRender() {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('alphabetical')
  const [currentPage, setCurrentPage] = useState(1)
  const categoriesPerPage = 11
  const [lastAddedId, setLastAddedId] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/category')
      setCategories(response.data)
      fetchProducts()
    } catch (err) {
      console.log(err)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products')
      setProducts(response.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const addCategory = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory])
  }

  const removeCategory = (categoryId) => {
    setCategories((prevCategories) => prevCategories.filter(category => category.category_id !== categoryId))
  }

  const updateCategory = (categoryId, newCategoryName, newCategoryImage) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.category_id === categoryId
          ? { ...category, category_name: newCategoryName, category_image: newCategoryImage }
          : category
      )
    )
  }

  const addProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct])
  }

  const removeProduct = (productId) => {
    setProducts((prevProducts) => prevProducts.filter(product => product.product_id !== productId))
  }

  const updateProduct = (productId, updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.product_id === productId ? { ...product, ...updatedProduct } : product
      )
    )
  }

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter)
  }

  const sortCategories = (categories) => {
    const sortedCategories = [...categories]
    switch (filter) {
      case 'alphabetical':
        return sortedCategories.sort((a, b) =>
          a.category_name.localeCompare(b.category_name)
        )
      case 'reverse-alphabetical':
        return sortedCategories.sort((a, b) =>
          b.category_name.localeCompare(a.category_name)
        )
      case 'newest':
        return sortedCategories.sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        )
      case 'oldest':
        return sortedCategories.sort((a, b) =>
          new Date(a.created_at) - new Date(b.created_at)
        )
      default:
        return sortedCategories
    }
  }

  const filterAndSortCategories = () => {
    return sortCategories(
      categories.filter(category =>
        category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }

  const filteredCategories = filterAndSortCategories()
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage)

  const currentItems = filteredCategories.slice(
    (currentPage - 1) * categoriesPerPage,
    currentPage * categoriesPerPage
  )

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const paginationRange = () => {
    let pages = []
    if (totalPages <= 5) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, '...', totalPages]
      } else if (currentPage >= totalPages - 2) {
        pages = [1, '...', totalPages - 2, totalPages - 1, totalPages]
      } else {
        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
      }
    }
    return pages
  }

  return (
    <div className='flex'>
      <MainPage title="Categorias de Produtos">
        <div className="flex justify-between items-center mb-4 tools-container">
          <SearchBar onSearch={setSearchQuery} />
          <FilterButton onFilterChange={handleFilterChange} />
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex justify-between gap-4 grid mt-6 grid-cols-4 category-container-grid">
              <Category
                onCategoryAdded={(newCategory) => {
                  addCategory(newCategory)
                  setLastAddedId(newCategory.category_id)
                }}
              />
              {currentItems.map((category) => {
                const categoryProducts = products.filter(
                  (product) => product.category_id === category.category_id
                )
                return (
                  <motion.div
                    key={category.category_id}
                    initial={lastAddedId === category.category_id ? { scale: 0.8, opacity: 0 } : {}}
                    animate={lastAddedId === category.category_id ? { scale: 1, opacity: 1 } : {}}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                      duration: 0.5,
                    }}
                  >
                    <ProductCategory
                      categoryKey={category.category_id}
                      products={categoryProducts}
                      onProductAdded={addProduct}
                      onProductDeleted={removeProduct}
                      categoryName={category.category_name}
                      onCategoryUpdated={updateCategory}
                      onCategoryDeleted={removeCategory}
                      onProductUpdated={updateProduct}
                      categoryImage={category.category_image}
                      category={category}
                    />
                  </motion.div>
                )
              })}
            </div>

            <div className="pagination flex justify-center mt-4">
              <button
                className="bg-[#6B3710] text-[#FFC376] font-medium px-4 py-2 rounded-lg mr-2 hover:bg-[#4e2d19] disabled:bg-[#4c2a17] disabled:text-[#ccc] disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="h-5 w-5 text-[#FFC376]" />
              </button>

              {paginationRange().map((page, index) =>
                page === '...' ? (
                  <span key={index} className="px-4 py-2">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page ? 'bg-[#4e2d19] text-[#FFC376]' : 'text-[#6B3710] hover:bg-[#C17B46]'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                className="bg-[#6B3710] text-[#FFC376] font-medium px-4 py-2 rounded-lg ml-2 hover:bg-[#4e2d19] disabled:bg-[#4c2a17] disabled:text-[#ccc] disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon className="h-5 w-5 text-[#FFC376]" />
              </button>
            </div>
          </>
        )}
      </MainPage>
    </div>
  )
}

export default MainPageRender
