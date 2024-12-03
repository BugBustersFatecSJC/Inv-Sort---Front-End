import { useState, useEffect } from 'react'
import api from "../../services/api"
import MainPage from '../MainPage/MainPage'
import ProductCategory from '../../components/ProductCategory/ProductCategory'
import Category from '../../components/Category/Category'
import Loading from '../../components/Loading/Loading'
import SearchBar from '../../components/SearchBarAlt/SearchBarAlt'
import FilterButton from '../../components/FilterButton/FilterButton'
import { motion } from 'framer-motion'

function MainPageRender() {
  /**
   * Renderização do componente de loading
   */
  const [loading, setLoading] = useState(true)

  /**
   * Funcionalidade para pegar todas as categorias para renderizar o componente
   * de cada categoria, setCategories gera uma lista com as
   * categorias, nas quais podemos iterar sobre
   */
  const [categories, setCategories] = useState([])

  const fetchCategories = async () => {
    try {
      await api.get('/category')
      .then(response => setCategories(response.data))
      fetchProducts()
    } catch(err) {
      console.log(err)
    }
  }

  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    try {
      await api.get('/products')
      .then(response => setProducts(response.data))
    } catch(err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchCategories()
  }, [])

  /**
   * Função para dinamicamente adicionar a nova categoria após ela ser criada
   */
  const addCategory = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory])
  }

  const [lastAddedId, setLastAddedId] = useState(null)

  /**
   * Função para dinamicamente adicionar o novo produto após ele ser criado
   */
  const addProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct])
  }

  /**
   * Função para remover dinamicamente o produto
   */
  const removeProduct = (productId) => {
     setProducts((prevProducts) => prevProducts.filter(product => product.product_id !== productId))
  }

  /**
   * Função para editar dinamicamente o produto
   */
  const updateProduct = (productId, updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.product_id === productId ? { ...product, ...updatedProduct } : product
      )
    )
  }

  /**
   * Função para dinamicamente atualizar a categoria
   */
  const updateCategory = (categoryId, newCategoryName, newCategoryImage) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.category_id === categoryId
          ? { ...category, category_name: newCategoryName, category_image: newCategoryImage }
          : category
      )
    )
  }

  /**
   * Função para remover a categoria
   */
  const removeCategory = (categoryId) => {
    setCategories((prevCategories) => prevCategories.filter(
      category => category.category_id !== categoryId 
     ))
    }

  /**
   * Barra de pesquisa
   */
  const [searchQuery, setSearchQuery] = useState('')

  /**
   * Filtra as categorias
   */
  const [filter, setFilter] = useState('alphabetical')
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

  /**
   * Paginação
   */

  const categoriesPerPage = 11
  const [currentPage, setCurrentPage] = useState(1)

  const indexOfLastCategory = currentPage * categoriesPerPage
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory)

  const totalPages = Math.ceil(categories.length / categoriesPerPage)

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  const sortedAndFilteredCategories = sortCategories(
    currentCategories.filter((category) =>
      category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )
  
  return (<div className='flex '>
    <MainPage title="Categorias de Produtos">
    <div className="flex justify-between items-center mb-4 tools-container">
          <SearchBar onSearch={setSearchQuery} />
          <FilterButton onFilterChange={handleFilterChange} />
    </div>

      {loading ? (
        <Loading />

      ) : (<> 
              
        <div className="flex justify-between gap-4 grid mt-6 grid-cols-4 category-container-grid">
        
        <Category onCategoryAdded={(newCategory) => {
                addCategory(newCategory)
                setLastAddedId(newCategory.category_id)
              }} />
          {sortedAndFilteredCategories.map((category) => {
            const categoryProducts = products.filter(
              (product) => product.category_id === category.category_id
            );
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

                  key={category.category_id}
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
            );
          })}
        </div>

        <div className="flex justify-center items-center space-x-4 mt-4">
              <button onClick={goToPreviousPage} disabled={currentPage === 1} className="shadow-none w-[2rem]">
                <img src="/img/pointer-2.svg" alt="Previous" />
              </button>
              <span>Página {currentPage} de {totalPages}</span>
              <button onClick={goToNextPage} disabled={currentPage === totalPages} className="shadow-none w-[2rem]">
                <img src="/img/pointer-1.svg" alt="Next" />
              </button>
        </div>
        </>
      )}
      
    </MainPage>
    </div>
  );  
}
  
  export default MainPageRender