import { useEffect, useState } from 'react'
import './ProductCategory.module.css'
import styles from './ProductCategory.module.css'
import api from '../../services/api'
import Loading from '../Loading/Loading'
import Modal from '../Modal/Modal'
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy'
import { applyFilters } from '../FilterUtils/FilterUtils'
import ProductFilter from '../ProductFilter/ProductFilter'
import FlashMessage from '../../components/FlashMessage/FlashMessage'

function ProductCategory(props) {
  const { products, categoryKey, onProductAdded, onProductDeleted, onCategoryUpdated } = props;
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);
  /**
   * Criação da renderização do componente de loading
   */
  const [loading, setLoading] = useState(true)

  /**
   * Criação dos quadrados dos produtos no inventário
   */
    const [squares, setSquares] = useState([])

    const fetchProducts = async () => {
      try {
        const response = await api.get('/products')
        setSquares(Array(response.data.length).fill({}))
      } catch(err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    /**
     * Renderização da flash message
     */
    const [flash, setFlash] = useState(null)

    const showFlashMessage = (message, type) => {
      setFlash(null)
      setTimeout(() => {
          setFlash({ message, type })
      }, 0)
    }

    const flashSuccess = () => {
      showFlashMessage('Item adicionado com sucesso!','success');
    }

    const flashError = () => {
      showFlashMessage('Um erro aconteceu','error');
    };

    const flashInfo = () => {
      showFlashMessage('Item atualizado', 'info');
    }

    const flashDelete = () => {
      showFlashMessage('Item deletado', 'success');
    }
    
    /**
     * Retorna todas as unidades
     */
    const [units, setUnits] = useState([])

    const fetchUnits = async () => {
      try {
        await api
          .get('/unit')
          .then(response => setUnits(response.data))
      } catch(err) {
          console.log(err)
      }
    }
    
    /**
     * Retorna todos os fornecedores
    */
   
   const [suppliers, setSuppliers] = useState([])
   
   const fetchSuppliers = async () => {
     try {
       await api
       .get('/supplier')
       .then(response => setSuppliers(response.data))
      } catch(err) {
        console.log(err)
      }
    }

    /**
     * Hook de useEffect para ativar as funções quando o componente é renderizado
     */
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const unitResponse = await api.get('/unit');
          setUnits(unitResponse.data);
  
          const supplierResponse = await api.get('/supplier');
          setSuppliers(supplierResponse.data);
  
          setFilteredProducts(products);
        } catch (err) {
          console.log(err);
        }
        setLoading(false);
      };
  
      fetchData();
    }, [products]);

    const handleFilterChange = (filters) => {
      // Implementando a lógica de aplicação de filtro
      const filtered = products.filter(product => 
        Object.keys(filters).every(key => 
          !filters[key] || product[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
        )
      );
      setFilteredProducts(filtered);
    };


    /**
     * Abre e fecha o modal de produtos
     */
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    /**
     * Abre e fecha o modal de categorias
     */
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

    const openCategoryModal = () => setIsCategoryModalOpen(true)
    const closeCategoryModal = () => setIsCategoryModalOpen(false)

    /**
     * Registra o produto
     */
    const [productName, setProductName] = useState('')
    const [productDescription, setProductDescription] = useState(null)
    const [productUnitId, setProductUnitId] = useState('')
    const [productSupplierId, setProductSupplierId] = useState('')
    const [isPerishable, setIsPerishable] = useState(false)

    const handleSubmit = async(e) => {
      e.preventDefault()

      const ProductData = {
          product_name: productName,
          description: productDescription,
          category_id: props.categoryKey,
          supplier_id: productSupplierId,
          is_perishable: isPerishable,
          unit_id: productUnitId,
      }

      try {
          await api
          .post("/products", ProductData)
          .then(response => props.onProductAdded(response.data))          

          setProductName('')
          setProductDescription('')
          setProductUnitId('')
          setProductSupplierId('')
          setIsPerishable(false)
          closeModal()
          flashSuccess()
      } catch (err) {
          console.log(err)
          flashError()
      }
  }

  /**
   * Deleta o produto
   */
  const handleDelete = async (product_id) => {
    try {
      await api
        .delete(`/products/${product_id}`)
        .then((response) => {console.log(response)})
        props.onProductDeleted(product_id)
        flashDelete()
    } catch (err) {
      console.log(err)
      flashError()
    }
  }

  /**
   * Edição do produto
   */
  const [isProdEditModalOpen, setIsProdEditModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)

  const openProdEditModal = (product) => {
    setCurrentProduct(product)
    setProductName(product.product_name)
    setProductDescription(product.description)
    setProductUnitId(product.unit_id)
    setProductSupplierId(product.supplier_id)
    setIsPerishable(product.is_perishable)

    setIsProdEditModalOpen(true)
  }

  const closeProdEditModal = () => {
    setIsProdEditModalOpen(false)
    setCurrentProduct(null)
  }

  const handleProdUpdate = async (e) => {
    e.preventDefault()

    const updatedProductData = {
      product_name: productName,
      description: productDescription,
      category_id: props.categoryKey,
      supplier_id: productSupplierId,
      is_perishable: isPerishable,
      unit_id: productUnitId,
    }

    try {
      await api
        .put(`/products/${currentProduct.product_id}`, updatedProductData)
        .then(response => console.log(response))

        /******************************************************************************
         * ATEÇÃO                                                                     *
         * TODO: Aqui está ocorrendo um erro com o react tippy (que faz o tooltip)    *
         * e a atualização dinâmica do componente, o erro em questão é que            *
         * o react tippy não consegue carregar código jsx depois de atualizar         *
         * o produto, então como quebra galho após a atualizaçaõ do produto, a página *
         * é recarregada, para mostrar as alterações                                  * 
         * TAMBÉM ACONTECE AO EXCLUIR :(                                              *
         ******************************************************************************/
        // window.location.reload()
        // props.onProductUpdated(currentProduct.product_id, updatedProductData)

        closeProdEditModal()
        flashInfo()
    } catch(err) {
      console.log(err)
      flashError()
    }
  }

  /**
   * Hover de cada produto
   */
  const [hoveredProductId, setHoveredProductId] = useState(null)

  /**
   * Funcionalidade de abrir o container de categoria
   */
  const [showCategoryProducts, setShowCategoryProducts] = useState(false)

  const handleClickShow = () => {
    setShowCategoryProducts(!showCategoryProducts)
  }

  /**
   * Edição da categoria
   */
  const [categoryName, setCategoryName] = useState('')

  const handleCategoryUpdate = async(e) => {
      e.preventDefault()

      const categoryData = {
          category_name: categoryName,
      }

      try {
          await api
          .put(`/category/${props.categoryKey}`, categoryData)
          .then(response => console.log(response))
          
          props.onCategoryUpdated(props.categoryKey, categoryName)
          setCategoryName('')

          closeCategoryModal()
          flashInfo()
      } catch (err) {
          console.log(err)
          flashError()
      }
  }

  /**
   * Deleta a categoria
   */
  const handleCategoryDelete = async (category_id) => {
    try {
      await api
        .delete(`/category/${category_id}`)
        .then((response) => {console.log(response)})

        props.onCategoryDeleted(category_id)
        
        flashDelete()
    } catch (err) {
      console.log(err)
      flashError()
    }
  }

    return (
      // Container da categoria
    <div className='w-full alt-color-2-bg rounded border-[15px] border-[#6B3710] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.25)] mt-4'>
        <div className='border-l-[6px] border-r-[6px] border-[#D87B26] p-[1rem] h-[200px] overflow-y-auto flex flex-wrap relative'>
          <div className={`transition-opacity duration-200 absolute inset-0 alt-color-6-bg z-10 flex flex-col items-center justify-center ${!showCategoryProducts ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <figure className='w-[6rem] h-[6rem] rounded-full alt-color-4-bg border-4 border-[#D87B26] shadow-[inset_-2px_3px_2px_4px_rgba(0,0,0,0.2)]'>
            {props.categoryImage ? (
              <img
                src={`http://localhost:3001${props.categoryImage}`}
                alt={props.categoryName}
                className='w-full h-full object-cover rounded-full'
              />
            ) : null}
          </figure>
            <p className='my-2 font-pixel text-xl'>{ props.categoryName }</p>
            <div className='flex justify-evenly w-[10%]'>
              <p className='cursor-pointer' onClick={handleClickShow}>
                <i class="fa-solid fa-eye"></i>
              </p>
              <p className='cursor-pointer' onClick={() => handleCategoryDelete(props.categoryKey)}>
                <i class="fa-solid fa-trash"></i>
              </p>
              <p className='cursor-pointer' onClick={openCategoryModal}>
                <i class="fa-solid fa-pencil"></i>
              </p>
              {/* Ícone para alternar a visibilidade do filtro */}
              <p className='cursor-pointer' onClick={() => setFilterVisible(!isFilterVisible)}>
                <i className="fa-solid fa-filter"></i>
              </p>
              
            </div>
          </div>
          {isFilterVisible && (
            <ProductFilter onFilterChange={handleFilterChange} />
          )}
          

          
            {/*
              Aqui ocorre a criação de cada quadrado, é obtido uma lista com todos os produtos
              que são mapeados, cada produto irá gerar um quadrado e cada quadrado terá sua tooltip           
            */}
            {props.products.map((product, index) => {
              const unit = units.find((u) => u.unit_id === product.unit_id)?.unit_type || 'N/A'
              return (
                <Tooltip
                key={index}
                html={(
                  <div className={styles.myTippyTheme}>
                    <strong>Nome:</strong> {product.product_name}<br />
                    <strong>Unidade:</strong> {unit}<br />
                    <strong>Perecível:</strong> {product.is_perishable ? 'Sim' : 'Não'}
                  </div>
                )}
                title={product.product_name}
                arrow={true}
                theme='dark'
                delay={20}
                trigger='mouseenter'
              >
                <div key={index} className={`relative w-12 h-12 mb-4 bg-transparent border-l-[3px] border-b-[3px] border-[#FFE4A1] cursor-pointer ${styles.borderDepth}`} id={product.product_id} onMouseEnter={() => setHoveredProductId(product.product_id)}
                onMouseLeave={() => setHoveredProductId(null)}
                onClick={() => openProdEditModal(product)}
                >
                {hoveredProductId === product.product_id && (
                  <i 
                    className="fa-solid fa-trash absolute top-[-10px] right-[-5px] text-red-500 cursor-pointer" 
                    onClick={() => handleDelete(product.product_id)}
                  ></i>
                )}
                </div>
              </Tooltip>
              )
            })}

            {/* Botão para adicionar novo produto */}
            <button
                onClick={openModal}
                className="w-12 h-12 alt-color-4-bg border-[3px] border-[#D87B26] flex items-center justify-center text-2xl"
            >
            <i class="fa-solid fa-plus"></i>
            </button>
        </div>

        {/* Modal de produto */}
        {isModalOpen && (
          <div className="modal modal-open text-slate-400">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-white">Adicionar novo produto</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-white">Nome do produto</span>
                </label>
                <input type="text" placeholder="Digite o nome do produto" className="input input-bordered placeholder:text-slate-300" required name='product_name' value={productName} onChange={(e) => setProductName(e.target.value)} />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-white">Descrição (Opcional)</span>
                </label>
                <textarea placeholder="Digite a descrição do produto" className="textarea textarea-bordered" name='description' value={productDescription} onChange={(e) => setProductDescription(e.target.value)}></textarea>
              </div>

              <input type="hidden" value={props.categoryKey} />

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-white">Unidade</span>
                </label>
                <select value={productUnitId} onChange={(e) => setProductUnitId(parseInt(e.target.value))} className="select select-bordered">
                  <option disabled selected value="">Selecionar unidade</option>
                  {units.map((unit) => (
                    <option key={unit.unit_id} value={unit.unit_id}>{unit.unit_type}</option>
                  ))}
                </select>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-white">Fornecedor</span>
                </label>
                <select value={productSupplierId} onChange={(e) => setProductSupplierId(parseInt(e.target.value))} className="select select-bordered">
                  <option disabled selected value="">Selecionar fornecedor</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.supplier_id} value={supplier.supplier_id}>{supplier.supplier_name}</option>
                  ))}
                </select>
              </div>

              <div className="form-control mb-4">
                <label className="cursor-pointer label">
                  <span className="label-text text-white">É perecível</span>
                  <input type="checkbox" className="toggle toggle-primary" checked={isPerishable} onChange={(e) => setIsPerishable(e.target.checked)} />
                </label>
              </div>

              <div className="modal-action">
                <label htmlFor="product-modal" className="btn" onClick={closeModal}>Cancelar</label>
                <button type="submit" className="btn btn-primary">Salvar</button>
              </div>
            </form>
          </div>
          </div>
      )}

      {/* Modal para editar a categoria do produto */}
      {isCategoryModalOpen && (
        <Modal closeModal={closeCategoryModal} handleSubmit={handleCategoryUpdate} title="Atualizar categoria" modalName="category-modal">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-white">Nome da categoria</span>
                </label>
                <input type="text" placeholder="Digite o novo nome da categoria" className="input input-bordered placeholder:text-slate-300" required name='category_name' value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
              </div>
        </Modal>
      )}

      {/* Modal para editar produto */}
      {isProdEditModalOpen && (
        <Modal closeModal={closeProdEditModal} title="Editar Produto" handleSubmit={handleProdUpdate}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-white">Nome do produto</span>
            </label>
            <input type="text" className="input input-bordered" value={productName} onChange={(e) => setProductName(e.target.value)} />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-white">Descrição</span>
            </label>
            <textarea className="textarea textarea-bordered" value={productDescription} onChange={(e) => setProductDescription(e.target.value)}></textarea>
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-white">Unidade</span>
            </label>
            <select value={productUnitId} onChange={(e) => setProductUnitId(parseInt(e.target.value))} className="select select-bordered">
              <option disabled value="">Selecionar unidade</option>
              {units.map((unit) => (
                <option key={unit.unit_id} value={unit.unit_id}>{unit.unit_type}</option>
              ))}
            </select>
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-white">Fornecedor</span>
            </label>
            <select value={productSupplierId} onChange={(e) => setProductSupplierId(parseInt(e.target.value))} className="select select-bordered">
              <option disabled value="">Selecionar fornecedor</option>
              {suppliers.map((supplier) => (
                <option key={supplier.supplier_id} value={supplier.supplier_id}>{supplier.supplier_name}</option>
              ))}
            </select>
          </div>

          <div className="form-control mb-4">
            <label className="cursor-pointer label">
              <span className="label-text text-white">É perecível</span>
              <input type="checkbox" className="toggle toggle-primary" checked={isPerishable} onChange={(e) => setIsPerishable(e.target.checked)} />
            </label>
          </div>
        </Modal>
      )}

      {/* Componente flash message, verifica se o estado flash é true e então renderiza a flash message */}
      {flash && (
          <FlashMessage
              message={flash.message}
              type={flash.type}
              duration={3000}
              onClose={() => setFlash(null)}
          />
      )}
    </div>
    )
}

export default ProductCategory