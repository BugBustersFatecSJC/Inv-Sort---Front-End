import { useState, useEffect } from 'react'
import api from "../../services/api"
import MainPage from '../MainPage/MainPage'
import ProductCategory from '../../components/ProductCategory/ProductCategory'
import Category from '../../components/Category/Category'
import Loading from '../../components/Loading/Loading'


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

  /**
   * Função para dinamicamente adicionar o novo produto após ele ser criado
   */
  const addProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct])
  }

  /**
   * Função para remover o produto
   */
  const removeProduct = (productId) => {
    setProducts((prevProducts) => prevProducts.filter(product => product.product_id !== productId))
  }

  /**
   * Função para dinamicamente atualizar a categoria
   */
  const updateCategory = (categoryId, newCategoryName) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.category_id === categoryId ? { ...category, category_name: newCategoryName } : category
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
   * Funcionalidade para checar se há algum usuário no banco de dados, se sim,
   * exibirá a tela de login, senão o usuário será redirecionado para a tela
   * de primeiro cadastro
   */
  // const [adminExists, setAdminExists] = useState({});
  // useEffect(() => {
  //   api
  //     .get("/users")
  //     .then(response => setAdminExists(response.data))
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }, [])
    return (
        <MainPage title="Produtos">
            {loading ? (
            <Loading />
            ) :
            categories.map((category) => {
            const categoryProducts = products.filter(product => product.category_id === category.category_id);
            return (
                <ProductCategory key={category.category_id} categoryKey={category.category_id} products={categoryProducts} onProductAdded={addProduct} onProductDeleted={removeProduct} categoryName={category.category_name} onCategoryUpdated={updateCategory} onCategoryDeleted={removeCategory} />
            )
            })}
            <Category onCategoryAdded={addCategory} />
        </MainPage> 
    )
  }
  
  export default MainPageRender